var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.ContentPiece", function(ContentPiece, App, Backbone, Marionette, $, _) {
    var API, contentPieceCollection;
    ContentPiece.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'ID';

      ItemModel.prototype.defaults = {
        ID: '',
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
    contentPieceCollection = new ContentPiece.ItemCollection;
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
    API = {
      getContentPieces: function(param) {
        if (param == null) {
          param = {};
        }
        contentPieceCollection.fetch({
          reset: true,
          data: param
        });
        return contentPieceCollection;
      },
      getContentPiecesOfGroup: function(groupid) {
        var contentGroup, contentPiecesOfGroup;
        if (groupid == null) {
          groupid = '';
        }
        if (groupid) {
          contentPiecesOfGroup = new ContentPiece.GroupItemCollection;
          contentGroup = App.request("get:content:group:by:id", groupid);
          App.execute("when:fetched", contentGroup, (function(_this) {
            return function() {
              var contentID, contentIDs, contentModel, _i, _len;
              contentIDs = contentGroup.get('content_pieces');
              for (_i = 0, _len = contentIDs.length; _i < _len; _i++) {
                contentID = contentIDs[_i];
                contentModel = contentPieceCollection.get(contentID);
                if (!contentModel) {
                  contentModel = new ContentPiece.ItemModel({
                    'ID': contentID
                  });
                  contentModel.fetch();
                }
                contentPiecesOfGroup.add(contentModel);
              }
              return contentPiecesOfGroup;
            };
          })(this));
        }
        return contentPiecesOfGroup;
      },
      getContentPieceByID: function(id) {
        var contentPiece;
        contentPiece = contentPieceCollection.get(id);
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
        var onFailure, onSuccess, runQuery;
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_posts WHERE post_type = 'content-piece' AND post_status = 'publish' AND ID in (" + ids + ")", [], onSuccess(d), onFailure(d));
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
              result[i] = {
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
                filter: 'raw',
                subjects: '',
                creator: 'admin',
                content_type: '',
                question_type: 'individual'
              };
              i++;
            }
            return d.resolve(result);
          };
        };
        onFailure = function(d) {
          return function(tx, error) {
            return d.reject('ERROR: ' + error);
          };
        };
        return $.when(runQuery()).done(function(d) {
          return console.log('Content piece transaction completed');
        }).fail(function(error) {
          return console.log('ERROR: ' + error);
        });
      }
    };
    App.reqres.setHandler("get:content:pieces", function(opt) {
      return API.getContentPieces(opt);
    });
    App.reqres.setHandler("get:content:pieces:of:group", function(groupid) {
      return API.getContentPiecesOfGroup(groupid);
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
