var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    return View.textbookModulesController = (function(_super) {
      __extends(textbookModulesController, _super);

      function textbookModulesController() {
        return textbookModulesController.__super__.constructor.apply(this, arguments);
      }

      console.log('TextbookModulesController');

      return textbookModulesController;

    })(RegionController);
  });
});
