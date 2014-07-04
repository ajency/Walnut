var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/take-module-item/multiple-evaluation/student-list/student-list-controller', 'apps/take-module-item/multiple-evaluation/evaluation/evaluation-controller'], function(App, RegionController) {
  return App.module("SingleQuestionMultipleEvaluationApp", function(MultipleEval, App) {
    var MultipleEvalLayout, SingleQuestionMultipleEvalController;
    SingleQuestionMultipleEvalController = (function(_super) {
      __extends(SingleQuestionMultipleEvalController, _super);

      function SingleQuestionMultipleEvalController() {
        return SingleQuestionMultipleEvalController.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionMultipleEvalController.prototype.initialize = function(opts) {
        this.questionResponseModel = opts.questionResponseModel, this.studentCollection = opts.studentCollection, this.display_mode = opts.display_mode, this.timerObject = opts.timerObject, this.evaluationParams = opts.evaluationParams;
        this.questionResponseArray = this.questionResponseModel.get('question_response');
        this.layout = this._getMultipleEvaluationLayout();
        this.listenTo(this.layout, 'show', this._onShowOfLayout);
        this.listenTo(this.layout.studentListRegion, 'student:selected', this.studentSelected);
        this.listenTo(this.layout.evalParametersRegion, 'save:eval:parameters', this._saveEvalParameters);
        return this.show(this.layout, {
          loading: true
        });
      };

      SingleQuestionMultipleEvalController.prototype.studentSelected = function(id) {
        var evaluationCollection, responseObj;
        id = parseInt(id);
        evaluationCollection = App.request("get:grading:parameter:collection", this.evaluationParams);
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
          responseObj: responseObj,
          display_mode: this.display_mode
        });
      };

      SingleQuestionMultipleEvalController.prototype._saveEvalParameters = function(responseObj) {
        var index, responseObjOld;
        responseObjOld = _.findWhere(this.questionResponseArray, {
          id: responseObj.id
        });
        if (responseObjOld != null) {
          index = _.indexOf(this.questionResponseArray, responseObjOld);
          this.questionResponseArray[index] = responseObj;
        } else {
          if (this.questionResponseArray === '') {
            this.questionResponseArray = new Array();
          }
          this.questionResponseArray.push(responseObj);
        }
        this.questionResponseModel.set('question_response', this.questionResponseArray);
        return this.layout.studentListRegion.trigger('student:answer:saved', responseObj.id);
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
          questionResponseArray: this.questionResponseArray
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

      MultipleEvalLayout.prototype.template = '<div class="clearfix"></div> <div id="eval-parameters"></div> <div id="students-list"></div>';

      MultipleEvalLayout.prototype.regions = {
        studentListRegion: '#students-list',
        evalParametersRegion: '#eval-parameters'
      };

      MultipleEvalLayout.prototype.initialize = function(options) {
        return this.questionResponseArray = Marionette.getOption(this, 'questionResponseArray');
      };

      MultipleEvalLayout.prototype.onClose = function() {
        return delete this.questionResponseArray;
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
