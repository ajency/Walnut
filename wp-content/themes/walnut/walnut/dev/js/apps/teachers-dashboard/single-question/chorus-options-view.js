var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/teachers-dashboard/single-question/templates/chorus-options-template.html'], function(App, chorusOptionsTemplate) {
  return App.module("TeachersDashboardApp.View.ChorusOptionsView", function(ChorusOptionsView, App) {
    return ChorusOptionsView.ItemView = (function(_super) {
      __extends(ItemView, _super);

      function ItemView() {
        return ItemView.__super__.constructor.apply(this, arguments);
      }

      ItemView.prototype.className = 'studentList m-t-35';

      ItemView.prototype.template = chorusOptionsTemplate;

      return ItemView;

    })(Marionette.ItemView);
  });
});
