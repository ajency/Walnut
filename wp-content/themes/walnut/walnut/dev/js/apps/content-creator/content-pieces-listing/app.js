var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'bootbox', 'apps/content-creator/content-pieces-listing/views'], function(App, RegionController, bootbox) {
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
        this.contentPiecesCollection.comparator = 'ID';
        this.subCollection = App.request("empty:content:pieces:collection");
        fetchModels = this._getModels();
        return fetchModels.done(this._showViews);
      };

      ContentPiecesController.prototype._getModels = function(direction) {
        var chapterID, currentIndex, fromID, fromModel, models, modelsFetch;
        if (direction == null) {
          direction = 'current';
        }
        this.defer = $.Deferred();
        if (this.contentPiecesCollection.isEmpty()) {
          chapterID = this.contentPieceModel.get('term_ids').chapter;
        } else {
          fromModel = direction === 'next' ? this.subCollection.last() : this.subCollection.first();
          chapterID = fromModel.get('chapterID');
        }
        models = this.contentPiecesCollection.where({
          'chapterID': chapterID
        });
        if (!_.isEmpty(models)) {
          fromID = direction === 'next' ? this.subCollection.last().id : this.subCollection.first().id;
          currentIndex = _.indexOf(models, this.contentPiecesCollection.get(fromID));
          if (direction === 'current' || direction === 'next') {
            currentIndex++;
            models = models.slice(currentIndex, currentIndex + 12);
          } else {
            currentIndex = currentIndex - 12;
            models = models.slice(currentIndex, currentIndex + 12);
          }
        }
        if (_.isEmpty(models)) {
          modelsFetch = this._getMoreItems(direction);
          modelsFetch.done((function(_this) {
            return function(resp) {
              var chapterItems, items;
              _this.contentPiecesCollection.add(resp.items);
              _this.contentPiecesCollection.sort();
              chapterItems = _this.contentPiecesCollection.where({
                'chapterID': resp.chapterID
              });
              if (direction === 'current') {
                fromID = _this.contentPieceModel.id;
                if (chapterItems.length <= 12) {
                  fromID = _.first(chapterItems).id;
                }
              } else {
                fromID = direction === 'next' ? _this.subCollection.last().id : _this.subCollection.first().id;
              }
              currentIndex = _.indexOf(chapterItems, _this.contentPiecesCollection.get(fromID));
              if (currentIndex === -1) {
                currentIndex = 0;
              }
              if (direction === 'current' || direction === 'next') {
                items = chapterItems.slice(currentIndex, currentIndex + 12);
              } else {
                currentIndex = currentIndex - 12;
                if (currentIndex === -12) {
                  items = chapterItems.slice(currentIndex);
                } else {
                  items = chapterItems.slice(currentIndex, currentIndex + 12);
                }
              }
              if (items.length > 0) {
                _this.subCollection.reset(items);
              }
              return _this.defer.resolve(_this.subCollection);
            };
          })(this));
        } else {
          if (models.length > 0) {
            this.subCollection.reset(models);
          }
          this.defer.resolve(this.subCollection);
        }
        return this.defer.promise();
      };

      ContentPiecesController.prototype._getMoreItems = function(direction) {
        var chapterID, data, fromModel;
        if (direction === 'current') {
          chapterID = this.contentPieceModel.get('term_ids').chapter;
        } else {
          fromModel = direction === 'next' ? this.subCollection.last() : this.subCollection.first();
          chapterID = fromModel.get('term_ids').chapter;
        }
        this.deferAJAX = $.Deferred();
        data = {
          'action': 'get-adjacent-content-pieces',
          'chapterID': chapterID,
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
        var models;
        collection.comparator = 'ID';
        collection.sort();
        this.textbookName = collection.first().get('textbookName');
        this.chapterName = collection.first().get('chapterName');
        models = collection.filter((function(_this) {
          return function(model) {
            if (model.get('textbookName') === _this.textbookName && model.get('chapterName') === _this.chapterName) {
              return model;
            }
          };
        })(this));
        collection.reset(models);
        this.view = new ContentPieces.Views.ContentPieces({
          model: this.contentPieceModel,
          collection: collection
        });
        this.show(this.view);
        this.listenTo(this.view, "itemview:change:content:piece", (function(_this) {
          return function(iv, model) {
            var modelData, msg;
            modelData = model.toJSON();
            msg = _this._getNavigatingMsg(modelData);
            if (msg) {
              return bootbox.confirm(msg, function(confirm) {
                if (confirm) {
                  _this.region.trigger('change:content:piece', model.id);
                  return _this.contentPieceModel = model;
                }
              });
            } else {
              _this.region.trigger('change:content:piece', model.id);
              return _this.contentPieceModel = model;
            }
          };
        })(this));
        this.listenTo(this.view, "change:content:piece", (function(_this) {
          return function(direction) {
            var chapterItems, currentIndex, getItems, model, nextIndex;
            chapterItems = _this.contentPiecesCollection.where({
              'chapterID': _this.contentPieceModel.get('term_ids').chapter
            });
            currentIndex = _.indexOf(chapterItems, _this.contentPiecesCollection.get(_this.contentPieceModel.id));
            nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
            model = chapterItems[nextIndex];
            if (model) {
              return _this.region.trigger('change:content:piece', model.id);
            } else {
              getItems = _this._getMoreItems(direction);
              return getItems.done(function(resp) {
                var msg, nextItem;
                if (resp.items.length > 0) {
                  if (resp.items.length > 0) {
                    resp.items = _.sortBy(resp.items, 'ID');
                  }
                  nextItem = direction === 'next' ? _.first(resp.items) : _.last(resp.items);
                  msg = _this._getNavigatingMsg(nextItem);
                  return bootbox.confirm(msg, function(confirm) {
                    if (confirm) {
                      return _this.region.trigger('change:content:piece', nextItem.ID);
                    }
                  });
                }
              });
            }
          };
        })(this));
        return this.listenTo(this.view, "browse:more", this._browseMore);
      };

      ContentPiecesController.prototype._getNavigatingMsg = function(item) {
        var currentChapter, currentTextbook, newChapter, newTextbook;
        currentTextbook = this.contentPieceModel.get('term_ids').textbook;
        newTextbook = item.term_ids.textbook;
        if (currentTextbook !== newTextbook) {
          return "<h4>Textbook Change<br> You will be navigating to textbook: <span class='semi-bold'> " + item.textbookName + "</span></h4>";
        }
        currentChapter = this.contentPieceModel.get('term_ids').chapter;
        newChapter = item.term_ids.chapter;
        if (currentChapter !== newChapter) {
          return "<h4>Chapter Change<br> You will be navigating to chapter: <span class='semi-bold'> " + item.chapterName + "</span></h4>";
        }
      };

      ContentPiecesController.prototype._browseMore = function(direction) {
        var fetchModels;
        fetchModels = this._getModels(direction);
        return fetchModels.done((function(_this) {
          return function(collection) {
            var models;
            if (!collection.isEmpty()) {
              _this.textbookName = collection.first().get('textbookName');
              _this.chapterName = collection.first().get('chapterName');
              models = collection.filter(function(model) {
                if (model.get('textbookName') === _this.textbookName && model.get('chapterName') === _this.chapterName) {
                  return model;
                }
              });
              if (models.length > 0) {
                return _this.view.collection.reset(models);
              }
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
