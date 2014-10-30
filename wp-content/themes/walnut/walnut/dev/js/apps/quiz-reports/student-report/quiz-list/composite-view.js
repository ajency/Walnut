var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/student-report/quiz-list/item-views'], function(App, RegionController) {
  return App.module("StudentReportApp.QuizList.Views", function(Views, App) {
    return Views.QuizListView = (function(_super) {
      __extends(QuizListView, _super);

      function QuizListView() {
        return QuizListView.__super__.constructor.apply(this, arguments);
      }

      QuizListView.prototype.template = '<div class="col-lg-12"> <table class="table table-bordered m-t-15" id="quiz-table" > <thead> <tr> {{#allowResetQuiz}} <th style="width:4%"> <div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;"> <input id="check_all" type="checkbox"> <label for="check_all"></label> </div> </th> {{/allowResetQuiz}} <th>Quiz Name</th> <th>Textbook</th> <th>Chapter</th> <th>Time Taken</th> <th>Type</th> <th>Last Marks Obtained</th> <th>Attempt</th> <th></th> </tr> </thead> <tbody id="list-students" class="rowlink"></tbody> </table> <div id="pager" class="pager"> <i class="cursor fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="cursor fa fa-chevron-right next"></i> <select class="pagesize"> <option selected value="25">25</option> <option value="50">50</option> <option value="100">100</option> </select> </div> <button id="reset-quiz" class="none btn btn-success btn-cons2 right pull-left m-t-10 m-r-10" type="submit"> <i class="fa fa-check"></i> Reset Quiz </button> </div>';

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
          textbookNames: textbookNames,
          allowResetQuiz: Marionette.getOption(this, 'allowResetQuiz')
        };
      };

      QuizListView.prototype.mixinTemplateHelpers = function(data) {
        if (Marionette.getOption(this, 'allowResetQuiz')) {
          data.allowResetQuiz = true;
        }
        return data;
      };

      QuizListView.prototype.events = {
        'change #check_all_div': 'checkAll',
        'change .tab_checkbox,#check_all_div ': 'showClearResponseButton',
        'click #reset-quiz': 'clearQuizResponse'
      };

      QuizListView.prototype.onShow = function() {
        var pagerOptions;
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find('#quiz-table').tablesorter().tablesorterPager(pagerOptions);
      };

      QuizListView.prototype.checkAll = function() {
        var all_ids, classTestModules, excludeIDs;
        all_ids = this.collection.pluck('id');
        classTestModules = _.chain(this.collection.where({
          'quiz_type': 'test'
        })).pluck('id').value();
        excludeIDs = _.difference(all_ids, classTestModules);
        return $.toggleCheckAll(this.$el.find('#quiz-table'), excludeIDs);
      };

      QuizListView.prototype.showClearResponseButton = function() {
        if (this.$el.find('.tab_checkbox').is(':checked')) {
          return this.$el.find('#reset-quiz').show();
        } else {
          return this.$el.find('#reset-quiz').hide();
        }
      };

      QuizListView.prototype.clearQuizResponse = function() {
        var quizID, quizIDs, _i, _len;
        quizIDs = $.getCheckedItems(this.$el.find('#quiz-table'));
        if (!_.isEmpty(quizIDs)) {
          for (_i = 0, _len = quizIDs.length; _i < _len; _i++) {
            quizID = quizIDs[_i];
            this.deleteResponse(quizID);
          }
        }
        this.$el.find('#check_all').attr('checked', false);
        return this.$el.find('#reset-quiz').hide();
      };

      QuizListView.prototype.deleteResponse = function(quizID) {
        var quizResponseSummaries, summary;
        quizResponseSummaries = Marionette.getOption(this, 'quizResponseSummaries');
        summary = quizResponseSummaries.findWhere({
          'collection_id': parseInt(quizID)
        });
        summary.destroy();
        this.collection.remove(quizID);
        this.updateTableSorter();
        return this.showResetSuccessMsg();
      };

      QuizListView.prototype.updateTableSorter = function() {
        this.$el.find("#quiz-table").trigger("update");
        return this.$el.find("#quiz-table").trigger("updateCache");
      };

      QuizListView.prototype.showResetSuccessMsg = function() {
        this.$el.find('.reset-success-msg').remove();
        return this.$el.find('#pager').after('<div class="reset-success-msg text-success small">Quiz Reset Successful</div>');
      };

      return QuizListView;

    })(Marionette.CompositeView);
  });
});