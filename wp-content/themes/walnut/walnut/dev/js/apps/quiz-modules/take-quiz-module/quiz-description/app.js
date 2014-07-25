var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/take-quiz-module/quiz-description/templates/quiz-description-tpl.html'], function(App, RegionController, quizDescriptionTemplate) {
  return App.module("TakeQuizApp.QuizDescription", function(QuizDescription, App) {
    var ModuleDescriptionView;
    QuizDescription.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showQuizDescriptionView = __bind(this._showQuizDescriptionView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model;
        this.view = view = this._showQuizDescriptionView(this.model);
        return this.show(view, {
          loading: true
        });
      };

      Controller.prototype._showQuizDescriptionView = function(model) {
        return new ModuleDescriptionView({
          model: model
        });
      };

      return Controller;

    })(RegionController);
    return ModuleDescriptionView = (function(_super) {
      __extends(ModuleDescriptionView, _super);

      function ModuleDescriptionView() {
        return ModuleDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionView.prototype.className = 'pieceWrapper';

      ModuleDescriptionView.prototype.template = quizDescriptionTemplate;

      return ModuleDescriptionView;

    })(Marionette.ItemView);
  });
});
