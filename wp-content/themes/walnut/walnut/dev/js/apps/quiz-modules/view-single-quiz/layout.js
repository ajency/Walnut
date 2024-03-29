var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/view-single-quiz/templates/quiz-layout.html'], function(App, RegionController, quizLayoutTpl) {
  return App.module("QuizModuleApp.ViewQuiz.LayoutView", function(LayoutView, App) {
    return LayoutView.QuizViewLayout = (function(superClass) {
      extend(QuizViewLayout, superClass);

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
        var display_mode, student, studentTrainingModule;
        display_mode = Marionette.getOption(this, 'display_mode');
        studentTrainingModule = Marionette.getOption(this, 'studentTrainingModule');
        if (studentTrainingModule) {
          data.studentTrainingModule = true;
        }
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

      QuizViewLayout.prototype.events = function() {
        return {
          'click .continue-student-training-module': function() {
            return this.trigger("goto:next:item:student:training:module");
          }
        };
      };

      return QuizViewLayout;

    })(Marionette.Layout);
  });
});
