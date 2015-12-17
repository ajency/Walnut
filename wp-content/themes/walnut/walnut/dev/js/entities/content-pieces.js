var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["app", 'backbone', 'bootbox'], function(App, Backbone, bootbox) {
  return App.module("Entities.ContentPiece", function(ContentPiece, App, Backbone, Marionette, $, _) {
    var API, contentPiecesRepository;
    ContentPiece.ItemModel = (function(superClass) {
      extend(ItemModel, superClass);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'ID';

      ItemModel.prototype.defaults = {
        post_title: '',
        post_author: '',
        post_author_name: '',
        post_modified: '',
        post_date: '',
        post_tags: '',
        order: ''
      };

      ItemModel.prototype.name = 'content-piece';

      ItemModel.prototype.setMarks = function(multiplicationFactor) {
        this.set({
          'marks': multiplicationFactor * this.get('marks')
        });
        this.set({
          'multiplicationFactor': multiplicationFactor
        });
        return this;
      };

      ItemModel.prototype.duplicate = function() {
        return bootbox.confirm("Are you sure you want to clone this content piece ?", (function(_this) {
          return function(result) {
            var contentPieceData;
            if (result) {
              _this.cloneModel = App.request("new:content:piece");
              contentPieceData = _this.toJSON();
              _this.clonedData = _.omit(contentPieceData, ['ID', 'guid', 'last_modified_by', 'post_author', 'post_author_name', 'post_date', 'post_date_gmt', 'published_by']);
              _this.clonedData.post_status = "pending";
              _this.clonedData.clone_id = _this.id;
              return App.execute("when:fetched", _this.cloneModel, function() {
                return _this.cloneModel.save(_this.clonedData, {
                  wait: true,
                  success: function(model) {
                    return document.location = SITEURL + ("/content-creator/#edit-content/" + model.id);
                  },
                  error: function(error) {
                    return console.log(error);
                  }
                });
              });
            }
          };
        })(this));
      };

      return ItemModel;

    })(Backbone.Model);
    ContentPiece.ItemCollection = (function(superClass) {
      extend(ItemCollection, superClass);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = ContentPiece.ItemModel;

      ItemCollection.prototype.comparator = 'order';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-content-pieces';
      };

      return ItemCollection;

    })(Backbone.Collection);
    contentPiecesRepository = new ContentPiece.ItemCollection;
    ContentPiece.GroupItemCollection = (function(superClass) {
      extend(GroupItemCollection, superClass);

      function GroupItemCollection() {
        this.addedPieces = bind(this.addedPieces, this);
        this.removedModel = bind(this.removedModel, this);
        return GroupItemCollection.__super__.constructor.apply(this, arguments);
      }

      GroupItemCollection.prototype.model = ContentPiece.ItemModel;

      GroupItemCollection.prototype.comparator = 'order';

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
          add: true,
          remove: false,
          data: param,
          type: 'post',
          success: function(resp) {
            if (!param.search_str) {
              return contentPiecesRepository.reset(resp.models);
            }
          }
        });
        return contentPieceCollection;
      },
      getContentPiecesOfGroup: function(groupModel) {
        var contentID, contentIDs, contentModel, contentPiecesOfGroup, i, len;
        contentPiecesOfGroup = new ContentPiece.GroupItemCollection;
        contentIDs = groupModel.get('content_pieces');
        if (contentIDs) {
          for (i = 0, len = contentIDs.length; i < len; i++) {
            contentID = contentIDs[i];
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
        contentPiece = contentPiecesRepository.get(id);
        if (!contentPiece) {
          contentPiece = new ContentPiece.ItemModel({
            ID: id
          });
          contentPiece.fetch({
            success: function(resp) {
              return contentPiecesRepository.add(resp);
            }
          });
        }
        return contentPiece;
      },
      getContentPiecesByIDs: function(ids) {
        var contentPieces, i, id, len, model;
        if (ids == null) {
          ids = [];
        }
        contentPieces = new ContentPiece.ItemCollection;
        for (i = 0, len = ids.length; i < len; i++) {
          id = ids[i];
          model = contentPiecesRepository.get(id);
          if (model) {
            contentPieces.add(model);
            ids = _.without(ids, id);
          }
        }
        if (_.size(ids) > 0) {
          contentPieces.fetch({
            add: true,
            remove: false,
            data: {
              ids: ids
            }
          });
        }
        return contentPieces;
      },
      newContentPiece: function() {
        var contentPiece;
        return contentPiece = new ContentPiece.ItemModel;
      },
      emptyContentCollection: function() {
        var contentPieces;
        return contentPieces = new ContentPiece.ItemCollection;
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
    App.reqres.setHandler("new:content:piece", function() {
      return API.newContentPiece();
    });
    App.reqres.setHandler("empty:content:pieces:collection", function() {
      return API.emptyContentCollection();
    });
    return App.reqres.setHandler("get:content:pieces:repository", function() {
      return contentPiecesRepository.clone();
    });
  });
});
