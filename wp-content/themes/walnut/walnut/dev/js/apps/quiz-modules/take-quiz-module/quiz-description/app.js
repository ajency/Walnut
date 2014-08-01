var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/take-quiz-module/quiz-description/templates/quiz-description-tpl.html'], function(App, RegionController, quizDescriptionTemplate) {
  return App.module("TakeQuizApp.QuizDescription", function(QuizDescription, App) {
    var ModuleDescriptionView;
    QuizDescription.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showQuizDescriptionView = __bind(this._showQuizDescriptionView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var currentQuestion, model, textbookID, view;
        model = opts.model, currentQuestion = opts.currentQuestion, this.textbookNames = opts.textbookNames;
        this.view = view = this._showQuizDescriptionView(model, currentQuestion);
        textbookID = model.get('term_ids').textbook;
        this.textbookModel = App.request("get:textbook:by:id", textbookID);
        App.execute("when:fetched", [this.textbookNames, this.textbookModel], (function(_this) {
          return function() {
            return _this.show(_this.view, {
              loading: true
            });
          };
        })(this));
        return this.listenTo(this.region, "question:changed", function(model) {
          return this.view.triggerMethod("question:change", model);
        });
      };

      Controller.prototype._showQuizDescriptionView = function(model, currentQuestion) {
        var terms;
        terms = model.get('term_ids');
        return new ModuleDescriptionView({
          model: model,
          templateHelpers: {
            getQuestionDuration: currentQuestion.get('duration'),
            getClass: (function(_this) {
              return function() {
                return _this.textbookModel.getClasses();
              };
            })(this),
            getTextbookName: (function(_this) {
              return function() {
                return _this.textbookNames.getTextbookName(terms);
              };
            })(this),
            getChapterName: (function(_this) {
              return function() {
                return _this.textbookNames.getChapterName(terms);
              };
            })(this),
            getSectionsNames: (function(_this) {
              return function() {
                return _this.textbookNames.getSectionsNames(terms);
              };
            })(this),
            getSubSectionsNames: (function(_this) {
              return function() {
                return _this.textbookNames.getSubSectionsNames(terms);
              };
            })(this)
          }
        });
      };

      return Controller;

    })(RegionController);
    return ModuleDescriptionView = (function(_super) {
      __extends(ModuleDescriptionView, _super);

      function ModuleDescriptionView() {
        return ModuleDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionView.prototype.className = 'pieceWrapper';

      ModuleDescriptionView.prototype.template = quizDescriptionTemplate;

      ModuleDescriptionView.prototype.onQuestionChange = function(model) {
        return this.$el.find("#time-on-question").html(model.get('duration'));
      };

      return ModuleDescriptionView;

    })(Marionette.ItemView);
  });
});
