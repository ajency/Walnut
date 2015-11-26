var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/quiz-report/students-list/item-views'], function(App, RegionController) {
  return App.module("QuizReportApp.StudentsList.Views", function(Views, App) {
    return Views.StudentsDetailsView = (function(_super) {
      __extends(StudentsDetailsView, _super);

      function StudentsDetailsView() {
        return StudentsDetailsView.__super__.constructor.apply(this, arguments);
      }

      StudentsDetailsView.prototype.template = '<div class="col-lg-12"> <table class="table table-bordered m-t-15" id="students-table" > <thead> <tr> <th>Roll No.</th> <th>Student Name</th> <th>Last Marks Obtained</th> <th>Time Taken</th> <th>Attempts</th> <th></th> </tr> </thead> <tbody id="list-students" class="rowlink"></tbody> </table> <div id="pager" class="pager"> <i class="cursor fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="cursor fa fa-chevron-right next"></i> <select class="pagesize"> <option selected value="25">25</option> <option value="50">50</option> <option value="100">100</option> </select> </div> </div>';

      StudentsDetailsView.prototype.className = 'row';

      StudentsDetailsView.prototype.itemView = Views.ListItemView;

      StudentsDetailsView.prototype.emptyView = Views.EmptyView;

      StudentsDetailsView.prototype.itemViewContainer = '#list-students';

      StudentsDetailsView.prototype.itemViewOptions = function(model, index) {
        var quizResponseSummaries, summaries;
        quizResponseSummaries = Marionette.getOption(this, 'quizResponseSummaries');
        summaries = quizResponseSummaries.where({
          'student_id': model.get('ID')
        });
        return {
          summaries: summaries
        };
      };

      StudentsDetailsView.prototype.onShow = function() {
        var pagerOptions;
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find('#students-table').tablesorter().tablesorterPager(pagerOptions);
      };

      return StudentsDetailsView;

    })(Marionette.CompositeView);
  });
});
