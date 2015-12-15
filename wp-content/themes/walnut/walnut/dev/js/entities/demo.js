var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Demo", function(Demo, App, Backbone, Marionette, $, _) {
    var API;
    Demo.ItemModel = (function(superClass) {
      extend(ItemModel, superClass);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      return ItemModel;

    })(Backbone.Model);
    Demo.ItemCollection = (function(superClass) {
      extend(ItemCollection, superClass);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = Demo.ItemModel;

      return ItemCollection;

    })(Backbone.Collection);
    API = {
      getDemoCollection: function(data) {
        var demoCollection;
        demoCollection = new Demo.ItemCollection;
        demoCollection.set(data);
        return demoCollection;
      }
    };
    return App.reqres.setHandler("get:demo:collection", function(options) {
      return API.getDemoCollection(options);
    });
  });
});
