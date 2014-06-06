var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Division", function(Division, App, Backbone, Marionette, $, _) {
    var API, divisionCollection;
    Division.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'id';

      ItemModel.prototype.defaults = {
        division: '',
        class_id: ''
      };

      ItemModel.prototype.name = 'division';

      return ItemModel;

    })(Backbone.Model);
    Division.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = Division.ItemModel;

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-divisions';
      };

      ItemCollection.prototype.parse = function(resp) {
        return resp.data;
      };

      return ItemCollection;

    })(Backbone.Collection);
    divisionCollection = new Division.ItemCollection;
    API = {
      getDivisions: function(param) {
        if (param == null) {
          param = {};
        }
        divisionCollection.fetch({
          reset: true,
          data: param
        });
        return divisionCollection;
      }
    };
    return App.reqres.setHandler("get:divisions", function(opt) {
      return API.getDivisions(opt);
    });
  });
});
