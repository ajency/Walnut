var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Elements", function(Elements, App, Backbone, Marionette, $, _) {
    var API, elementsCollection;
    Elements.ElementModel = (function(superClass) {
      extend(ElementModel, superClass);

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

      ElementModel.prototype.setMultiplicationFactor = function(multiplicationFactor) {
        if (multiplicationFactor) {
          if (!this.get('marks_set')) {
            return this.set({
              'multiplicationFactor': multiplicationFactor,
              'marks': parseFloat((parseFloat(this.get('marks')) * multiplicationFactor).toFixed(1)),
              'marks_set': true
            });
          }
        } else {
          return this.set({
            'multiplicationFactor': 1
          });
        }
      };

      return ElementModel;

    })(Backbone.Model);
    Elements.ElementCollection = (function(superClass) {
      extend(ElementCollection, superClass);

      function ElementCollection() {
        return ElementCollection.__super__.constructor.apply(this, arguments);
      }

      ElementCollection.prototype.model = Elements.ElementModel;

      return ElementCollection;

    })(Backbone.Collection);
    elementsCollection = new Elements.ElementCollection;
    API = {
      createElement: function(data) {
        var element, ref, ref1;
        if (data == null) {
          data = {};
        }
        if ((data.meta_id != null) && ((ref = data.element) !== 'Row' && ref !== 'TeacherQuestion') && (elementsCollection.get(data.meta_id) != null)) {
          element = elementsCollection.get(data.meta_id);
        } else {
          element = new Elements.ElementModel;
          element.set(data);
        }
        if (((ref1 = element.get('element')) !== 'Row' && ref1 !== 'TeacherQuestion') && element.get('element') !== 'Column') {
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
