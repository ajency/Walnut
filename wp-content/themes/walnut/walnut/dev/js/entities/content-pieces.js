var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.ContentPiece", function(ContentPiece, App, Backbone, Marionette, $, _) {
    var API, contentPieceCollection, contentPiecesOfGroup;
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
    contentPiecesOfGroup = new ContentPiece.GroupItemCollection;
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
        var contentGroup;
        if (groupid == null) {
          groupid = '';
        }
        if (groupid) {
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
        if (_.size(ids) > 0) {
          contentPieces = new ContentPiece.ItemCollection;
          contentPieces.fetch({
            data: {
              ids: ids
            }
          });
          return contentPieces;
        }
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
    return App.reqres.setHandler("get:content:pieces:by:ids", function(ids) {
      return API.getContentPiecesByIDs(ids);
    });
  });
});