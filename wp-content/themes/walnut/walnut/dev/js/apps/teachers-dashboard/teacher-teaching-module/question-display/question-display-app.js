var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("SingleQuestionDisplayApp", function(SingleQuestion, App) {
    var QuestionDisplayView;
    SingleQuestion.SingleQuestionController = (function(_super) {
      __extends(SingleQuestionController, _super);

      function SingleQuestionController() {
        this._showQuestionView = __bind(this._showQuestionView, this);
        return SingleQuestionController.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionController.prototype.initialize = function(opts) {
        var model, questionResponseModel, view;
        model = opts.model, questionResponseModel = opts.questionResponseModel, this.timerObject = opts.timerObject, this.display_mode = opts.display_mode;
        this.view = view = this._showQuestionView(model, questionResponseModel);
        this.show(view, {
          loading: true
        });
        return this.timerObject.setHandler("get:elapsed:time", (function(_this) {
          return function() {
            var timeElapsed, timerTime;
            timerTime = $(_this.view.el).find('.cpTimer').TimeCircles().getTime();
            timeElapsed = 15 - timerTime;
            return timeElapsed;
          };
        })(this));
      };

      SingleQuestionController.prototype._showQuestionView = function(model, questionResponseModel) {
        return new QuestionDisplayView({
          model: model,
          display_mode: this.display_mode,
          templateHelpers: {
            timeLeftOrElapsed: (function(_this) {
              return function() {
                var timeTaken, timer;
                timeTaken = parseInt(questionResponseModel.get('time_taken'));
                return timer = 15 - timeTaken;
              };
            })(this)
          }
        });
      };

      return SingleQuestionController;

    })(RegionController);
    QuestionDisplayView = (function(_super) {
      __extends(QuestionDisplayView, _super);

      function QuestionDisplayView() {
        return QuestionDisplayView.__super__.constructor.apply(this, arguments);
      }

      QuestionDisplayView.prototype.template = '<div class="tiles white grid simple vertical blue m-b-0"> <div class="grid-body no-border"> <div class="p-t-10"> <div class="row"> <div class="col-sm-9"> <div class="row m-b-10"> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Class</label> 4 </div> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Subject</label> Science </div> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Chapter</label> Internal Organs of the Body </div> </div> <div class="row"> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Section</label> Internal & External </div> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Sub-Section</label> - </div> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Type</label> Difficult </div> </div> </div> <div class="col-sm-3"> <div class="cpTimer" data-timer="{{timeLeftOrElapsed}}"></div> </div> </div> </div> </div> </div> <div class="tiles blue p-l-15 p-r-15"> <div class="tiles-body no-border"> <div class="row"> <div class="col-md-3 col-sm-3"> <h3 class="text-white m-t-0 m-b-0 semi-bold time timedisplay"> <i class="fa fa-clock-o"></i> </h3> </div> <div class="col-md-3 col-sm-3 text-center"> <a href="#" class="hashtags transparent"> <i class="fa fa-question"></i> View Info </a> </div> <div class="col-md-3 col-sm-3 text-center"> <a href="#" class="hashtags transparent"> <i class="fa fa-eye"></i> View Answer </a> </div> <div class="col-md-3 col-sm-3 text-right"> <a href="#" class="hashtags transparent"> <i class="fa fa-check"></i> Done </a> </div> </div> </div> </div> <div class="teacherCanvas "> <div class="grid-body p-t-20 p-b-15 no-border"></div> </div> <div class="tiles grey text-grey p-t-10 p-l-15 p-r-10 p-b-10 b-grey b-b"> <p class="bold small-text">Question Info: </p> <p class="">{{post_title}}</p> </div>';

      QuestionDisplayView.prototype.onShow = function() {
        var qTime, qTimer, timerColor;
        console.log(Marionette.getOption(this, 'display_mode'));
        if (Marionette.getOption(this, 'display_mode') === 'class_mode') {
          qTimer = this.$el.find('div.cpTimer');
          qTime = qTimer.data('timer');
          timerColor = '#1ec711';
          if (qTime < 10) {
            timerColor = '#f8a616';
          }
          if (qTime < 0) {
            timerColor = '#ea0d0d';
          }
          return qTimer.TimeCircles({
            time: {
              Days: {
                show: false
              },
              Hours: {
                show: false
              },
              Minutes: {
                color: timerColor
              },
              Seconds: {
                color: timerColor
              }
            },
            circle_bg_color: "#EBEEF1",
            bg_width: 0.2
          }).addListener(function(unit, value, total) {
            if (total === 10) {
              qTimer.data('timer', 10);
              return qTimer.TimeCircles({
                time: {
                  Days: {
                    show: false
                  },
                  Hours: {
                    show: false
                  },
                  Minutes: {
                    color: '#f8a616'
                  },
                  Seconds: {
                    color: '#f8a616'
                  }
                }
              });
            } else if (total === 5) {
              return console.log('The expected time for this question is almost over.');
            } else if (total === -1) {
              return qTimer.TimeCircles({
                time: {
                  Days: {
                    show: false
                  },
                  Hours: {
                    show: false
                  },
                  Minutes: {
                    color: '#ea0d0d'
                  },
                  Seconds: {
                    color: '#ea0d0d'
                  }
                }
              });
            }
          });
        }
      };

      return QuestionDisplayView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:single:question:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new SingleQuestion.SingleQuestionController(opt);
    });
  });
});
