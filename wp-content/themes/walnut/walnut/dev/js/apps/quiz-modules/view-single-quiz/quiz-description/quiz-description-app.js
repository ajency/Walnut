var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/view-single-quiz/quiz-description/templates/quiz-description.html'], function(App, RegionController, quizDetailsTpl) {
  return App.module("QuizModuleApp.Controller", function(Controller, App) {
    var QuizDetailsView;
    Controller.ViewCollecionDetailsController = (function(superClass) {
      extend(ViewCollecionDetailsController, superClass);

      function ViewCollecionDetailsController() {
        return ViewCollecionDetailsController.__super__.constructor.apply(this, arguments);
      }

      ViewCollecionDetailsController.prototype.initialize = function(opts) {
        var view;
        $('.navbar .container-fluid').css("visibility", "visible");
        $("#header-region").hide();
        $("#left-nav-region").hide();
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
    QuizDetailsView = (function(superClass) {
      extend(QuizDetailsView, superClass);

      function QuizDetailsView() {
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
          return this.trigger("goto:previous:route");
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
        if (_.isEmpty(data.content_pieces)) {
          data.takeQuizError = 'Sorry this quiz has no questions in it.';
        } else {
          if (!data.status === 'completed' || App.request("current:user:can", "view_all_quizzes")) {
            if (data.quiz_type === 'class_test' && !IS_STANDALONE_SITE) {
              data.takeQuizError = 'Class tests can be taken from school site only';
            }
          }
        }
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
        var ref, responseSummary;
        responseSummary = Marionette.getOption(this, 'quizResponseSummary');
        if (responseSummary.get('status') === 'started') {
          this.$el.find("#take-quiz").html('Continue');
        }
        if ((ref = Marionette.getOption(this, 'display_mode')) === 'replay' || ref === 'quiz_report') {
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
