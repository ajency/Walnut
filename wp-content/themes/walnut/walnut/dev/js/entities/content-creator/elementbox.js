var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.ElementBox", function(ElementBox, App, Backbone, Marionette, $, _) {
    var API, elementboxCollection;
    ElementBox.ElementModel = (function(superClass) {
      extend(ElementModel, superClass);

      function ElementModel() {
        return ElementModel.__super__.constructor.apply(this, arguments);
      }

      ElementModel.prototype.idAttribute = 'element';

      ElementModel.prototype.name = 'elementbox';

      return ElementModel;

    })(Backbone.Model);
    ElementBox.ElementCollection = (function(superClass) {
      extend(ElementCollection, superClass);

      function ElementCollection() {
        return ElementCollection.__super__.constructor.apply(this, arguments);
      }

      ElementCollection.prototype.model = ElementBox.ElementModel;

      ElementCollection.prototype.url = '';

      return ElementCollection;

    })(Backbone.Collection);
    elementboxCollection = new ElementBox.ElementCollection;
    elementboxCollection.add([
      {
        element: "Hotspot"
      }, {
        element: "Row"
      }
    ]);
    API = {
      getElements: function(param) {
        if (param == null) {
          param = {};
        }
      },
      getElementSettingOptions: function(ele) {
        var element;
        console.log(elementboxCollection.get(ele));
        element = elementboxCollection.get(ele);
        return element;
      }
    };
    App.reqres.setHandler("get:elementbox:elements", function() {
      return API.getElements();
    });
    return App.reqres.setHandler("get:element:settings:options", function(ele) {
      return API.getElementSettingOptions(ele);
    });
  });
});
