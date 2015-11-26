var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/take-module-item/multiple-evaluation/student-list/student-list-views'], function(App, RegionController) {
  return App.module('SingleQuestionMultipleEvaluationApp.StudentList', function(StudentList, App) {
    return StudentList.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.studentCollection = options.studentCollection, this.questionResponseModel = options.questionResponseModel, this.display_mode = options.display_mode;
        this.view = this._getStudentListView();
        this.listenTo(this.view, 'student:selected', this.studentSelected);
        this.listenTo(this.region, 'student:answer:saved', (function(_this) {
          return function(id) {
            return _this.view.triggerMethod('student:answer:saved', id);
          };
        })(this));
        return this.show(this.view, {
          loading: true,
          entities: [this.studentCollection, this.questionResponseModel]
        });
      };

      Controller.prototype.studentSelected = function(id) {
        return this.region.trigger('student:selected', id);
      };

      Controller.prototype._getStudentListView = function() {
        return new StudentList.Views.StudentsListView({
          collection: this.studentCollection,
          correctAnswers: this.questionResponseModel.get('question_response'),
          display_mode: this.display_mode
        });
      };

      return Controller;

    })(RegionController);
  });
});
