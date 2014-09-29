var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/view-single-quiz/templates/quiz-layout.html'], function(App, RegionController, quizLayoutTpl) {
  return App.module("QuizModuleApp.ViewQuiz.LayoutView", function(LayoutView, App) {
    return LayoutView.QuizViewLayout = (function(_super) {
      __extends(QuizViewLayout, _super);

      function QuizViewLayout() {
        return QuizViewLayout.__super__.constructor.apply(this, arguments);
      }

      QuizViewLayout.prototype.template = quizLayoutTpl;

      QuizViewLayout.prototype.regions = {
        attemptsRegion: '#attempts-region',
        quizDetailsRegion: '#quiz-details-region',
        contentDisplayRegion: '#content-display-region'
      };

      QuizViewLayout.prototype.mixinTemplateHelpers = function(data) {
        var display_mode, student;
        display_mode = Marionette.getOption(this, 'display_mode');
        if (display_mode === 'quiz_report') {
          student = Marionette.getOption(this, 'student');
          data.studentName = student.get('display_name');
          data.rollNumber = student.get('roll_no');
          data.quiz_report = true;
        }
        if (this.model.get('quiz_type') === 'practice') {
          data.practice_mode = true;
        }
        return data;
      };

      QuizViewLayout.prototype.onShow = function() {
        return $('.page-content').removeClass('expand-page');
      };

      return QuizViewLayout;

    })(Marionette.Layout);
  });
});
