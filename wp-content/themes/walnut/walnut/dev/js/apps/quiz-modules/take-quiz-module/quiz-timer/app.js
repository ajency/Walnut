var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'bootbox'], function(App, RegionController, bootbox) {
  return App.module("TakeQuizApp.QuizTimer", function(QuizTimer, App) {
    var QuizTimerView;
    QuizTimer.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showQuizTimerView = __bind(this._showQuizTimerView, this);
        this._timeLeftOrElapsed = __bind(this._timeLeftOrElapsed, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var time_taken, total_time, view;
        this.model = opts.model, this.display_mode = opts.display_mode, this.timerObject = opts.timerObject, this.quizResponseSummary = opts.quizResponseSummary;
        if (this.quizResponseSummary) {
          time_taken = parseInt(this.quizResponseSummary.get('total_time_taken'));
        }
        if (!time_taken) {
          time_taken = 0;
        }
        total_time = parseInt(this.model.get('duration')) * 60;
        this.durationInSeconds = total_time - time_taken;
        this.timerObject.setHandler("get:elapsed:time", (function(_this) {
          return function() {
            var timeElapsed, timerSign, timerTime, timerTimePeriod;
            timerTimePeriod = $(_this.view.el).find('#downUpTimer').countdown('getTimes');
            if (timerTimePeriod) {
              timerTime = $.countdown.periodsToSeconds(timerTimePeriod);
              timerSign = $(_this.view.el).find('#downUpTimer').attr('timerdirection');
              if (timerSign === 'countDown') {
                timeElapsed = _this.durationInSeconds - timerTime;
              } else {
                timeElapsed = _this.durationInSeconds + timerTime;
              }
              return timeElapsed;
            }
          };
        })(this));
        this.view = view = this._showQuizTimerView(this.model);
        this.show(view, {
          loading: true
        });
        return this.listenTo(view, 'end:quiz', function() {
          return this.region.trigger('end:quiz');
        });
      };

      Controller.prototype._timeLeftOrElapsed = function() {
        var responseTime, timeTaken, timer;
        timeTaken = 0;
        if (this.questionResponseModel) {
          responseTime = this.questionResponseModel.get('time_taken');
        }
        if (responseTime && responseTime !== 'NaN') {
          timeTaken = responseTime;
        }
        timer = this.durationInSeconds - timeTaken;
        return timer;
      };

      Controller.prototype._showQuizTimerView = function(model) {
        return new QuizTimerView({
          model: model,
          display_mode: this.display_mode,
          timeLeftOrElapsed: this._timeLeftOrElapsed()
        });
      };

      return Controller;

    })(RegionController);
    return QuizTimerView = (function(_super) {
      __extends(QuizTimerView, _super);

      function QuizTimerView() {
        this.quizTimedOut = __bind(this.quizTimedOut, this);
        this.countDown = __bind(this.countDown, this);
        return QuizTimerView.__super__.constructor.apply(this, arguments);
      }

      QuizTimerView.prototype.className = 'timerBox';

      QuizTimerView.prototype.template = ' <div class="container-grey"> <div class="timerStrip"><span class="fa fa-clock-o"></span></div> <div class="bold small-text text-center p-t-10"> Quiz Time</div> <div id="downUpTimer" timerdirection=""></div> <div class="b-grey m-b-10 p-b-5" style="display:none" id="completed-quiz"> <div class="qstnStatus text-center"><i class="fa fa-check-circle"></i> Completed</div> </div> <div class="endQuiz b-grey b-t p-t-10 p-b-10"> <button type="button" id="end-quiz" class="btn btn-white block h-center"> End Quiz </button> </div> </div> <div class="container-grey m-b-5 m-t-5 p-t-10 p-r-10 p-b-10 p-l-20"> <label class="form-label bold small-text muted no-margin inline">Question Info: </label> <p class="inline text-grey small">Testing Question instruction. with hints and comment.</p> </div>';

      QuizTimerView.prototype.events = {
        'click #end-quiz': 'endQuiz'
      };

      QuizTimerView.prototype.onShow = function() {
        var timeLeftOrElapsed, _ref;
        timeLeftOrElapsed = Marionette.getOption(this, 'timeLeftOrElapsed');
        this.display_mode = Marionette.getOption(this, 'display_mode');
        if ((_ref = this.display_mode) === 'replay' || _ref === 'quiz_report') {
          return this.$el.find('#completed-quiz').show();
        } else {
          if (timeLeftOrElapsed >= 0) {
            return this.countDown(timeLeftOrElapsed);
          }
        }
      };

      QuizTimerView.prototype.countDown = function(time) {
        return this.$el.find('#downUpTimer').attr('timerdirection', 'countDown').countdown('destroy').countdown({
          until: time,
          format: 'MS',
          onExpiry: this.quizTimedOut
        });
      };

      QuizTimerView.prototype.quizTimedOut = function() {
        var msgContent;
        msgContent = this.model.getMessageContent('quiz_time_up');
        return bootbox.alert(msgContent, (function(_this) {
          return function() {
            return _this.trigger("end:quiz");
          };
        })(this));
      };

      QuizTimerView.prototype.endQuiz = function() {
        var msgContent;
        msgContent = this.model.getMessageContent('end_quiz');
        return bootbox.confirm(msgContent, (function(_this) {
          return function(result) {
            if (result) {
              return _this.trigger("end:quiz");
            }
          };
        })(this));
      };

      return QuizTimerView;

    })(Marionette.ItemView);
  });
});
