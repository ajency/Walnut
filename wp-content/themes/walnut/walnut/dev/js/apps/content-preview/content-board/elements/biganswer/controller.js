var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/biganswer/views'], function(App, Element) {
  return App.module("ContentPreview.ContentBoard.Element.BigAnswer", function(BigAnswer, App, Backbone, Marionette, $, _) {
    return BigAnswer.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getBigAnswerView = __bind(this._getBigAnswerView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var answerWreqrObject;
        answerWreqrObject = options.answerWreqrObject, this.answerModel = options.answerModel;
        if (!this.answerModel) {
          this.answerModel = App.request("create:new:answer");
        }
        Controller.__super__.initialize.call(this, options);
        if (answerWreqrObject) {
          this.displayAnswer = answerWreqrObject.options.displayAnswer;
          return answerWreqrObject.setHandler("get:question:answer", (function(_this) {
            return function() {
              var answer, data, emptyOrIncomplete;
              answer = _this.view.$el.find('textarea').val();
              _this.answerModel.set({
                'answer': answer
              });
              if (_.isEmpty(answer)) {
                emptyOrIncomplete = 'empty';
              } else {
                emptyOrIncomplete = 'complete';
              }
              return data = {
                'emptyOrIncomplete': emptyOrIncomplete,
                'answerModel': _this.answerModel,
                'totalMarks': _this.layout.model.get('marks')
              };
            };
          })(this));
        }
      };

      Controller.prototype.renderElement = function() {
        var view;
        console.log(this.answerModel);
        view = this.view = this._getBigAnswerView(this.answerModel);
        return this.layout.elementRegion.show(view, {
          loading: true
        });
      };

      Controller.prototype._getBigAnswerView = function(answerModel) {
        console.log(this.answerModel);
        return new BigAnswer.Views.BigAnswerView({
          model: this.layout.model,
          answerModel: answerModel
        });
      };

      return Controller;

    })(Element.Controller);
  });
});
