var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/student-report/quiz-list/item-views'], function(App, RegionController) {
  return App.module("StudentReportApp.QuizList.Views", function(Views, App) {
    return Views.QuizListView = (function(_super) {
      __extends(QuizListView, _super);

      function QuizListView() {
        return QuizListView.__super__.constructor.apply(this, arguments);
      }

      QuizListView.prototype.template = '<div class="col-lg-12"> <table class="table table-bordered m-t-15" id="quiz-table" > <thead> <tr> <th>Quiz Name</th> <th>Textbook</th> <th>Chapter</th> <th>Time Taken</th> <th>Type</th> <th>Last Marks Obtained</th> <th>Attempt</th> <th></th> </tr> </thead> <tbody id="list-students" class="rowlink"></tbody> </table> <div id="pager" class="pager"> <i class="cursor fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="cursor fa fa-chevron-right next"></i> <select class="pagesize"> <option selected value="25">25</option> <option value="50">50</option> <option value="100">100</option> </select> </div> </div>';

      QuizListView.prototype.className = 'row';

      QuizListView.prototype.itemView = Views.ListItemView;

      QuizListView.prototype.emptyView = Views.EmptyView;

      QuizListView.prototype.itemViewContainer = '#list-students';

      QuizListView.prototype.itemViewOptions = function(model, index) {
        var data, quizResponseSummaries, summaries, textbookNames;
        quizResponseSummaries = Marionette.getOption(this, 'quizResponseSummaries');
        summaries = quizResponseSummaries.where({
          'collection_id': model.id
        });
        textbookNames = Marionette.getOption(this, 'textbookNames');
        return data = {
          summaries: summaries,
          textbookNames: textbookNames
        };
      };

      QuizListView.prototype.onShow = function() {
        var pagerOptions;
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find('#quiz-table').tablesorter().tablesorterPager(pagerOptions);
      };

      return QuizListView;

    })(Marionette.CompositeView);
  });
});
