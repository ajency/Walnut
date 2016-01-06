var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/take-module-item/item-description/view'], function(App, RegionController) {
  return App.module("ContentPreview.TopPanel", function(TopPanel, App, Backbone, Marionette, $, _) {
    TopPanel.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._getCompletedSummary = bind(this._getCompletedSummary, this);
        this._timeLeftOrElapsed = bind(this._timeLeftOrElapsed, this);
        this.getResults = bind(this.getResults, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var textbookID, textbook_termIDs;
        this.model = options.model, this.questionResponseModel = options.questionResponseModel, this.timerObject = options.timerObject, this.display_mode = options.display_mode, this.classID = options.classID, this.students = options.students;
        textbook_termIDs = _.flatten(this.model.get('term_ids'));
        this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
        this.durationInSeconds = this.model.get('duration') * 60;
        textbookID = this.model.get('term_ids').textbook;
        this.textbookModel = App.request("get:textbook:by:id", textbookID);
        this.view = this._showView();
        this.listenTo(this.view, 'show', function() {
          return this.view.triggerMethod('show:total:marks', this.marks);
        });
        this.listenTo(this.view, "top:panel:question:done", function() {
          return this.region.trigger("top:panel:question:done");
        });
        this.listenTo(this.view, "top:panel:check:last:question", function() {
          return this.region.trigger("top:panel:check:last:question");
        });
        App.execute("when:fetched", [this.textbookNames, this.textbookModel], (function(_this) {
          return function() {
            return _this.show(_this.view, {
              loading: true
            });
          };
        })(this));
        if (this.display_mode === 'class_mode') {
          return this.timerObject.setHandler("get:elapsed:time", (function(_this) {
            return function() {
              var timeElapsed, timerSign, timerTime, timerTimePeriod;
              timerTimePeriod = $(_this.view.el).find('#downUpTimer').countdown('getTimes');
              timerTime = $.countdown.periodsToSeconds(timerTimePeriod);
              timerSign = $(_this.view.el).find('#downUpTimer').attr('timerdirection');
              if (timerSign === 'countDown') {
                timeElapsed = _this.durationInSeconds - timerTime;
              } else {
                timeElapsed = _this.durationInSeconds + timerTime;
              }
              return timeElapsed;
            };
          })(this));
        }
      };

      Controller.prototype.getResults = function() {
        var ans, answeredCorrectly, correct_answer, i, j, len, len1, name, names, response, studID, student_names;
        correct_answer = 'No One';
        names = [];
        response = this.questionResponseModel.get('question_response');
        if (this.model.get('question_type') === 'chorus') {
          if (response) {
            correct_answer = CHORUS_OPTIONS[response];
          }
        } else if (this.model.get('question_type') === 'individual') {
          for (i = 0, len = response.length; i < len; i++) {
            studID = response[i];
            answeredCorrectly = this.students.where({
              "ID": studID
            });
            for (j = 0, len1 = answeredCorrectly.length; j < len1; j++) {
              ans = answeredCorrectly[j];
              name = ans.get('display_name');
            }
            names.push(name);
          }
          if (_.size(names) > 0) {
            student_names = names.join(', ');
            correct_answer = _.size(names) + ' Students (' + student_names + ')';
          }
        } else {
          correct_answer = false;
        }
        return correct_answer;
      };

      Controller.prototype._showView = function() {
        var terms;
        terms = this.model.get('term_ids');
        return new TopPanel.Views.TopPanelView({
          model: this.model,
          display_mode: this.display_mode,
          timeLeftOrElapsed: this._timeLeftOrElapsed(),
          templateHelpers: {
            getClass: (function(_this) {
              return function() {
                return CLASS_LABEL[_this.classID];
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
            })(this),
            getCompletedSummary: this._getCompletedSummary
          }
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

      Controller.prototype._getCompletedSummary = function() {
        var correct_answer, minutes, seconds, time_taken_string;
        if (this.questionResponseModel && this.questionResponseModel.get("status") === 'completed') {
          minutes = parseInt(this.questionResponseModel.get("time_taken") / 60);
          seconds = parseInt(this.questionResponseModel.get("time_taken") % 60);
          time_taken_string = minutes + 'm ' + seconds + 's';
          correct_answer = this.getResults();
          return '<div class="p-r-20 p-b-10 p-l-20"> <div class="b-grey b-b m-b-10 p-b-5"> <div class="qstnStatus"><i class="fa fa-check-circle"></i> Completed</div> </div> <div class="b-grey b-b m-b-10 p-b-5"> <label class="form-label bold small-text muted no-margin">Time Alloted:</label>' + this.model.get("duration") + ' mins<br> </div> <div class="b-grey b-b m-b-10 p-b-5"> <label class="form-label bold small-text muted no-margin">Time Taken:</label>' + time_taken_string + '</div> <div id="correct-answer-col"> <div class="b-grey b-b m-b-10 p-b-5"> <label class="form-label bold small-text muted no-margin">Correct Answer:</label>' + correct_answer + '</div> </div> </div>';
        }
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:top:panel', function(options) {
      return new TopPanel.Controller(options);
    });
  });
});
