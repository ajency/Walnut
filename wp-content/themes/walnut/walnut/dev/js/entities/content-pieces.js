var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.ContentPiece", function(ContentPiece, App, Backbone, Marionette, $, _) {
    var API, contentPiecesOfGroup;
    ContentPiece.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'ID';

      ItemModel.prototype.defaults = {
        ID: 0,
        post_title: '',
        creator: '',
        post_modified: '',
        post_date: '',
        post_tags: ''
      };

      ItemModel.prototype.name = 'content-piece';

      return ItemModel;

    })(Backbone.Model);
    ContentPiece.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = ContentPiece.ItemModel;

      ItemCollection.prototype.comparator = 'ID';

      ItemCollection.prototype.name = 'content-piece';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-content-pieces';
      };

      return ItemCollection;

    })(Backbone.Collection);
    ContentPiece.GroupItemCollection = (function(_super) {
      __extends(GroupItemCollection, _super);

      function GroupItemCollection() {
        this.addedPieces = __bind(this.addedPieces, this);
        this.removedModel = __bind(this.removedModel, this);
        return GroupItemCollection.__super__.constructor.apply(this, arguments);
      }

      GroupItemCollection.prototype.model = ContentPiece.ItemModel;

      GroupItemCollection.prototype.comparator = 'ID';

      GroupItemCollection.prototype.initialize = function() {
        this.on('remove', this.removedModel, this);
        return this.on('add', this.addedPieces, this);
      };

      GroupItemCollection.prototype.removedModel = function(model) {
        return this.trigger("content:pieces:of:group:removed", model);
      };

      GroupItemCollection.prototype.addedPieces = function(model) {
        return this.trigger("content:pieces:of:group:added", model);
      };

      return GroupItemCollection;

    })(Backbone.Collection);
    contentPiecesOfGroup = new ContentPiece.GroupItemCollection;
    API = {
      getContentPieces: function(param) {
        var contentPieceCollection;
        if (param == null) {
          param = {};
        }
        contentPieceCollection = new ContentPiece.ItemCollection;
        contentPieceCollection.fetch({
          reset: true,
          data: param
        });
        return contentPieceCollection;
      },
      getContentPiecesOfGroup: function(groupModel) {
        var contentID, contentIDs, contentModel, _i, _len;
        contentIDs = groupModel.get('content_pieces');
        if (contentIDs) {
          for (_i = 0, _len = contentIDs.length; _i < _len; _i++) {
            contentID = contentIDs[_i];
            if (typeof contentPieceCollection !== "undefined" && contentPieceCollection !== null) {
              contentModel = contentPieceCollection.get(contentID);
            }
            if (!contentModel) {
              contentModel = new ContentPiece.ItemModel({
                'ID': contentID
              });
              contentModel.fetch();
            }
            contentPiecesOfGroup.add(contentModel);
          }
        }
        return contentPiecesOfGroup;
      },
      getContentPieceByID: function(id) {
        var contentPiece;
        if (typeof contentPieceCollection !== "undefined" && contentPieceCollection !== null) {
          contentPiece = contentPieceCollection.get(id);
        }
        if (!contentPiece) {
          contentPiece = new ContentPiece.ItemModel({
            ID: id
          });
          contentPiece.fetch();
        }
        return contentPiece;
      },
      getContentPiecesByIDs: function(ids) {
        var contentPieces;
        if (ids == null) {
          ids = [];
        }
        contentPieces = new ContentPiece.ItemCollection;
        if (_.size(ids) > 0) {
          contentPieces.fetch({
            data: {
              ids: ids
            }
          });
          return contentPieces;
        }
      },
      getContentPieceFromLocal: function(ids) {
        var onSuccess, runMainQuery;
        runMainQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_posts WHERE post_type = 'content-piece' AND post_status = 'publish' AND ID in (" + ids + ")", [], onSuccess(d), _.deferredErrorHandler(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, r, result;
            result = [];
            i = 0;
            while (i < data.rows.length) {
              r = data.rows.item(i);
              (function(r, i) {
                var questionType;
                questionType = _.getQuestionType(r['ID']);
                return questionType.done(function(question_type) {
                  return result[i] = {
                    ID: r['ID'],
                    post_author: r['post_author'],
                    post_date: r['post_date'],
                    post_date_gmt: r['post_date_gmt'],
                    post_content: r['post_content'],
                    post_title: r['post_title'],
                    post_excerpt: r['post_excerpt'],
                    post_status: r['post_status'],
                    comment_status: r['comment_status'],
                    ping_status: r['ping_status'],
                    post_password: r['post_password'],
                    post_name: r['post_name'],
                    to_ping: r['to_ping'],
                    pinged: r['pinged'],
                    post_modified: r['post_modified'],
                    post_modified_gmt: r['post_modified_gmt'],
                    post_content_filtered: r['post_content_filtered'],
                    post_parent: r['post_parent'],
                    guid: r['guid'],
                    menu_order: r['menu_order'],
                    post_type: r['post_type'],
                    post_mime_type: r['post_mime_type'],
                    comment_count: r['comment_count'],
                    question_type: question_type,
                    filter: 'raw',
                    subjects: '',
                    creator: 'admin',
                    content_type: ''
                  };
                });
              })(r, i);
              i++;
            }
            return d.resolve(result);
          };
        };
        return $.when(runMainQuery()).done(function(d) {
          return console.log('Content piece transaction completed');
        }).fail(_.failureHandler);
      }
    };
    App.reqres.setHandler("get:content:pieces", function(opt) {
      return API.getContentPieces(opt);
    });
    App.reqres.setHandler("get:content:pieces:of:group", function(groupModel) {
      return API.getContentPiecesOfGroup(groupModel);
    });
    App.reqres.setHandler("get:content:piece:by:id", function(id) {
      return API.getContentPieceByID(id);
    });
    App.reqres.setHandler("get:content:pieces:by:ids", function(ids) {
      return API.getContentPiecesByIDs(ids);
    });
    return App.reqres.setHandler("get:content-piece:local", function(ids) {
      return API.getContentPieceFromLocal(ids);
    });
  });
});
