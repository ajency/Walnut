var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.ContentPiece", function(Textbooks, App, Backbone, Marionette, $, _) {
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
        post_author: '',
        post_modified: '',
        post_date: '',
        post_tags: ''
      };

      ItemModel.prototype.name = 'contentPiece';

      return ItemModel;

    })(Backbone.Model);
    ContentPiece.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = ContentPiece.ItemModel;

      ItemCollection.prototype.comparator = 'ID';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-content-pieces';
      };

      ItemCollection.prototype.parse = function(resp) {
        this.total = resp.count;
        return resp.data;
      };

      return ItemCollection;

    })(Backbone.Collection);
    contentPieceCollection = new ContentPiece.ItemCollection;
    API = {
      getContentPieces: function(param) {
        if (param == null) {
          param = {};
        }
        console.log(param);
        contentPieceCollection.fetch({
          reset: true,
          data: param
        });
        return contentPieceCollection;
      },
      getContentPieceByID: function(id) {
        var contentPiece;
        contentPiece = contentPieceCollection.get(id);
        if (!contentPiece) {
          contentPiece = new ContentPiece.ItemModel({
            ID: id
          });
          console.log(contentPiece);
          contentPiece.fetch();
        }
        return contentPiece;
      }
    };
    App.reqres.setHandler("get:content:pieces", function(opt) {
      return API.getContentPieces(opt);
    });
    return App.reqres.setHandler("get:content:piece:by:id", function(id) {
      return API.getContentPieceByID(id);
    });
  });
});
