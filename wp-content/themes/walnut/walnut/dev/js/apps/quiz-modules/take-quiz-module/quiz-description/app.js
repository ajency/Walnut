var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/take-quiz-module/quiz-description/templates/quiz-description-tpl.html'], function(App, RegionController, quizDescriptionTemplate) {
  return App.module("TakeQuizApp.QuizDescription", function(QuizDescription, App) {
    var ModuleDescriptionView;
    QuizDescription.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._showQuizDescriptionView = bind(this._showQuizDescriptionView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var currentQuestion, model, textbookID, view;
        model = opts.model, currentQuestion = opts.currentQuestion, this.textbookNames = opts.textbookNames, this.display_mode = opts.display_mode;
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
          display_mode: this.display_mode,
          templateHelpers: {
            getQuestionDuration: currentQuestion.get('duration'),
            getQuestionMarks: parseFloat(currentQuestion.get('marks')).toFixed(1),
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
    return ModuleDescriptionView = (function(superClass) {
      extend(ModuleDescriptionView, superClass);

      function ModuleDescriptionView() {
        return ModuleDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionView.prototype.className = 'pieceWrapper';

      ModuleDescriptionView.prototype.template = quizDescriptionTemplate;

      ModuleDescriptionView.prototype.serializeData = function() {
        var data;
        data = ModuleDescriptionView.__super__.serializeData.call(this);
        if (Marionette.getOption(this, 'display_mode') !== 'quiz_report') {
          if (this.model.get('quiz_type') === 'practice') {
            data.practice_mode = true;
          }
        }
        return data;
      };

      ModuleDescriptionView.prototype.onShow = function() {
        $('#collapseView').on('hidden.bs.collapse', function() {
          $('#accordionToggle').removeClass('updown');
          return $('#accordionToggle').text('Expand');
        });
        return $('#collapseView').on('shown.bs.collapse', function() {
          $('#accordionToggle').addClass('updown');
          return $('#accordionToggle').text('Collapse');
        });
      };

      ModuleDescriptionView.prototype.onQuestionChange = function(model) {
        this.$el.find("#time-on-question").html(model.get('duration'));
        return this.$el.find("#marks-for-question").html(parseFloat(model.get('marks')).toFixed(1));
      };

      return ModuleDescriptionView;

    })(Marionette.ItemView);
  });
});
