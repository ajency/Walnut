var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('QuizModuleApp.EditQuiz.Views', function(Views, App) {
    return Views.EditQuizLayout = (function(_super) {
      __extends(EditQuizLayout, _super);

      function EditQuizLayout() {
        return EditQuizLayout.__super__.constructor.apply(this, arguments);
      }

      EditQuizLayout.prototype.template = '<div class="quiz-app" id="quiz-app"> <div id="quiz-details-region"></div> <div id="content-selection-region"></div> </div> <div id="content-display-region"></div>';

      EditQuizLayout.prototype.regions = {
        quizDetailsRegion: '#quiz-details-region',
        contentSelectionRegion: '#content-selection-region',
        contentDisplayRegion: '#content-display-region'
      };

      return EditQuizLayout;

    })(Marionette.Layout);
  });
});
