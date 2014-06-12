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

      ItemCollection.prototype.comparator = 'order';

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
    return App.reqres.setHandler("get:content:pieces:by:ids", function(ids) {
      return API.getContentPiecesByIDs(ids);
    });
  });
});
