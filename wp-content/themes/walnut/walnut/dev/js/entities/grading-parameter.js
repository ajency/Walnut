var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.GradingParameter", function(GradingParameter, App, Backbone, Marionette, $, _) {
    var API;
    GradingParameter.ItemModel = (function(superClass) {
      extend(ItemModel, superClass);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.defaults = {
        parameter: '',
        attributes: []
      };

      return ItemModel;

    })(Backbone.Model);
    GradingParameter.ItemCollection = (function(superClass) {
      extend(ItemCollection, superClass);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = GradingParameter.ItemModel;

      return ItemCollection;

    })(Backbone.Collection);
    API = {
      getGradingParameterCollections: function(params) {
        var parameterCollection;
        parameterCollection = new GradingParameter.ItemCollection;
        parameterCollection.set(params);
        return parameterCollection;
      },
      getGradingParameter: function(params) {
        var parameterModel;
        parameterModel = new GradingParameter.ItemModel(params);
        return parameterModel;
      }
    };
    App.reqres.setHandler('get:grading:parameter:collection', function(params) {
      return API.getGradingParameterCollections(params);
    });
    return App.reqres.setHandler('get:grading:parameter', function(params) {
      return API.getGradingParameter(params);
    });
  });
});
