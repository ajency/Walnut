var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.ContentPiece", function(ContentPiece, App, Backbone, Marionette, $, _) {
    var API, contentPiecesRepository;
    ContentPiece.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

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
        var layout;
        layout = this.get('layout');
        _.each(layout, function(ele) {
          var options;
          if (ele.marks) {
            ele.marks = ele.marks * multiplicationFactor;
          }
          if (_.has(ele, 'optionCollection')) {
            options = ele.optionCollection;
          }
          if (_.has(ele, 'elements')) {
            options = ele.elements;
          }
          if (_.has(ele, 'blanksArray')) {
            options = ele.blanksArray;
          }
          if (options) {
            return _.each(options, function(op) {
              if (op.marks) {
                return op.marks = op.marks * multiplicationFactor;
              }
            });
          }
        });
        this.set({
          'marks': multiplicationFactor * this.get('marks')
        });
        return this;
      };

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
    contentPiecesRepository = new ContentPiece.ItemCollection;
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
        var contentPieces, id, model, _i, _len;
        if (ids == null) {
          ids = [];
        }
        contentPieces = new ContentPiece.ItemCollection;
        for (_i = 0, _len = ids.length; _i < _len; _i++) {
          id = ids[_i];
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
    App.reqres.setHandler("get:content:pieces:repository", function() {
      return contentPiecesRepository.clone();
    });
    return App.reqres.setHandler("app:reset:content:pieces:repository", function(models) {
      return contentPiecesRepository.reset(models);
    });
  });
});
