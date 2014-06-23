var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/teachers-dashboard/teacher-teaching-module/multiple-evaluation/multiple-evaluation-views', 'apps/teachers-dashboard/teacher-teaching-module/multiple-evaluation/student-list/student-list-controller', 'apps/teachers-dashboard/teacher-teaching-module/multiple-evaluation/evaluation/evaluation-controller'], function(App, RegionController) {
  return App.module("SingleQuestionMultipleEvaluationApp", function(MultipleEval, App) {
    var MultipleEvalLayout, SingleQuestionMultipleEvalController;
    SingleQuestionMultipleEvalController = (function(_super) {
      __extends(SingleQuestionMultipleEvalController, _super);

      function SingleQuestionMultipleEvalController() {
        this._changeQuestion = __bind(this._changeQuestion, this);
        return SingleQuestionMultipleEvalController.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionMultipleEvalController.prototype.initialize = function(opts) {
        this.questionResponseModel = opts.questionResponseModel, this.studentCollection = opts.studentCollection, this.display_mode = opts.display_mode, this.timerObject = opts.timerObject, this.evaluationParams = opts.evaluationParams;
        this.questionResponseArray = this.questionResponseModel.get('question_response');
        console.log(this.questionResponseArray);
        this.layout = this._getMultipleEvaluationLayout();
        this.listenTo(this.layout, 'show', this._onShowOfLayout);
        this.listenTo(this.layout, "question:completed", this._changeQuestion);
        this.listenTo(this.layout.studentListRegion, 'student:selected', this.studentSelected);
        this.listenTo(this.layout.evalParametersRegion, 'save:eval:parameters', this._saveEvalParameters);
        return this.show(this.layout, {
          loading: true
        });
      };

      SingleQuestionMultipleEvalController.prototype.studentSelected = function(id) {
        var evaluationCollection, responseObj;
        id = parseInt(id);
        evaluationCollection = App.request("get:demo:collection", this.evaluationParams);
        responseObj = _.findWhere(this.questionResponseArray, {
          id: id
        });
        if (responseObj == null) {
          responseObj = {
            'id': id
          };
        }
        return new MultipleEval.EvaluationApp.Controller({
          region: this.layout.evalParametersRegion,
          evaluationCollection: evaluationCollection,
          studentModel: this.studentCollection.findWhere({
            ID: id
          }),
          responseObj: responseObj
        });
      };

      SingleQuestionMultipleEvalController.prototype._saveEvalParameters = function(responseObj) {
        var index, responseObjOld;
        console.log(responseObj);
        responseObjOld = _.findWhere(this.questionResponseArray, {
          id: responseObj.id
        });
        if (responseObjOld != null) {
          index = _.indexOf(this.questionResponseArray, responseObjOld);
          _.extend(this.questionResponseArray[index], responseObj);
        } else {
          if (this.questionResponseArray === '') {
            this.questionResponseArray = new Array();
          }
          this.questionResponseArray.push(responseObj);
        }
        console.log(this.questionResponseArray);
        this.questionResponseModel.set('question_response', this.questionResponseArray);
        return console.log(this.questionResponseModel);
      };

      SingleQuestionMultipleEvalController.prototype._changeQuestion = function() {
        return this.region.trigger("goto:next:question", this.questionResponseModel.get('content_piece_id'));
      };

      SingleQuestionMultipleEvalController.prototype._onShowOfLayout = function() {
        return new MultipleEval.StudentList.Controller({
          region: this.layout.studentListRegion,
          studentCollection: this.studentCollection,
          questionResponseModel: this.questionResponseModel,
          display_mode: this.display_mode
        });
      };

      SingleQuestionMultipleEvalController.prototype._getMultipleEvaluationLayout = function() {
        return new MultipleEvalLayout({
          questionResponseModel: this.questionResponseModel
        });
      };

      return SingleQuestionMultipleEvalController;

    })(RegionController);
    MultipleEvalLayout = (function(_super) {
      __extends(MultipleEvalLayout, _super);

      function MultipleEvalLayout() {
        return MultipleEvalLayout.__super__.constructor.apply(this, arguments);
      }

      MultipleEvalLayout.prototype.className = 'studentList m-t-35';

      MultipleEvalLayout.prototype.template = '<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10 m-l-20"> <button type="button" id="question-done" class="btn btn-success btn-xs btn-sm"> <i class="fa fa-forward"></i> Next </button> </div> <div class="clearfix"></div> <div id="eval-parameters"></div> <div id="students-list"></div>';

      MultipleEvalLayout.prototype.regions = {
        studentListRegion: '#students-list',
        evalParametersRegion: '#eval-parameters'
      };

      MultipleEvalLayout.prototype.events = {
        'click #question-done': 'questionCompleted'
      };

      MultipleEvalLayout.prototype.initialize = function(options) {
        var questionResponseModel;
        questionResponseModel = Marionette.getOption(this, 'questionResponseModel');
        return this.correctAnswer = questionResponseModel.get('question_response');
      };

      MultipleEvalLayout.prototype.questionCompleted = function() {
        if ((_.size(this.correctAnswers) < 1) && (Marionette.getOption(this, 'display_mode') === 'class_mode')) {
          if (confirm('This item will be marked as complete. None of the options have been selected. Continue?')) {
            return this.trigger("question:completed", "no_answer");
          }
        } else {
          if (confirm('This item will be marked as complete. Continue?')) {
            return this.trigger("question:completed");
          }
        }
      };

      return MultipleEvalLayout;

    })(Marionette.Layout);
    return App.commands.setHandler("show:single:question:multiple:evaluation:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new SingleQuestionMultipleEvalController(opt);
    });
  });
});
