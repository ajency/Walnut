var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Quiz", function(Quiz, App, Backbone, Marionette, $, _) {
    var API;
    Quiz.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'id';

      ItemModel.prototype.defaults = function() {
        return {
          name: '',
          description: [],
          created_on: '',
          created_by: '',
          last_modified_on: '',
          last_modified_by: '',
          published_on: '',
          published_by: '',
          post_status: 'underreview',
          type: 'quiz',
          quiz_type: 'practice',
          marks: '',
          total_minutes: 0,
          duration: '',
          minshours: 'mins',
          negMarksEnable: 'false',
          negMarks: '',
          content_pieces: [],
          message: {},
          content_layout: []
        };
      };

      ItemModel.prototype.name = 'quiz';

      return ItemModel;

    })(Backbone.Model);
    Quiz.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = Quiz.ItemModel;

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-quizes';
      };

      ItemCollection.prototype.parse = function(resp) {
        return resp.data;
      };

      return ItemCollection;

    })(Backbone.Collection);
    API = {
      getQuizes: function(param) {
        var quizCollection;
        if (param == null) {
          param = {};
        }
        quizCollection = new Quiz.ItemCollection;
        quizCollection.fetch({
          reset: true,
          data: param
        });
        return quizCollection;
      },
      getQuizByID: function(id) {
        var quiz;
        if (typeof quizCollection !== "undefined" && quizCollection !== null) {
          quiz = quizCollection.get(id);
        }
        if (!quiz) {
          quiz = new Quiz.ItemModel({
            'id': id
          });
          quiz.fetch();
        }
        return quiz;
      },
      saveQuizDetails: function(data) {
        var quizItem;
        quizItem = new Quiz.ItemModel(data);
        return quizItem;
      },
      newQuiz: function() {
        return new Quiz.ItemModel;
      }
    };
    App.reqres.setHandler("get:quizes", function(opt) {
      return API.getQuizes(opt);
    });
    App.reqres.setHandler("get:quiz:by:id", function(id) {
      return API.getQuizByID(id);
    });
    App.reqres.setHandler("save:quiz:details", function(data) {
      return API.saveQuizDetails(data);
    });
    return App.reqres.setHandler("new:quiz", function() {
      return API.newQuiz();
    });
  });
});
