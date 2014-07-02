var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-pieces/list-content-pieces/views'], function(App, RegionController) {
  return App.module("ContentPiecesApp.ContentList", function(ContentList, App) {
    return ContentList.ListController = (function(_super) {
      __extends(ListController, _super);

      function ListController() {
        return ListController.__super__.constructor.apply(this, arguments);
      }

      ListController.prototype.initialize = function() {
        var breadcrumb_items;
        console.log("list");
        this.contentPiecesCollection = App.request("get:content:pieces");
        this.textbooksCollection = App.request("get:textbooks");
        this.allChaptersCollection = null;
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript://'
            }, {
              'label': 'All Content Pieces',
              'link': 'javascript://',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        return App.execute("when:fetched", [this.contentPiecesCollection, this.textbooksCollection], (function(_this) {
          return function() {
            var chapter_ids;
            chapter_ids = _.chain(_this.contentPiecesCollection.pluck('term_ids')).pluck('chapter').unique().compact().value();
            _this.allChaptersCollection = App.request("get:textbook:names:by:ids", chapter_ids);
            _this.fullCollection = _this.contentPiecesCollection.clone();
            return App.execute("when:fetched", _this.allChaptersCollection, function() {
              var view;
              _this.view = view = _this._getContentPiecesListView();
              _this.show(view, {
                loading: true,
                entities: [_this.contentPiecesCollection, _this.textbooksCollection, _this.fullCollection]
              });
              return _this.listenTo(_this.view, "fetch:chapters:or:sections", function(parentID, filterType) {
                var chaptersOrSections;
                chaptersOrSections = App.request("get:chapters", {
                  'parent': parentID
                });
                return App.execute("when:fetched", chaptersOrSections, function() {
                  return _this.view.triggerMethod("fetch:chapters:or:sections:completed", chaptersOrSections, filterType);
                });
              });
            });
          };
        })(this));
      };

      ListController.prototype._getContentPiecesListView = function() {
        return new ContentList.Views.ListView({
          collection: this.contentPiecesCollection,
          fullCollection: this.fullCollection,
          textbooksCollection: this.textbooksCollection,
          chaptersCollection: this.allChaptersCollection
        });
      };

      return ListController;

    })(RegionController);
  });
});
