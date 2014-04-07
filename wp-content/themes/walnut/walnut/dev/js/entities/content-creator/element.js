var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Elements", function(Elements, App, Backbone, Marionette, $, _) {
    var API, i;
    i = 1;
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
    API = {
      createElement: function(data) {
        var ele, element;
        if (data == null) {
          data = {};
        }
        element = new Elements.ElementModel;
        element.set(data);
        if (element.get('element') !== 'Row' && element.get('element') !== 'Column') {
          if (element.isNew()) {
            element.set('meta_id', i);
            localStorage.setItem('ele' + element.get('meta_id'), JSON.stringify(element.toJSON()));
            i++;
          } else {
            ele = localStorage.getItem('ele' + element.get('meta_id'));
            element.set(JSON.parse(ele));
          }
        }
        return element;
      }
    };
    return App.reqres.setHandler("create:new:element", function(data) {
      return API.createElement(data);
    });
  });
});
