var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("QuizReportApp.Layout", function(Layout, App) {
    return Layout.QuizReportLayout = (function(superClass) {
      extend(QuizReportLayout, superClass);

      function QuizReportLayout() {
        return QuizReportLayout.__super__.constructor.apply(this, arguments);
      }

      QuizReportLayout.prototype.template = '<button type="button" id="go-back-button" class="btn btn-white btn-cons m-t-10"> <h4 class="bold  text-info no-margin"> <span class="fa fa-arrow-circle-left"></span> Back to List of Quizzesa </h4> </button> <div class="tiles white grid simple vertical green"> <div class="grid-title no-border"> <h4 class="">Quiz<span class="semi-bold"> Report</span></h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;"> <div id="quiz-details-region"></div> <div class="row m-t-20 small"> <div class="col-md-4"> <span class="small">Taken By {{takenBy}} out of {{totalStudents}} students</span> </div> <div class="col-md-8" id="students-filter-region"></div> </div> <div id="students-list-region"></div> </div> </div>';

      QuizReportLayout.prototype.regions = {
        quizDetailsRegion: '#quiz-details-region',
        studentFilterRegion: '#students-filter-region',
        studentsListRegion: '#students-list-region'
      };

      QuizReportLayout.prototype.events = {
        'click #addContent a': 'changeTab',
        'click #go-back-button': 'navigateToQuizReport'
      };

      QuizReportLayout.prototype.navigateToQuizReport = function() {
        return App.navigate("quiz-report", true);
      };

      QuizReportLayout.prototype.mixinTemplateHelpers = function(data) {
        data.totalStudents = _.size(Marionette.getOption(this, 'students'));
        data.takenBy = Marionette.getOption(this, 'takenBy');
        data.division = Marionette.getOption(this, 'division');
        return data;
      };

      return QuizReportLayout;

    })(Marionette.Layout);
  });
});
