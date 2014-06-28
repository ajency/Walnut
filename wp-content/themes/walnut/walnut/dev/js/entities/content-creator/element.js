var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Elements", function(Elements, App, Backbone, Marionette, $, _) {
    var API, elementsCollection;
    Elements.ElementModel = (function(_super) {
      __extends(ElementModel, _super);

      function ElementModel() {
        return ElementModel.__super__.constructor.apply(this, arguments);
      }

      ElementModel.prototype.idAttribute = 'meta_id';

      ElementModel.prototype.defaults = function() {
        return {
          style: '',
          draggable: true
        };
      };

      ElementModel.prototype.name = 'element';

      return ElementModel;

    })(Backbone.Model);
    Elements.ElementCollection = (function(_super) {
      __extends(ElementCollection, _super);

      function ElementCollection() {
        return ElementCollection.__super__.constructor.apply(this, arguments);
      }

      ElementCollection.prototype.model = Elements.ElementModel;

      return ElementCollection;

    })(Backbone.Collection);
    elementsCollection = new Elements.ElementCollection;
    API = {
      createElement: function(data) {
        var element;
        if (data == null) {
          data = {};
        }
        if ((data.meta_id != null) && data.element !== 'Row' && (elementsCollection.get(data.meta_id) != null)) {
          element = elementsCollection.get(data.meta_id);
        } else {
          element = new Elements.ElementModel;
          element.set(data);
        }
        if (element.get('element') !== 'Row' && element.get('element') !== 'Column') {
          if (element.isNew()) {
            element.save(null, {
              wait: true
            });
          }
        }
        elementsCollection.add(element);
        return element;
      }
    };
    return App.reqres.setHandler("create:new:element", function(data) {
      elementsCollection;
      return API.createElement(data);
    });
  });
});
