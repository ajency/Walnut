var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/view-single-quiz/quiz-description/templates/quiz-description.html'], function(App, RegionController, quizDetailsTpl) {
  return App.module("QuizModuleApp.Controller", function(Controller, App) {
    var QuizDetailsView;
    Controller.ViewCollecionDetailsController = (function(_super) {
      __extends(ViewCollecionDetailsController, _super);

      function ViewCollecionDetailsController() {
        return ViewCollecionDetailsController.__super__.constructor.apply(this, arguments);
      }

      ViewCollecionDetailsController.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model, this.textbookNames = opts.textbookNames, this.display_mode = opts.display_mode, this.quizResponseSummary = opts.quizResponseSummary;
        this.view = view = this._getQuizDescriptionView();
        this.listenTo(view, 'start:quiz:module', (function(_this) {
          return function() {
            return _this.region.trigger("start:quiz:module");
          };
        })(this));
        this.listenTo(view, 'goto:previous:route', this._gotoPreviousRoute);
        return this.show(view);
      };

      ViewCollecionDetailsController.prototype._getQuizDescriptionView = function() {
        var terms;
        terms = this.model.get('term_ids');
        return new QuizDetailsView({
          model: this.model,
          display_mode: this.display_mode,
          quizResponseSummary: this.quizResponseSummary,
          templateHelpers: {
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
            getQuestionsCount: (function(_this) {
              return function() {
                return _.size(_this.model.get('content_pieces'));
              };
            })(this)
          }
        });
      };

      return ViewCollecionDetailsController;

    })(RegionController);
    QuizDetailsView = (function(_super) {
      __extends(QuizDetailsView, _super);

      function QuizDetailsView() {
        return QuizDetailsView.__super__.constructor.apply(this, arguments);
      }

      QuizDetailsView.prototype.template = quizDetailsTpl;

      QuizDetailsView.prototype.events = {
        'click #take-quiz': function() {
          return this.trigger("start:quiz:module");
        },
        'click #go-back-button': function() {
          return this.trigger("goto:previous:route");
        }
      };

      QuizDetailsView.prototype.serializeData = function() {
        var data, display_mode, responseSummary;
        data = QuizDetailsView.__super__.serializeData.call(this, data);
        display_mode = Marionette.getOption(this, 'display_mode');
        if (this.model.hasPermission('answer_printing') && display_mode === 'replay') {
          data.answer_printing = true;
        }
        if (this.model.get('quiz_type') === 'practice') {
          data.practice_mode = true;
        }
        responseSummary = Marionette.getOption(this, 'quizResponseSummary');
        if (responseSummary.get('status') === 'completed') {
          data.responseSummary = true;
          data.num_questions_answered = _.size(data.content_pieces) - responseSummary.get('num_skipped');
          data.total_time_taken = $.timeMinSecs(responseSummary.get('total_time_taken'));
          if (this.model.hasPermission('display_answer')) {
            data.display_marks = true;
          }
          data.total_marks_scored = responseSummary.get('total_marks_scored');
          if (responseSummary.get('taken_on')) {
            data.taken_on_date = moment(responseSummary.get('taken_on')).format("Do MMM YYYY");
          } else {
            data.taken_on_date = moment().format("Do MMM YYYY");
          }
        }
        data.negMarksEnable = _.toBool(data.negMarksEnable);
        return data;
      };

      QuizDetailsView.prototype.onShow = function() {
        var responseSummary;
        responseSummary = Marionette.getOption(this, 'quizResponseSummary');
        if (responseSummary.get('status') === 'started') {
          this.$el.find("#take-quiz").html('Continue');
        }
        if (Marionette.getOption(this, 'display_mode') === 'replay') {
          if (this.model.hasPermission('disable_quiz_replay')) {
            return this.$el.find("#take-quiz").remove();
          } else {
            return this.$el.find("#take-quiz").html('Replay');
          }
        }
      };

      return QuizDetailsView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:view:quiz:detailsapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.ViewCollecionDetailsController(opt);
    });
  });
});
