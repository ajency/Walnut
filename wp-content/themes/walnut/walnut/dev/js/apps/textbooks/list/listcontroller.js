var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/textbooks/list/views'], function(App, RegionController) {
  return App.module("TextbooksApp.List", function(List, App) {
    return List.ListController = (function(superClass) {
      extend(ListController, superClass);

      function ListController() {
        return ListController.__super__.constructor.apply(this, arguments);
      }

      ListController.prototype.initialize = function() {
        var breadcrumb_items, classesCollection, textbooksCollection, view;
        window.textbooksCollectionOrigninal = App.request("get:textbooks", {
          "fetch_all": true
        });
        textbooksCollection = App.request("get:textbooks", {
          "fetch_all": true
        });
        classesCollection = breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript://'
            }, {
              'label': 'Textbooks',
              'link': 'javascript://',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.view = view = this._getTextbooksView(textbooksCollection);
        this.listenTo(this.view, 'show:add:textbook:popup', (function(_this) {
          return function(collection1) {
            _this.collection = collection1;
            return App.execute('add:textbook:popup', {
              region: App.dialogRegion,
              collection: _this.collection
            });
          };
        })(this));
        this.listenTo(this.view, 'search:textbooks', (function(_this) {
          return function(collection) {
            return _this._getSearchTextbooksView(collection);
          };
        })(this));
        this.listenTo(this.view, 'reload:textbooks', (function(_this) {
          return function(collection) {
            return _this;
          };
        })(this));
        this.listenTo(this.view, {
          'before:search:textbook': function() {
            return console.log(textbooksCollection);
          }
        });
        return this.show(view, {
          loading: true
        });
      };

      ListController.prototype._getTextbooksView = function(collection) {
        return new List.Views.ListView({
          collection: collection
        });
      };

      ListController.prototype._getSearchTextbooksView = function(collection) {
        return new List.Views.ListView({
          collection: collection
        });
      };

      return ListController;

    })(RegionController);
  });
});
