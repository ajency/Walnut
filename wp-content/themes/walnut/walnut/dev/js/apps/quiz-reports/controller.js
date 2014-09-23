var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("QuizReportsApp.Controller", function(Controller, App) {
    var QuizReportsView;
    Controller.QuizReportsController = (function(_super) {
      __extends(QuizReportsController, _super);

      function QuizReportsController() {
        return QuizReportsController.__super__.constructor.apply(this, arguments);
      }

      QuizReportsController.prototype.initialize = function() {
        var view;
        this.view = view = this._getQuizReportsView();
        return this.show(view, {
          loading: true
        });
      };

      QuizReportsController.prototype._getQuizReportsView = function() {
        return new QuizReportsView;
      };

      return QuizReportsController;

    })(RegionController);
    return QuizReportsView = (function(_super) {
      __extends(QuizReportsView, _super);

      function QuizReportsView() {
        return QuizReportsView.__super__.constructor.apply(this, arguments);
      }

      QuizReportsView.prototype.template = 'test';

      QuizReportsView.prototype.className = '';

      return QuizReportsView;

    })(Marionette.ItemView);
  });
});
