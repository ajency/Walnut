var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/edit-quiz/edit-quiz-view', 'apps/quiz-modules/edit-quiz/quiz-description/quiz-description-controller', 'apps/quiz-modules/edit-quiz/content-selection/content-selection-controller'], function(App, RegionController) {
  return App.module('QuizModuleApp.EditQuiz', function(EditQuiz, App) {
    return EditQuiz.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showContentSelectionApp = __bind(this._showContentSelectionApp, this);
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
            _this._showQuizDetailsViews();
            if (_this.quiz_id) {
              return _this._showContentSelectionApp(_this.quizModel);
            }
          };
        })(this));
        return this.show(this.layout, {
          loading: true
        });
      };

      Controller.prototype._getQuizEditLayout = function() {
        return new EditQuiz.Views.EditQuizLayout;
      };

      Controller.prototype._showQuizDetailsViews = function() {
        return App.execute("show:edit:quiz:details", {
          region: this.layout.quizDetailsRegion,
          model: this.quizModel
        });
      };

      Controller.prototype._showContentSelectionApp = function(model) {
        this.quizContentCollection = new Backbone.Collection;
        return App.execute("when:fetched", this.quizContentCollection, (function(_this) {
          return function() {
            if (model.get('post_status') === 'underreview') {
              return App.execute("show:content:selectionapp", {
                region: _this.layout.contentSelectionRegion,
                model: model,
                quizContentCollection: _this.quizContentCollection
              });
            }
          };
        })(this));
      };

      return Controller;

    })(RegionController);
  });
});
