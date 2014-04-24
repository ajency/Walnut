var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.QuestionElement", function(QuestionElement, App, Backbone) {
    var API;
    QuestionElement.ElementModel = (function(_super) {
      __extends(ElementModel, _super);

      function ElementModel() {
        return ElementModel.__super__.constructor.apply(this, arguments);
      }

      ElementModel.prototype.idAttribute = "id";

      return ElementModel;

    })(Backbone.Model);
    QuestionElement.ElementCollection = (function(_super) {
      __extends(ElementCollection, _super);

      function ElementCollection() {
        return ElementCollection.__super__.constructor.apply(this, arguments);
      }

      ElementCollection.prototype.model = QuestionElement.ElementModel;

      return ElementCollection;

    })(Backbone.Collection);
    API = {
      createQuestionElement: function(data) {
        var questionElement;
        questionElement = new QuestionElement.ElementModel;
        questionElement.set(data);
        return questionElement;
      },
      createQuestionElementCollection: function(data) {
        var questionCollection;
        if (data == null) {
          data = {};
        }
        questionCollection = new QuestionElement.ElementCollection;
        questionCollection.set(data);
        console.log(questionCollection);
        return questionCollection;
      }
    };
    App.reqres.setHandler("create:new:question:element", function(data) {
      return API.createQuestionElement(data);
    });
    return App.reqres.setHandler("create:new:question:element:collection", function(data) {
      var jsonData;
      if (data == null) {
        data = {};
      }
      jsonData = data;
      return API.createQuestionElementCollection(jsonData);
    });
  });
});
