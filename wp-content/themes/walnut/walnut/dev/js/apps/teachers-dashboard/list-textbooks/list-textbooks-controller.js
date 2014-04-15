var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/teachers-dashboard/list-textbooks/views'], function(App, RegionController) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    return View.TextbooksListController = (function(_super) {
      __extends(TextbooksListController, _super);

      function TextbooksListController() {
        return TextbooksListController.__super__.constructor.apply(this, arguments);
      }

      TextbooksListController.prototype.initialize = function(opts) {
        var breadcrumb_items, classID, textbooks, view;
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': '#teachers/dashboard'
            }, {
              'label': 'Start Training',
              'link': 'javascript://'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        classID = opts.classID;
        textbooks = App.request("get:textbooks", {
          class_id: classID
        });
        this.view = view = this._getTextbooksListView(textbooks);
        return this.show(view, {
          loading: true
        });
      };

      TextbooksListController.prototype._getTextbooksListView = function(collection) {
        return new View.List.TextbooksListView({
          collection: collection
        });
      };

      return TextbooksListController;

    })(RegionController);
  });
});
