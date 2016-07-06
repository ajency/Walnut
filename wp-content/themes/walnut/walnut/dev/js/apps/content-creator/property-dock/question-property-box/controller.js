var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.QuestionPropertyBox", function(QuestionPropertyBox, App, Backbone, Marionette, $, _) {
    var QuestionPropertyBoxController;
    QuestionPropertyBoxController = (function(superClass) {
      extend(QuestionPropertyBoxController, superClass);

      function QuestionPropertyBoxController() {
        return QuestionPropertyBoxController.__super__.constructor.apply(this, arguments);
      }

      return QuestionPropertyBoxController;

    })(RegionController);
    return App.commands.setHandler("");
  });
});
