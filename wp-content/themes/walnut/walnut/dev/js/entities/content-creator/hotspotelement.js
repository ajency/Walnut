var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.HotspotElement", function(HotspotElement, App, Backbone) {
    return HotspotElement.ElementModel = (function(_super) {
      __extends(ElementModel, _super);

      function ElementModel() {
        return ElementModel.__super__.constructor.apply(this, arguments);
      }

      return ElementModel;

    })(Backbone);
  });
});