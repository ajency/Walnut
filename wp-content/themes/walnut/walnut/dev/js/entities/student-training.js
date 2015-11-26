var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.StudentTraining", function(StudentTraining, App, Backbone, Marionette, $, _) {
    var API, studentTrainingRepository;
    StudentTraining.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'id';

      ItemModel.prototype.defaults = {
        name: '',
        description: [],
        created_on: '',
        created_by: '',
        last_modified_on: '',
        last_modified_by: '',
        published_on: '',
        published_by: '',
        post_status: 'underreview',
        type: 'student-training',
        total_minutes: 0,
        duration: 0,
        minshrs: 'mins',
        term_ids: [],
        content_pieces: [],
        training_date: ''
      };

      ItemModel.prototype.name = 'student-training-module';

      return ItemModel;

    })(Backbone.Model);
    StudentTraining.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = StudentTraining.ItemModel;

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-student-training-modules';
      };

      ItemCollection.prototype.parse = function(resp) {
        return resp.data.reverse();
      };

      return ItemCollection;

    })(Backbone.Collection);
    studentTrainingRepository = new StudentTraining.ItemCollection;
    API = {
      getStudentTrainingModules: function(param) {
        var studentTrainingCollection;
        if (param == null) {
          param = {};
        }
        studentTrainingCollection = new StudentTraining.ItemCollection;
        studentTrainingCollection.fetch({
          add: true,
          remove: false,
          data: param,
          type: 'post',
          success: function(resp) {
            if (!param.search_str) {
              return studentTrainingRepository.reset(resp.models);
            }
          }
        });
        return studentTrainingCollection;
      },
      getStudentTrainingByID: function(id) {
        var studentTraining;
        if (typeof studentTrainingCollection !== "undefined" && studentTrainingCollection !== null) {
          studentTraining = studentTrainingCollection.get(id);
        }
        if (!studentTraining) {
          studentTraining = new StudentTraining.ItemModel({
            'id': id
          });
          studentTraining.fetch();
        }
        return studentTraining;
      },
      saveStudentTrainingDetails: function(data) {
        var studentTrainingItem;
        studentTrainingItem = new StudentTraining.ItemModel(data);
        return studentTrainingItem;
      },
      newStudentTrainingModule: function() {
        var studentTraining;
        return studentTraining = new StudentTraining.ItemModel;
      },
      scheduleStudentTraining: function(data) {
        var questionResponseModel;
        questionResponseModel = App.request("save:question:response");
        questionResponseModel.set(data);
        return questionResponseModel.save();
      }
    };
    App.reqres.setHandler("get:student:training:modules", function(opt) {
      return API.getStudentTrainingModules(opt);
    });
    App.reqres.setHandler("get:student:training:by:id", function(id) {
      return API.getStudentTrainingByID(id);
    });
    App.reqres.setHandler("save:student:training:details", function(data) {
      return API.saveStudentTrainingDetails(data);
    });
    App.reqres.setHandler("new:student:training:module", function() {
      return API.newStudentTrainingModule();
    });
    App.reqres.setHandler("schedule:student:training", function(data) {
      return API.scheduleStudentTraining(data);
    });
    return App.reqres.setHandler("get:student:training:modules:repository", function() {
      return studentTrainingRepository.clone();
    });
  });
});
