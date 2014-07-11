var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/dashboard/templates/teachers-dashboard.html', 'apps/teachers-dashboard/dashboard/dashboard-take-class-app', 'apps/teachers-dashboard/dashboard/dashboard-start-training-app', 'apps/teachers-dashboard/dashboard/class-progress-app'], function(App, RegionController, teachersDashboardTpl) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var TeachersDashboardLayout;
    View.DashboardController = (function(_super) {
      __extends(DashboardController, _super);

      function DashboardController() {
        return DashboardController.__super__.constructor.apply(this, arguments);
      }

      DashboardController.prototype.initialize = function() {
        var breadcrumb_items;
        this.divisionsCollection = App.request("get:divisions");
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.layout = this._getTeachersDashboardLayout();
        this.show(this.layout, {
          loading: true
        });
        return this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            App.execute("show:dashboard:takeclass:app", {
              region: _this.layout.take_class_region,
              divisionsCollection: _this.divisionsCollection
            });
            App.execute("show:dashboard:start:training:app", {
              region: _this.layout.start_training_region,
              divisionsCollection: _this.divisionsCollection
            });
            return App.execute("show:dashboard:class:progress:app", {
              region: _this.layout.class_progress_region
            });
          };
        })(this));
      };

      DashboardController.prototype._getTeachersDashboardLayout = function() {
        return new TeachersDashboardLayout();
      };

      return DashboardController;

    })(RegionController);
    return TeachersDashboardLayout = (function(_super) {
      __extends(TeachersDashboardLayout, _super);

      function TeachersDashboardLayout() {
        return TeachersDashboardLayout.__super__.constructor.apply(this, arguments);
      }

      TeachersDashboardLayout.prototype.template = teachersDashboardTpl;

      TeachersDashboardLayout.prototype.className = 'teacher-app';

      TeachersDashboardLayout.prototype.regions = {
        take_class_region: '#take-class-region',
        start_training_region: '#start-training-region',
        class_progress_region: '#class-progress-region'
      };

      TeachersDashboardLayout.prototype.events = {
        'click #teacherOptns a': 'changeTab'
      };

      TeachersDashboardLayout.prototype.changeTab = function(e) {
        e.preventDefault();
        this.$el.find('#teacherOptns a').removeClass('active');
        return $(e.target).addClass('active').tab('show');
      };

      return TeachersDashboardLayout;

    })(Marionette.Layout);
  });
});
