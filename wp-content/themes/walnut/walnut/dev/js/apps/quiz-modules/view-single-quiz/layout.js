var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("QuizModuleApp.ViewQuiz.LayoutView", function(LayoutView, App) {
    return LayoutView.QuizViewLayout = (function(_super) {
      __extends(QuizViewLayout, _super);

      function QuizViewLayout() {
        return QuizViewLayout.__super__.constructor.apply(this, arguments);
      }

      QuizViewLayout.prototype.template = '<div class="teacher-app"> {{#practice_mode}} <div class="well text-center"> <h4><span class="bold">This is a practice quiz. It is designed to help you train for the class tests.</span></h4> </div> {{/practice_mode}} {{^practice_mode}} <div class="well text-center"> <h4><span class="bold">This is a class test and can be attempted just once, therefore ensure you have answered all questions before ending the quiz.</span></h4> </div> {{/practice_mode}} <div id="attempts-region"></div> <div id="quiz-details-region"></div> </div> <div id="content-display-region"></div>';

      QuizViewLayout.prototype.regions = {
        attemptsRegion: '#attempts-region',
        quizDetailsRegion: '#quiz-details-region',
        contentDisplayRegion: '#content-display-region'
      };

      QuizViewLayout.prototype.mixinTemplateHelpers = function(data) {
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
