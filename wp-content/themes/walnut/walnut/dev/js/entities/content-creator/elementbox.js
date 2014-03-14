var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.ElementBox", function(ElementBox, App, Backbone, Marionette, $, _) {
    var API;
    ElementBox.ElementModel = (function(_super) {
      __extends(ElementModel, _super);

      function ElementModel() {
        return ElementModel.__super__.constructor.apply(this, arguments);
      }

      ElementModel.prototype.idAttribute = 'element';

      ElementModel.prototype.name = 'elementbox';

      return ElementModel;

    })(Backbone.Model);
    ElementBox.ElementCollection = (function(_super) {
      __extends(ElementCollection, _super);

      function ElementCollection() {
        return ElementCollection.__super__.constructor.apply(this, arguments);
      }

      ElementCollection.prototype.model = ElementBox.ElementModel;

      ElementCollection.prototype.url = '';

      return ElementCollection;

    })(Backbone.Collection);
    API = {
      getElements: function(param) {
        if (param == null) {
          param = {};
        }
        return new ElementBox.ElementCollection([
          {
            element: "hotspot"
          }
        ]);
      }
    };
    return App.reqres.setHandler("get:elementbox:elements", function() {
      return API.getElements();
    });
  });
});
