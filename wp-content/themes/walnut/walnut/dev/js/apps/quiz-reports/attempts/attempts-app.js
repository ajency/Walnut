var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/attempts/composite-view'], function(App, RegionController) {
  return App.module('AttemptsPopupApp', function(AttemptsPopupApp, App) {
    AttemptsPopupApp.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getAttemptsView = __bind(this._getAttemptsView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var quiz, quiz_id, student, student_id;
        student = options.student, quiz = options.quiz, this.summaries = options.summaries;
        this.studentModel = student instanceof Backbone.Model ? student : App.request("get:user:by:id", student);
        this.quizModel = quiz instanceof Backbone.Model ? quiz : App.request("get:quiz:by:id", quiz);
        if (!this.summaries) {
          quiz_id = _.isNumber(quiz) ? quiz : quiz.id;
          student_id = _.isNumber(student) ? student : student.id;
          this.summariesCollection = App.request("get:quiz:response:summary", {
            'collection_id': quiz_id,
            'student_id': student_id
          });
        } else {
          this.summariesCollection = App.request("create:quiz:response:summary:collection", this.summaries);
        }
        return App.execute("when:fetched", [this.studentModel, this.quizModel, this.summariesCollection], (function(_this) {
          return function() {
            _this.view = _this._getAttemptsView();
            _this.show(_this.view, {
              loading: true,
              entities: [_this.studentModel, _this.quizModel]
            });
            return _this.listenTo(_this.view, 'close:popup:dialog', function() {
              return this.region.closeDialog();
            });
          };
        })(this));
      };

      Controller.prototype._getAttemptsView = function() {
        console.log(this.summariesCollection);
        return new AttemptsPopupApp.Views.AttemptsMainView({
          student: this.studentModel,
          quiz: this.quizModel,
          collection: this.summariesCollection
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:attempts:popup', function(options) {
      return new AttemptsPopupApp.Controller(options);
    });
  });
});
