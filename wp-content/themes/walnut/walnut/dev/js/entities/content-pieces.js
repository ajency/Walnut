var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.ContentPiece", function(ContentPiece, App, Backbone, Marionette, $, _) {
    var API;
    ContentPiece.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'ID';

      ItemModel.prototype.defaults = {
        ID: 0,
        post_title: '',
        post_author: '',
        post_author_name: '',
        post_modified: '',
        post_date: '',
        post_tags: '',
        order: ''
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

      ItemCollection.prototype.comparator = 'order';

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

      GroupItemCollection.prototype.comparator = 'order';

      GroupItemCollection.prototype.name = 'content-piece';

      GroupItemCollection.prototype.initialize = function() {
        console.log('content piece ');
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
        var contentPieceCollection;
        if (param == null) {
          param = {};
        }
        contentPieceCollection = new ContentPiece.ItemCollection;
        contentPieceCollection.fetch({
          reset: true,
          add: true,
          remove: false,
          data: param
        });
        return contentPieceCollection;
      },
      getContentPiecesOfGroup: function(groupModel) {
        var contentID, contentIDs, contentModel, contentPiecesOfGroup, _i, _len;
        contentPiecesOfGroup = new ContentPiece.GroupItemCollection;
        contentIDs = groupModel.get('content_pieces');
        if (contentIDs) {
          for (_i = 0, _len = contentIDs.length; _i < _len; _i++) {
            contentID = contentIDs[_i];
            contentModel = new ContentPiece.ItemModel({
              'ID': contentID
            });
            contentModel.fetch();
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
        }
        return contentPieces;
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
            var i, result, row, _fn, _i, _ref;
            result = [];
            _fn = function(row, i) {
              var postAuthorName;
              postAuthorName = _.getPostAuthorName(row['post_author']);
              return postAuthorName.done(function(author_name) {
                return (function(row, i, author_name) {
                  var metaValue;
                  metaValue = _.getMetaValue(row['ID']);
                  return metaValue.done(function(meta_value) {
                    return (function(row, i, author_name, meta_value) {
                      var gradingParams;
                      gradingParams = _.getGradingParams(row['ID']);
                      return gradingParams.done(function(grading_params) {
                        return (function(row, i, author_name, meta_value, grading_params) {
                          var contentElementsArray;
                          if (meta_value.layout_json) {
                            contentElementsArray = _.getJsonToClone(meta_value.layout_json);
                            return contentElementsArray.done(function(contentElements) {
                              var excerpt, excerpt_array, taglessArray;
                              _.mixin(_.str.exports());
                              excerpt_array = contentElements.excerpt;
                              excerpt_array = _.flatten(excerpt_array);
                              taglessArray = new Array;
                              _.each(excerpt_array, function(excerpt) {
                                return taglessArray.push(_(excerpt).stripTags());
                              });
                              excerpt = taglessArray.join(' | ');
                              excerpt = _(excerpt).prune(150);
                              return result[i] = {
                                ID: row['ID'],
                                post_author: row['post_author'],
                                post_date: row['post_date'],
                                post_date_gmt: row['post_date_gmt'],
                                post_content: row['post_content'],
                                post_title: row['post_title'],
                                post_excerpt: excerpt,
                                post_status: row['post_status'],
                                comment_status: row['comment_status'],
                                ping_status: row['ping_status'],
                                post_password: row['post_password'],
                                post_name: row['post_name'],
                                to_ping: row['to_ping'],
                                pinged: row['pinged'],
                                post_modified: row['post_modified'],
                                post_modified_gmt: row['post_modified_gmt'],
                                post_content_filtered: row['post_content_filtered'],
                                post_parent: row['post_parent'],
                                guid: row['guid'],
                                menu_order: row['menu_order'],
                                post_type: row['post_type'],
                                post_mime_type: row['post_mime_type'],
                                comment_count: row['comment_count'],
                                filter: 'raw',
                                post_author_name: author_name,
                                content_type: meta_value.content_type,
                                layout: contentElements.elements,
                                question_type: meta_value.question_type,
                                post_tags: meta_value.post_tags,
                                duration: meta_value.duration,
                                last_modified_by: meta_value.last_modified_by,
                                published_by: meta_value.published_by,
                                term_ids: meta_value.term_ids,
                                instructions: meta_value.instructions,
                                order: _.indexOf(ids, row['ID'].toString()),
                                grading_params: grading_params
                              };
                            });
                          }
                        })(row, i, author_name, meta_value, grading_params);
                      });
                    })(row, i, author_name, meta_value);
                  });
                })(row, i, author_name);
              });
            };
            for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
              row = data.rows.item(i);
              _fn(row, i);
            }
            return d.resolve(result);
          };
        };
        return $.when(runMainQuery()).done(function(d) {
          return console.log('getContentPieceFromLocal transaction completed');
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
