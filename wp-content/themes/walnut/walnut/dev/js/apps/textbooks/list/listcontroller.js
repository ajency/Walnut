var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/textbooks/list/views'], function(App, RegionController) {
  return App.module("TextbooksApp.List", function(List, App) {
    return List.ListController = (function(_super) {
      __extends(ListController, _super);

      function ListController() {
        return ListController.__super__.constructor.apply(this, arguments);
      }

      ListController.prototype.initialize = function() {
        var textbooksCollection, view;
        textbooksCollection = App.request("get:textbooks");
        this.view = view = this._getTextbooksView(textbooksCollection);
        this.listenTo(this.view, "sort:textbooks", (function(_this) {
          return function(sort) {
            return textbooksCollection.fetch({
              reset: true,
              data: {
                order: sort.order,
                orderby: sort.orderby
              }
            });
          };
        })(this));
        this.listenTo(this.view, "filter:textbooks:class", (function(_this) {
          return function(class_id) {
            return textbooksCollection.fetch({
              reset: true,
              data: {
                class_id: class_id
              }
            });
          };
        })(this));
        return this.show(view);
      };

      ListController.prototype._getTextbooksView = function(collection) {
        return new List.Views.ListView({
          collection: collection
        });
      };

      return ListController;

    })(RegionController);
  });
});
