var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("StudentReportApp", function(StudentReportApp, App) {
    return StudentReportApp.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = '<div class="grid-title no-border"> <h4 class="">Taken By: {{display_name}} <span class="m-l-20">Roll Number: {{roll_no}}</span></h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> <div class="grid-body no-border contentSelect"> <div id="students-filter-region"></div> <div id="quiz-list-region"></div> </div>';

      Layout.prototype.className = 'tiles white grid simple vertical green';

      Layout.prototype.regions = {
        studentFilterRegion: '#students-filter-region',
        quizListRegion: '#quiz-list-region'
      };

      return Layout;

    })(Marionette.Layout);
  });
});
