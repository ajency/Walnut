var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.HotspotElement", function(HotspotElement, App, Backbone) {
    var API;
    HotspotElement.ElementModel = (function(superClass) {
      extend(ElementModel, superClass);

      function ElementModel() {
        return ElementModel.__super__.constructor.apply(this, arguments);
      }

      ElementModel.prototype.defaults = function() {
        return {
          family: 'hotspot',
          toDelete: false
        };
      };

      return ElementModel;

    })(Backbone.Model);
    HotspotElement.ElementCollection = (function(superClass) {
      extend(ElementCollection, superClass);

      function ElementCollection() {
        return ElementCollection.__super__.constructor.apply(this, arguments);
      }

      ElementCollection.prototype.model = HotspotElement.ElementModel;

      return ElementCollection;

    })(Backbone.Collection);
    API = {
      createHotspotElement: function(data) {
        var hotspotElement;
        hotspotElement = new HotspotElement.ElementModel;
        hotspotElement.set(data);
        return hotspotElement;
      },
      createHotspotElementCollection: function(data) {
        var hotspotCollection;
        if (data == null) {
          data = {};
        }
        hotspotCollection = new HotspotElement.ElementCollection;
        hotspotCollection.set(data);
        return hotspotCollection;
      }
    };
    App.reqres.setHandler("create:new:hotspot:element", function(data) {
      return API.createHotspotElement(data);
    });
    return App.reqres.setHandler("create:new:hotspot:element:collection", function(data) {
      var jsonData;
      if (data !== void 0) {
        jsonData = data;
      } else {
        jsonData = '';
      }
      return API.createHotspotElementCollection(jsonData);
    });
  });
});
