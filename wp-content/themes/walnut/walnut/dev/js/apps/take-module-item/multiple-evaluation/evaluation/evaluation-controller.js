var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/take-module-item/multiple-evaluation/evaluation/evaluation-views'], function(App, RegionController) {
  return App.module("SingleQuestionMultipleEvaluationApp.EvaluationApp", function(EvaluationApp, App) {
    return EvaluationApp.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.evaluationCollection = Marionette.getOption(this, 'evaluationCollection');
        this.studentModel = Marionette.getOption(this, 'studentModel');
        this.responseObj = Marionette.getOption(this, 'responseObj');
        this.display_mode = Marionette.getOption(this, 'display_mode');
        this.view = this._showEvaluationView();
        this.listenTo(this.view, 'save:eval:parameters', this._saveEvalParameters);
        return this.show(this.view);
      };

      Controller.prototype._showEvaluationView = function() {
        return new EvaluationApp.Views.EvaluationView({
          collection: this.evaluationCollection,
          studentModel: this.studentModel,
          responseObj: this.responseObj,
          display_mode: this.display_mode
        });
      };

      Controller.prototype._saveEvalParameters = function() {
        return this.region.trigger('save:eval:parameters', this.responseObj);
      };

      return Controller;

    })(RegionController);
  });
});
