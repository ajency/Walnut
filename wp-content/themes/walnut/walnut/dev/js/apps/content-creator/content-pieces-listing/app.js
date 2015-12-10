var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/content-pieces-listing/views'], function(App, RegionController) {
  return App.module("ContentCreator.ContentPieces", function(ContentPieces, App, Backbone, Marionette, $, _) {
    var ContentPiecesController;
    ContentPiecesController = (function(_super) {
      __extends(ContentPiecesController, _super);

      function ContentPiecesController() {
        this._browseMore = __bind(this._browseMore, this);
        this._showViews = __bind(this._showViews, this);
        this._getMoreItems = __bind(this._getMoreItems, this);
        return ContentPiecesController.__super__.constructor.apply(this, arguments);
      }

      ContentPiecesController.prototype.initialize = function(options) {
        var fetchModels;
        this.contentPieceModel = options.contentPieceModel;
        this.contentPiecesCollection = App.request("empty:content:pieces:collection");
        this.contentPiecesCollection.comparator = 'post_modified';
        this.contentPiecesCollection.fetch_next = true;
        this.contentPiecesCollection.fetch_prev = true;
        fetchModels = this._getModels(this.contentPieceModel.id);
        return fetchModels.done(this._showViews);
      };

      ContentPiecesController.prototype._getModels = function(fromID, direction) {
        var collection, models, modelsFetch;
        if (direction == null) {
          direction = 'next';
        }
        this.defer = $.Deferred();
        models = this.contentPiecesCollection.models;
        this.currentIndex = 0;
        if (!_.isEmpty(models)) {
          this.currentIndex = _.indexOf(this.contentPiecesCollection.models, this.contentPiecesCollection.get(fromID));
          if (direction === 'next') {
            this.currentIndex++;
            models = this.contentPiecesCollection.models.slice(this.currentIndex, this.currentIndex + 12);
          } else {
            this.currentIndex = this.currentIndex - 12;
            models = this.contentPiecesCollection.models.slice(this.currentIndex, this.currentIndex + 12);
          }
        }
        if (models.length < 12 && this.contentPiecesCollection["fetch_" + direction]) {
          modelsFetch = this._getMoreItems(fromID, direction);
          modelsFetch.done((function(_this) {
            return function(resp) {
              var collection, items;
              _this.contentPiecesCollection.add(resp.items);
              _this.contentPiecesCollection.sort();
              if (direction === 'next') {
                items = _this.contentPiecesCollection.models.slice(_this.currentIndex, _this.currentIndex + 12);
              } else {
                _this.currentIndex = _this.currentIndex - 12;
                items = _this.contentPiecesCollection.models.slice(_this.currentIndex, _this.currentIndex + 12);
              }
              if (resp.status === 'over') {
                _this.contentPiecesCollection["fetch_" + direction] = false;
              }
              collection = App.request("empty:content:pieces:collection");
              collection.reset(items);
              return _this.defer.resolve(collection);
            };
          })(this));
        } else {
          collection = App.request("empty:content:pieces:collection");
          collection.reset(models);
          this.defer.resolve(collection);
        }
        return this.defer.promise();
      };

      ContentPiecesController.prototype._getMoreItems = function(fromID, direction) {
        var data;
        this.deferAJAX = $.Deferred();
        data = {
          'action': 'get-adjacent-content-pieces',
          'ID': fromID,
          'direction': direction
        };
        $.get(AJAXURL, data).done((function(_this) {
          return function(resp) {
            return _this.deferAJAX.resolve(resp);
          };
        })(this));
        return this.deferAJAX.promise();
      };

      ContentPiecesController.prototype._showViews = function(collection) {
        collection.comparator = 'post_modified';
        collection.sort();
        this.view = new ContentPieces.Views.ContentPieces({
          model: this.contentPieceModel,
          collection: collection
        });
        this.show(this.view);
        this.listenTo(this.view, "itemview:change:content:piece", (function(_this) {
          return function(iv, model) {
            _this.contentPieceModel = model;
            iv.model.set({
              'isActive': true
            });
            return App.navigate("edit-content/" + model.id, true);
          };
        })(this));
        this.listenTo(this.view, "change:content:piece", (function(_this) {
          return function(direction) {

            var currentIndex=0, getItems, model, nextIndex;
 
            currentIndex = _.indexOf(_this.contentPiecesCollection.models, _this.contentPiecesCollection.get(_this.contentPieceModel.id));
            nextIndex = direction === 'next' ? currentIndex - 1 : currentIndex + 1;
            console.log(_this.contentPiecesCollection);
            model = _this.contentPiecesCollection.at(nextIndex);
            console.log(model);
            console.log('testing change content piece');
            if (model) {
              return App.navigate("edit-content/" + model.id, true);
            } else {
              getItems = _this._getMoreItems(_this.contentPieceModel.id, direction);
              return getItems.done(function(resp) {
                if (resp.items.length > 0) {
                  return App.navigate("edit-content/" + resp.items[0].ID, true);
                }
              });
            }
          };
        })(this));
        return this.listenTo(this.view, "browse:more", this._browseMore);
      };


      ContentPiecesController.prototype._browseMore = function(direction) {
        var fetchModels, fromModel;
        fromModel = direction === 'next' ? this.view.collection.last() : this.view.collection.first();
        fetchModels = this._getModels(fromModel.id, direction);
        return fetchModels.done((function(_this) {
          return function(collection) {
            if (collection.length > 0) {
              return _this.view.collection.reset(collection.models);
            }
          };
        })(this));
      };

      return ContentPiecesController;

    })(RegionController);
    return App.commands.setHandler("show:content:creator:pieces:listing", function(options) {
      return new ContentPiecesController(options);
    });
  });
});
