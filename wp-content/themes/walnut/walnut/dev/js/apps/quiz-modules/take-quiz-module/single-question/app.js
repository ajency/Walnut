var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'bootbox', 'apps/quiz-modules/take-quiz-module/single-question/views'], function(App, RegionController, bootbox) {
  return App.module("TakeQuizApp.SingleQuestion", function(SingleQuestion, App) {
    var answer, answerData;
    answer = null;
    answerData = null;
    return SingleQuestion.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showSingleQuestionLayout = __bind(this._showSingleQuestionLayout, this);
        this._showContentBoard = __bind(this._showContentBoard, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var displayAnswer, layout;
        this.model = opts.model, this.quizModel = opts.quizModel, this.questionResponseCollection = opts.questionResponseCollection, this.display_mode = opts.display_mode;
        this.questionResponseModel = this.questionResponseCollection.findWhere({
          'content_piece_id': this.model.id
        });
        displayAnswer = this.quizModel.hasPermission('display_answer');
        this.answerWreqrObject = new Backbone.Wreqr.RequestResponse();
        this.answerWreqrObject.displayAnswer = displayAnswer;
        this.answerWreqrObject.multiplicationFactor = this.model.get('multiplicationFactor');
        this.layout = layout = this._showSingleQuestionLayout(this.model);
        this.answerModel = App.request("create:new:answer");
        if (this.questionResponseModel && this.questionResponseModel.get('status') !== 'paused') {
          if (this.display_mode === 'class_mode' && !this.quizModel.hasPermission('single_attempt')) {
            this.answerWreqrObject.displayAnswer = false;
          }
          answerData = this.questionResponseModel.get('question_response');
          if (_.isEmpty(answerData)) {
            answerData = {};
          }
          answerData.status = this.questionResponseModel.get('status');
          answerData.marks = this.questionResponseModel.get('marks_scored');
          this.answerModel = App.request("create:new:answer", answerData);
        }
        this.show(layout, {
          loading: true
        });
        this.listenTo(layout, "show", this._showContentBoard(this.model, this.answerWreqrObject));
        this.listenTo(this.region, "silent:save:question", (function(_this) {
          return function() {
            var answer_status;
            answerData = _this.answerWreqrObject.request("get:question:answer");
            answer = answerData.answerModel;
            _this.answerWreqrObject.request("submit:answer");
            answer_status = _this._getAnswerStatus(answer.get('marks'), answerData.totalMarks);
            answer.set({
              'status': answer_status
            });
            if ((answer.get('status') === 'wrong_answer') && _.toBool(_this.quizModel.get('negMarksEnable'))) {
              answer.set({
                'marks': -answerData.totalMarks * _this.quizModel.get('negMarks') / 100
              });
            }
            return _this.region.trigger("submit:question", answer);
          };
        })(this));
        this.listenTo(layout, "validate:answer", function() {
          answerData = this.answerWreqrObject.request("get:question:answer");
          answer = answerData.answerModel;
          if (answerData.questionType !== 'sort') {
            if (answerData.emptyOrIncomplete === 'empty') {
              return bootbox.confirm(this.quizModel.getMessageContent('submit_without_attempting'), (function(_this) {
                return function(result) {
                  if (result) {
                    return _this._triggerSubmit();
                  }
                };
              })(this));
            } else {
              return this._triggerSubmit();
            }
          } else {
            return this._triggerSubmit();
          }
        });
        this.listenTo(layout, "goto:next:question", function() {
          return this.region.trigger("goto:next:question");
        });
        this.listenTo(layout, "goto:previous:question", function() {
          return this.region.trigger("goto:previous:question");
        });
        this.listenTo(layout, "skip:question", function() {
          this.answerModel.set({
            'status': 'skipped'
          });
          return this.region.trigger("skip:question", this.answerModel);
        });
        this.listenTo(layout, 'show:hint:dialog', (function(_this) {
          return function() {
            return _this.answerModel.set({
              'hint_viewed': true
            });
          };
        })(this));
        return this.listenTo(this.region, 'trigger:submit', (function(_this) {
          return function() {
            return _this._triggerSubmit();
          };
        })(this));
      };

      Controller.prototype._triggerSubmit = function() {
        this.layout.triggerMethod("submit:question");
        if (_.contains(_.pluck(this.model.get('layout'), 'element'), 'BigAnswer')) {
          answer.set({
            'status': 'teacher_check'
          });
        } else {
          this.answerWreqrObject.request("submit:answer");
          answer.set({
            'status': this._getAnswerStatus(answer.get('marks'), answerData.totalMarks)
          });
          if (answer.get('status') === 'wrong_answer' && _.toBool(this.quizModel.get('negMarksEnable'))) {
            answer.set({
              'marks': -answerData.totalMarks * this.quizModel.get('negMarks') / 100
            });
          }
        }
        return this.region.trigger("submit:question", answer);
      };

      Controller.prototype._getAnswerStatus = function(recievedMarks, totalMarks) {
        var status;
        status = 'wrong_answer';
        recievedMarks = parseFloat(recievedMarks);
        totalMarks = parseFloat(totalMarks);
        if (recievedMarks === totalMarks) {
          status = 'correct_answer';
        }
        if (recievedMarks > 0 && recievedMarks < totalMarks) {
          status = 'partially_correct';
        }
        return status;
      };

      Controller.prototype._showContentBoard = function(model, answerWreqrObject) {
        return App.execute("show:content:board", {
          region: this.layout.contentBoardRegion,
          model: model,
          answerWreqrObject: answerWreqrObject,
          answerModel: this.answerModel,
          quizModel: this.quizModel
        });
      };

      Controller.prototype._showSingleQuestionLayout = function(model) {
        return new SingleQuestion.SingleQuestionLayout({
          model: model,
          questionResponseModel: this.questionResponseModel,
          quizModel: this.quizModel,
          display_mode: this.display_mode
        });
      };

      return Controller;

    })(RegionController);
  });
});
