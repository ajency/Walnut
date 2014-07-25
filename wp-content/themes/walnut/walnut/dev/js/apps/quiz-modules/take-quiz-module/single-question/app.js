var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/take-quiz-module/single-question/views'], function(App, RegionController) {
  return App.module("TakeQuizApp.SingleQuestion", function(SingleQuestion, App) {
    return SingleQuestion.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showSingleQuestionLayout = __bind(this._showSingleQuestionLayout, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var layout;
        this.model = opts.model;
        this.layout = layout = this._showSingleQuestionLayout(this.model);
        this.show(layout, {
          loading: true
        });
        this.listenTo(layout, "show", this._showContentBoard(this.model));
        this.listenTo(layout, "submit:question", function() {
          return this.region.trigger("submit:question");
        });
        this.listenTo(layout, "goto:previous:question", function() {
          return this.region.trigger("goto:previous:question");
        });
        return this.listenTo(this.layout, "skip:question", function() {
          return this.region.trigger("skip:question");
        });
      };

      Controller.prototype._showContentBoard = function(model) {
        return App.execute("show:content:board", {
          region: this.layout.contentBoardRegion,
          model: model
        });
      };

      Controller.prototype._showSingleQuestionLayout = function(model) {
        return new SingleQuestion.SingleQuestionLayout({
          model: model
        });
      };

      return Controller;

    })(RegionController);
  });
});
