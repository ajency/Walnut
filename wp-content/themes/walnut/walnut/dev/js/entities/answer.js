var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.Answer", function(Answer, App, Backbone, Marionette, $, _) {
    var API;
    Answer.AnswerModel = (function(superClass) {
      extend(AnswerModel, superClass);

      function AnswerModel() {
        return AnswerModel.__super__.constructor.apply(this, arguments);
      }

      AnswerModel.prototype.defaults = function() {
        return {
          answer: [],
          marks: 0,
          status: 'not_attempted'
        };
      };

      AnswerModel.prototype.name = 'answer';

      return AnswerModel;

    })(Backbone.Model);
    API = {
      createAnswer: function(data) {
        var answer;
        if (data == null) {
          data = {};
        }
        answer = new Answer.AnswerModel;
        if (data != null) {
          answer.set(data);
        }
        return answer;
      }
    };
    return App.reqres.setHandler("create:new:answer", function(data) {
      return API.createAnswer(data);
    });
  });
});
