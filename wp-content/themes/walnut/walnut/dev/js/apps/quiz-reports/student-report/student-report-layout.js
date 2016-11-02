var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("StudentReportApp", function(StudentReportApp, App) {
    return StudentReportApp.Layout = (function(superClass) {
      extend(Layout, superClass);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = '{{#ownReport}} <div class="tiles white grid simple vertical green"> <div class="grid-title no-border"> <h4 class="">Quizzes Taken</h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> {{/ownReport}} {{^ownReport}} <button type="button" class="btn btn-white btn-cons m-t-10 "  id="go-back-button"> <h4 class="bold  text-info no-margin"> <span class="fa fa-arrow-circle-left"></span> Back to List of Quizzes </h4> </button> <div class="tiles white grid simple vertical green"> <div class="grid-title no-border"> <h4 class="">Taken By: {{display_name}} <span class="m-l-20">Roll Number: {{roll_no}}</span></h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> {{/ownReport}} <div class="grid-body no-border contentSelect"> {{^ownReport}} <div id="students-filter-region"></div> {{/ownReport}} <div id="quiz-list-region"></div> </div> </div>';

      Layout.prototype.regions = {
        studentFilterRegion: '#students-filter-region',
        quizListRegion: '#quiz-list-region'
      };

      Layout.prototype.events = {
        'click #go-back-button': 'navigateToQuizReport'
      };

      Layout.prototype.navigateToQuizReport = function() {
        return App.navigate("quiz-report", true);
      };

      Layout.prototype.mixinTemplateHelpers = function(data) {
        if (Marionette.getOption(this, 'display_mode') === 'ownReport') {
          data.ownReport = true;
        }
        return data;
      };

      return Layout;

    })(Marionette.Layout);
  });
});
