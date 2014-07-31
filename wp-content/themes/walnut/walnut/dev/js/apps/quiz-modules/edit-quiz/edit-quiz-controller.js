var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/edit-quiz/edit-quiz-view', 'apps/quiz-modules/edit-quiz/quiz-description/quiz-description-controller', 'apps/quiz-modules/edit-quiz/content-selection/content-selection-controller', 'apps/quiz-modules/edit-quiz/quiz-content-display/quiz-content-display-controller'], function(App, RegionController) {
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
        this.textbooksCollection = App.request("get:textbooks");
        return App.execute("when:fetched", [this.quizModel, this.textbooksCollection], (function(_this) {
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
        this.listenTo(this.quizModel, 'change:id', this._showContentSelectionApp, this);
        this.listenTo(this.layout.quizDetailsRegion, 'close:content:selection:app', (function(_this) {
          return function() {
            return _this.layout.contentSelectionRegion.close();
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
          model: this.quizModel,
          textbooksCollection: this.textbooksCollection
        });
      };

      Controller.prototype._showContentSelectionApp = function(model) {
        this.quizContentCollection = new Backbone.Collection;
        _.each(model.get('content_layout'), (function(_this) {
          return function(content) {
            var contentModel;
            if (content.type === 'content-piece') {
              contentModel = App.request("get:content:piece:by:id", content.id);
            } else {
              content.data.lvl1 = parseInt(content.data.lvl1);
              content.data.lvl2 = parseInt(content.data.lvl2);
              content.data.lvl3 = parseInt(content.data.lvl3);
              contentModel = new Backbone.Model(content.data);
            }
            return _this.quizContentCollection.add(contentModel);
          };
        })(this));
        return App.execute("when:fetched", this.quizContentCollection, (function(_this) {
          return function() {
            if (model.get('post_status') === 'underreview') {
              App.execute("show:quiz:content:selection:app", {
                region: _this.layout.contentSelectionRegion,
                model: model,
                quizContentCollection: _this.quizContentCollection,
                textbooksCollection: _this.textbooksCollection
              });
            }
            return App.execute("show:quiz:content:display:app", {
              region: _this.layout.contentDisplayRegion,
              model: model,
              quizContentCollection: _this.quizContentCollection
            });
          };
        })(this));
      };

      return Controller;

    })(RegionController);
  });
});
