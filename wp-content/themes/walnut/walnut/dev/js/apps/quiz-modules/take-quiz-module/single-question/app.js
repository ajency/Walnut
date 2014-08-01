var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/take-quiz-module/single-question/views', 'apps/content-preview/dialogs/hint-dialog/hint-dialog-controller', 'apps/content-preview/dialogs/comment-dialog/comment-dialog-controller'], function(App, RegionController) {
  return App.module("TakeQuizApp.SingleQuestion", function(SingleQuestion, App) {
    var answer;
    answer = null;
    return SingleQuestion.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showSingleQuestionLayout = __bind(this._showSingleQuestionLayout, this);
        this._showContentBoard = __bind(this._showContentBoard, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var answerData, layout;
        this.model = opts.model, this.quizModel = opts.quizModel, this.questionResponseCollection = opts.questionResponseCollection, this.display_mode = opts.display_mode;
        this.questionResponseModel = this.questionResponseCollection.findWhere({
          'content_piece_id': this.model.id
        });
        this.answerWreqrObject = new Backbone.Wreqr.RequestResponse();
        this.layout = layout = this._showSingleQuestionLayout(this.model);
        this.answerModel = App.request("create:new:answer");
        if (this.questionResponseModel) {
          answerData = this.questionResponseModel.get('question_response');
          this.answerModel = App.request("create:new:answer", answerData);
        }
        this.show(layout, {
          loading: true
        });
        this.listenTo(layout, "show", this._showContentBoard(this.model, this.answerWreqrObject));
        this.listenTo(layout, "validate:answer", function() {
          var isEmptyAnswer;
          answerData = this.answerWreqrObject.request("get:question:answer");
          answer = answerData.answerModel;
          isEmptyAnswer = _.isEmpty(_.compact(answer.get('answer')));
          if (answerData.questionType === 'sort') {
            isEmptyAnswer = false;
          }
          return this.layout.triggerMethod("answer:validated", isEmptyAnswer);
        });
        this.listenTo(layout, "submit:question", (function(_this) {
          return function() {
            var displayAnswer;
            displayAnswer = _this.quizModel.hasPermission('display_answer');
            _this.answerWreqrObject.request("submit:answer", displayAnswer);
            answer.set({
              'status': _this._getAnswerStatus(answer.get('marks'), answerData.totalMarks)
            });
            console.log(answer);
            return _this.region.trigger("submit:question", answer);
          };
        })(this));
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
            return App.execute('show:hint:dialog', {
              hint: _this.model.get('hint')
            });
          };
        })(this));
        return this.listenTo(layout, 'show:comment:dialog', (function(_this) {
          return function() {
            return App.execute('show:comment:dialog', {
              comment: _this.model.get('comment')
            });
          };
        })(this));
      };

      Controller.prototype._getAnswerStatus = function(recievedMarks, totalMarks) {
        var status;
        status = 'wrong_answer';
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
          answerModel: this.answerModel
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
