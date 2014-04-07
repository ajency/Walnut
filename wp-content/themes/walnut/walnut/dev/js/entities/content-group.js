var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.ContentGroup", function(ContentGroup, App, Backbone, Marionette, $, _) {
    var API, contentGroupCollection;
    ContentGroup.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'id';

      ItemModel.prototype.defaults = {
        name: '',
        created_on: '',
        created_by: '',
        last_modified_on: '',
        last_modified_by: '',
        published_on: '',
        published_by: '',
        status: '',
        type: '',
        term_ids: ''
      };

      ItemModel.prototype.name = 'contentGroup';

      return ItemModel;

    })(Backbone.Model);
    ContentGroup.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = ContentGroup.ItemModel;

      ItemCollection.prototype.comparator = 'id';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-content-groups';
      };

      ItemCollection.prototype.parse = function(resp) {
        this.total = resp.count;
        return resp.data;
      };

      return ItemCollection;

    })(Backbone.Collection);
    contentGroupCollection = new ContentGroup.ItemCollection;
    API = {
      getContentGroups: function(param) {
        if (param == null) {
          param = {};
        }
        console.log(param);
        contentGroupCollection.fetch({
          reset: true,
          data: param
        });
        return contentGroupCollection;
      },
      getContentGroupByID: function(id) {
        var contentGroup;
        contentGroup = contentGroupCollection.get(id);
        if (!contentGroup) {
          contentGroup = new ContentGroup.ItemModel({
            term_id: id
          });
          console.log(contentGroup);
          contentGroup.fetch();
        }
        return contentGroup;
      },
      saveContentGroupDetails: function(data) {
        var contentGroupItem;
        contentGroupItem = new ContentGroup.ItemModel(data);
        contentGroupItem.save(null, {
          wait: true
        });
        return contentGroupItem;
      }
    };
    App.reqres.setHandler("get:content:groups", function(opt) {
      return API.getContentGroups(opt);
    });
    App.reqres.setHandler("get:content:group:by:id", function(id) {
      return API.getContentGroupByID(id);
    });
    return App.reqres.setHandler("save:content:group:details", function(data) {
      return API.saveContentGroupDetails(data);
    });
  });
});
