var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
        this.listenTo(view, 'try:again', (function(_this) {
          return function() {
            return _this.region.trigger("try:again");
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
        this.onPauseSessionClick = __bind(this.onPauseSessionClick, this);
        return QuizDetailsView.__super__.constructor.apply(this, arguments);
      }

      QuizDetailsView.prototype.template = quizDetailsTpl;

      QuizDetailsView.prototype.events = {
        'click #take-quiz': function() {
          return this.trigger("start:quiz:module");
        },
        'click #try-again': function() {
          return this.trigger("try:again");
        },
        'click #go-back-button': function() {
          return this.onPauseSessionClick();
        }
      };

      QuizDetailsView.prototype.serializeData = function() {
        var data, display_mode, elapsed, responseSummary, total;
        data = QuizDetailsView.__super__.serializeData.call(this, data);
        display_mode = Marionette.getOption(this, 'display_mode');
        if (display_mode === 'quiz_report') {
          data.quiz_report = true;
        }
        if (this.model.get('quiz_type') === 'practice') {
          data.practice_mode = true;
        }
        responseSummary = Marionette.getOption(this, 'quizResponseSummary');
        data.total_time_taken = $.timeMinSecs(responseSummary.get('total_time_taken'));
        data.negMarksEnable = _.toBool(data.negMarksEnable);
        if (responseSummary.get('status') === 'completed') {
          data.responseSummary = true;
          data.num_questions_answered = _.size(data.content_pieces) - responseSummary.get('num_skipped');
          if (this.model.hasPermission('display_answer')) {
            data.display_marks = true;
          }
          if (data.negMarksEnable) {
            data.marks_scored = parseFloat(responseSummary.get('marks_scored'));
            data.negative_scored = parseFloat(responseSummary.get('negative_scored'));
          }
          data.total_marks_scored = parseFloat(responseSummary.get('total_marks_scored'));
          if (responseSummary.get('taken_on')) {
            data.taken_on_date = moment(responseSummary.get('taken_on')).format("Do MMM YYYY");
          } else {
            data.taken_on_date = moment().format("Do MMM YYYY");
          }
          if (data.practice_mode && display_mode !== 'quiz_report') {
            data.try_again = true;
          }
        }
        if (responseSummary.get('status') === 'started') {
          data.incompleteQuiz = true;
          total = this.model.get('total_minutes') * 60;
          elapsed = responseSummary.get('total_time_taken');
          data.time_remaining = $.timeMinSecs(total - elapsed);
        }
        return data;
      };

      QuizDetailsView.prototype.onShow = function() {
        var responseSummary, _ref;
        responseSummary = Marionette.getOption(this, 'quizResponseSummary');
        if (responseSummary.get('status') === 'started') {
          this.$el.find("#take-quiz").html('Continue');
        }
        if ((_ref = Marionette.getOption(this, 'display_mode')) === 'replay' || _ref === 'quiz_report') {
          if (this.model.hasPermission('disable_quiz_replay')) {
            this.$el.find("#take-quiz").remove();
          } else {
            this.$el.find("#take-quiz").html('Replay');
          }
        }
        if (_.platform() === 'DEVICE') {
          $('body').css({
            'height': 'auto'
          });
          return this.cordovaEventsForModuleDescriptionView();
        }
      };

      QuizDetailsView.prototype.onPauseSessionClick = function() {
        if (_.platform() === 'BROWSER') {
          return this.trigger("goto:previous:route");
        } else {
          console.log('Invoked onPauseSessionClick');
          _.audioQueuesSelection('Click-Pause');
          this.trigger("goto:previous:route");
          _.clearMediaDirectory('videos-web');
          _.clearMediaDirectory('audio-web');
          return document.removeEventListener("backbutton", this.onPauseSessionClick, false);
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
