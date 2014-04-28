var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.QuestionResponse", function(QuestionResponse, App, Backbone, Marionette, $, _) {
    var API, QuestionResponseCollection, QuestionResponseModel, responseCollection;
    QuestionResponseModel = (function(_super) {
      __extends(QuestionResponseModel, _super);

      function QuestionResponseModel() {
        return QuestionResponseModel.__super__.constructor.apply(this, arguments);
      }

      QuestionResponseModel.prototype.defaults = {
        content_piece_id: 0,
        collection_id: 0,
        date_created: '',
        date_modified: '',
        total_time: 0,
        question_response: [],
        time_started: 0,
        time_completed: 0
      };

      QuestionResponseModel.prototype.name = 'question-response';

      return QuestionResponseModel;

    })(Backbone.Model);
    QuestionResponseCollection = (function(_super) {
      __extends(QuestionResponseCollection, _super);

      function QuestionResponseCollection() {
        return QuestionResponseCollection.__super__.constructor.apply(this, arguments);
      }

      QuestionResponseCollection.prototype.model = QuestionResponseModel;

      QuestionResponseCollection.prototype.comparator = 'term_order';

      QuestionResponseCollection.prototype.url = function() {
        return AJAXURL + '?action=get-question-response';
      };

      QuestionResponseCollection.prototype.parse = function(resp) {
        this.total = resp.count;
        return resp.data;
      };

      return QuestionResponseCollection;

    })(Backbone.Collection);
    responseCollection = new QuestionResponseCollection;
    API = {
      getQuestionResponse: function(param) {
        if (param == null) {
          param = {};
        }
        responseCollection.fetch({
          reset: true,
          data: param
        });
        return responseCollection;
      },
      saveQuestionResponse: function(param) {
        if (param == null) {
          param = {};
        }
      }
    };
    App.reqres.setHandler("get:question:response", function(opt) {
      return API.getQuestionResponse(opt);
    });
    return App.reqres.setHandler("save:question:response", function(id) {
      return API.saveQuestionResponse(id);
    });
  });
});
