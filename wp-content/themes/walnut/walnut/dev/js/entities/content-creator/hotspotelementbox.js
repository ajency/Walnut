var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.HotspotElementBox", function(HotspotElementBox, App, Backbone, Marionette, $, _) {
    var API, hotspotelementCollection;
    HotspotElementBox.ElementModel = (function(_super) {
      __extends(ElementModel, _super);

      function ElementModel() {
        return ElementModel.__super__.constructor.apply(this, arguments);
      }

      ElementModel.prototype.idAttribute = 'element';

      ElementModel.prototype.name = 'hotspotelementbox';

      return ElementModel;

    })(Backbone.Model);
    HotspotElementBox.ElementCollection = (function(_super) {
      __extends(ElementCollection, _super);

      function ElementCollection() {
        return ElementCollection.__super__.constructor.apply(this, arguments);
      }

      ElementCollection.prototype.model = HotspotElementBox.ElementModel;

      return ElementCollection;

    })(Backbone.Collection);
    hotspotelementCollection = new HotspotElementBox.ElementCollection;
    hotspotelementCollection.add([
      {
        element: 'Hotspot-Circle',
        icon: 'fa-circle-o'
      }, {
        element: 'Hotspot-Rectangle',
        icon: 'fa-square-o'
      }, {
        element: 'Hotspot-Image',
        icon: 'fa-camera'
      }
    ]);
    API = {
      getElements: function() {
        return hotspotelementCollection;
      }
    };
    return App.reqres.setHandler("get:all:hotspot:elements", function() {
      return API.getElements();
    });
  });
});
