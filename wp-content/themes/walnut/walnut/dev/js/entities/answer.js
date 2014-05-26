var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.Answer", function(Answer, App, Backbone, Marionette, $, _) {
    var API;
    Answer.AnswerModel = (function(_super) {
      __extends(AnswerModel, _super);

      function AnswerModel() {
        return AnswerModel.__super__.constructor.apply(this, arguments);
      }

      return AnswerModel;

    })(Backbone.Model);
    API = {
      createAnswer: function(data) {
        var answer;
        if (data == null) {
          data = {};
        }
        answer = new Answer.AnswerModel;
        answer.set(data);
        return answer;
      }
    };
    return App.reqres.setHandler("create:new:answer", function(data) {
      return API.createAnswer(data);
    });
  });
});