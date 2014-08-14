var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.ContentGroup", function(ContentGroup, App, Backbone, Marionette, $, _) {
    var API;
    ContentGroup.ItemModel = (function(_super) {
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
        post_status: '',
        type: 'teaching-module',
        total_minutes: 0,
        duration: 0,
        minshrs: 'mins',
        term_ids: [],
        content_pieces: [],
        training_date: ''
      };

      ItemModel.prototype.name = 'content-group';

      return ItemModel;

    })(Backbone.Model);
    ContentGroup.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = ContentGroup.ItemModel;

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-content-groups';
      };

      ItemCollection.prototype.parse = function(resp) {
        return resp.data;
      };

      return ItemCollection;

    })(Backbone.Collection);
    API = {
      getContentGroups: function(param) {
        var contentGroupCollection;
        if (param == null) {
          param = {};
        }
        contentGroupCollection = new ContentGroup.ItemCollection;
        contentGroupCollection.fetch({
          reset: true,
          data: param
        });
        return contentGroupCollection;
      },
      getContentGroupByID: function(id) {
        var contentGroup;
        if (typeof contentGroupCollection !== "undefined" && contentGroupCollection !== null) {
          contentGroup = contentGroupCollection.get(id);
        }
        if (!contentGroup) {
          contentGroup = new ContentGroup.ItemModel({
            'id': id
          });
          contentGroup.fetch();
        }
        return contentGroup;
      },
      saveContentGroupDetails: function(data) {
        var contentGroupItem;
        contentGroupItem = new ContentGroup.ItemModel(data);
        return contentGroupItem;
      },
      newContentGroup: function() {
        var contentGroup;
        return contentGroup = new ContentGroup.ItemModel;
      },
      scheduleContentGroup: function(data) {
        var questionResponseModel;
        questionResponseModel = App.request("save:question:response");
        questionResponseModel.set(data);
        return questionResponseModel.save();
      },
      getEmptyModulesCollection: function() {
        var contentGroupCollection;
        return contentGroupCollection = new ContentGroup.ItemCollection;
      }
    };
    App.reqres.setHandler("get:content:groups", function(opt) {
      return API.getContentGroups(opt);
    });
    App.reqres.setHandler("get:content:group:by:id", function(id) {
      return API.getContentGroupByID(id);
    });
    App.reqres.setHandler("save:content:group:details", function(data) {
      return API.saveContentGroupDetails(data);
    });
    App.reqres.setHandler("new:content:group", function() {
      return API.newContentGroup();
    });
    App.reqres.setHandler("schedule:content:group", function(data) {
      return API.scheduleContentGroup(data);
    });
    return App.reqres.setHandler("empty:content:modules:collection", function() {
      return API.getEmptyModulesCollection();
    });
  });
});
