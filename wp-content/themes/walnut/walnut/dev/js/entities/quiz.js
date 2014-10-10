var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Quiz", function(Quiz, App, Backbone, Marionette, $, _) {
    var API, quizRepository;
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
          marks: 0,
          total_minutes: 0,
          duration: 0,
          minshours: 'mins',
          negMarksEnable: 'false',
          negMarks: '',
          term_ids: [],
          content_pieces: [],
          message: {},
          content_layout: []
        };
      };

      ItemModel.prototype.name = 'quiz';

      ItemModel.prototype.hasPermission = function(permsission) {
        var all_permissions;
        all_permissions = this.get('permissions');
        if (_.toBool(all_permissions[permsission])) {
          return true;
        } else {
          return false;
        }
      };

      ItemModel.prototype.getMessageContent = function(message_type) {
        var custom_messages, default_messages, message_content;
        default_messages = {
          end_quiz: 'You really want to end the quiz?',
          submit_without_attempting: 'You havent answered the question. Are you sure you want to continue?',
          incomplete_answer: 'You havent completed the question. Are you sure you want to continue?',
          correct_answer: 'You are correct!',
          incorrect_answer: 'Sorry, you did not answer correctly',
          partial_correct_answers: 'You are almost correct',
          quiz_time_up: 'Sorry, your time is up'
        };
        message_content = default_messages[message_type];
        if (!_.isEmpty(this.get('message'))) {
          custom_messages = this.get('message');
          if (custom_messages[message_type]) {
            message_content = custom_messages[message_type];
          }
        }
        return message_content;
      };

      return ItemModel;

    })(Backbone.Model);
    Quiz.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = Quiz.ItemModel;

      ItemCollection.prototype.name = 'quiz';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-quizes';
      };

      ItemCollection.prototype.parse = function(resp) {
        return resp.data.reverse();
      };

      return ItemCollection;

    })(Backbone.Collection);
    quizRepository = new Quiz.ItemCollection;
    API = {
      getQuizes: function(param) {
        var quizCollection;
        if (param == null) {
          param = {};
        }
        quizCollection = new Quiz.ItemCollection;
        quizCollection.fetch({
          reset: true,
          data: param,
          success: function(resp) {
            if (!param.search_str) {
              return quizRepository.reset(resp.models);
            }
          }
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
      },
      getDummyQuiz: function(content_piece_id) {
        var dummyQuiz;
        dummyQuiz = new Quiz.ItemModel();
        dummyQuiz.set({
          id: 3423432,
          name: 'Dummy Module',
          description: 'Dummy Module Description',
          type: 'quiz',
          quiz_type: 'test',
          duration: 40,
          content_pieces: [content_piece_id],
          permissions: {
            allow_skip: true,
            display_answer: true,
            allow_hint: true
          }
        });
        return dummyQuiz;
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
    App.reqres.setHandler("new:quiz", function() {
      return API.newQuiz();
    });
    App.reqres.setHandler("create:dummy:quiz:module", function(content_piece_id) {
      return API.getDummyQuiz(content_piece_id);
    });
    App.reqres.setHandler("get:quiz:repository", function() {
      return quizRepository.clone();
    });
    return App.reqres.setHandler("app:reset:quiz:repository", function(models) {
      return quizRepository.reset(models);
    });
  });
});
