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
        console.log(this.contentPiecesCollection);
        return App.execute("when:fetched", this.contentPiecesCollection, (function(_this) {
          return function() {
            var view;
            console.log(_this.contentPiecesCollection);
            _this.fullCollection = _this.contentPiecesCollection.clone();
            _this.view = view = _this._getContentPiecesListView();
            _this.show(view, {
              loading: true,
              entities: [_this.contentPiecesCollection, _this.textbooksCollection, _this.fullCollection]
            });
            _this.listenTo(_this.view, {
              "fetch:chapters": function(term_id) {
                var chaptersCollection;
                chaptersCollection = App.request("get:chapters", {
                  'parent': term_id
                });
                return App.execute("when:fetched", chaptersCollection, function() {
                  return _this.view.triggerMethod('fetch:chapters:complete', chaptersCollection);
                });
              }
            });
            return _this.listenTo(_this.view, {
              "fetch:sections:subsections": function(term_id) {
                var allSectionsCollection;
                allSectionsCollection = App.request("get:subsections:by:chapter:id", {
                  'child_of': term_id
                });
                return App.execute("when:fetched", allSectionsCollection, (function(_this) {
                  return function() {
                    var allSections, sectionsList, subsectionsList;
                    sectionsList = allSectionsCollection.where({
                      'parent': term_id
                    });
                    subsectionsList = _.difference(allSectionsCollection.models, sectionsList);
                    allSections = {
                      'sections': sectionsList,
                      'subsections': subsectionsList
                    };
                    return _this.view.triggerMethod('fetch:subsections:complete', allSections);
                  };
                })(this));
              }
            });
          };
        })(this));
      };

      ListController.prototype._getContentPiecesListView = function() {
        console.log(this.fullCollection);
        return new ContentList.Views.ListView({
          collection: this.contentPiecesCollection,
          fullCollection: this.fullCollection,
          templateHelpers: {
            textbooksFilter: (function(_this) {
              return function() {
                var textbooks;
                textbooks = [];
                _.each(_this.textbooksCollection.models, function(el, ind) {
                  return textbooks.push({
                    'name': el.get('name'),
                    'id': el.get('term_id')
                  });
                });
                return textbooks;
              };
            })(this)
          }
        });
      };

      return ListController;

    })(RegionController);
  });
});
