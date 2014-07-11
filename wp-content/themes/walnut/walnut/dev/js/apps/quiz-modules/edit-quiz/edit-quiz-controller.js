var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/edit-quiz/edit-quiz-view', 'apps/quiz-modules/edit-quiz/quiz-description/quiz-description-controller'], function(App, RegionController) {
  return App.module('QuizModuleApp.EditQuiz', function(EditQuiz, App) {
    return EditQuiz.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.quiz_id = options.quiz_id;
        if (this.quiz_id) {
          this.quizModel = App.request("get:quiz:by:id", this.quiz_id);
        } else {
          this.quizModel = App.request("new:quiz");
        }
        return App.execute("when:fetched", this.quizModel, (function(_this) {
          return function() {
            return _this.showQuizEditView();
          };
        })(this));
      };

      Controller.prototype.showQuizEditView = function() {
        this.layout = this._getQuizEditLayout();
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            return _this.showQuizDetailsViews();
          };
        })(this));
        return this.show(this.layout, {
          loading: true
        });
      };

      Controller.prototype._getQuizEditLayout = function() {
        return new EditQuiz.Views.EditQuizLayout;
      };

      Controller.prototype.showQuizDetailsViews = function() {
        return App.execute("show:edit:quiz:details", {
          region: this.layout.quizDetailsRegion,
          model: this.quizModel
        });
      };

      return Controller;

    })(RegionController);
  });
});
