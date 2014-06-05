var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/teachers-dashboard/teacher-teaching-module/student-list/student-list-views'], function(App, RegionController) {
  return App.module("SingleQuestionStudentsListApp", function(Students, App) {
    var SingleQuestionStudentsController;
    SingleQuestionStudentsController = (function(_super) {
      __extends(SingleQuestionStudentsController, _super);

      function SingleQuestionStudentsController() {
        this._saveQuestionResponse = __bind(this._saveQuestionResponse, this);
        this._showStudentsListView = __bind(this._showStudentsListView, this);
        this._changeQuestion = __bind(this._changeQuestion, this);
        return SingleQuestionStudentsController.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionStudentsController.prototype.initialize = function(opts) {
        var division, studentCollection, view;
        this.questionResponseModel = opts.questionResponseModel, studentCollection = opts.studentCollection, this.display_mode = opts.display_mode, this.timerObject = opts.timerObject;
        division = this.questionResponseModel.get('division');
        console.log(this.questionResponseModel);
        this.view = view = this._showStudentsListView(studentCollection);
        this.show(view, {
          loading: true,
          entities: [studentCollection]
        });
        this.listenTo(view, "save:question:response", this._saveQuestionResponse);
        return this.listenTo(view, "question:completed", this._changeQuestion);
      };

      SingleQuestionStudentsController.prototype._changeQuestion = function(resp) {
        if (resp === 'no_answer') {
          this._saveQuestionResponse('');
        }
        return this.region.trigger("goto:next:question", this.questionResponseModel.get('content_piece_id'));
      };

      SingleQuestionStudentsController.prototype._showStudentsListView = function(collection) {
        return new Students.Views.StudentsList({
          collection: collection,
          correctAnswers: this.questionResponseModel.get('question_response'),
          display_mode: this.display_mode
        });
      };

      SingleQuestionStudentsController.prototype._saveQuestionResponse = function(studResponse) {
        var elapsedTime;
        elapsedTime = this.timerObject.request("get:elapsed:time");
        this.questionResponseModel.set({
          'question_response': studResponse,
          'status': 'paused',
          'time_taken': elapsedTime
        });
        return this.questionResponseModel.save();
      };

      return SingleQuestionStudentsController;

    })(RegionController);
    return App.commands.setHandler("show:single:question:student:list:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new SingleQuestionStudentsController(opt);
    });
  });
});
