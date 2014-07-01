var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/dashboard/templates/teachers-dashboard.html'], function(App, RegionController, teachersDashboardTpl) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var TeachersDashboardView;
    View.DashboardController = (function(_super) {
      __extends(DashboardController, _super);

      function DashboardController() {
        return DashboardController.__super__.constructor.apply(this, arguments);
      }

      DashboardController.prototype.initialize = function() {
        var breadcrumb_items, divisionsCollection, view;
        divisionsCollection = App.request("get:divisions");
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.view = view = this._getTeachersDashboardView(divisionsCollection);
        return this.show(view, {
          loading: true
        });
      };

      DashboardController.prototype._getTeachersDashboardView = function(divisions) {
        return new TeachersDashboardView({
          collection: divisions
        });
      };

      return DashboardController;

    })(RegionController);
    return TeachersDashboardView = (function(_super) {
      __extends(TeachersDashboardView, _super);

      function TeachersDashboardView() {
        return TeachersDashboardView.__super__.constructor.apply(this, arguments);
      }

      TeachersDashboardView.prototype.template = teachersDashboardTpl;

      TeachersDashboardView.prototype.className = 'teacher-app';

      TeachersDashboardView.prototype.events = {
        'click #teacherOptns a': 'changeTab'
      };

      TeachersDashboardView.prototype.mixinTemplateHelpers = function() {
        var c, class_id, class_ids, classes, data, _i, _len;
        data = TeachersDashboardView.__super__.mixinTemplateHelpers.call(this, data);
        data.divisions = _.chain(this.collection.toJSON()).groupBy('class_id').toArray().value();
        classes = [];
        class_ids = _.unique(this.collection.pluck('class_id'));
        for (_i = 0, _len = class_ids.length; _i < _len; _i++) {
          class_id = class_ids[_i];
          c = [];
          c.id = class_id;
          c.label = CLASS_LABEL[class_id];
          classes.push(c);
        }
        data.classes = classes;
        return data;
      };

      TeachersDashboardView.prototype.changeTab = function(e) {
        e.preventDefault();
        this.$el.find('#teacherOptns a').removeClass('active');
        return $(e.target).addClass('active').tab('show');
      };

      return TeachersDashboardView;

    })(Marionette.ItemView);
  });
});
