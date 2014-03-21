var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.QuestionPropertyBox", function(QuestionPropertyBox, App, Backbone, Marionette, $, _) {
    var QuestionPropertyBoxController;
    return QuestionPropertyBoxController = (function(_super) {
      __extends(QuestionPropertyBoxController, _super);

      function QuestionPropertyBoxController() {
        return QuestionPropertyBoxController.__super__.constructor.apply(this, arguments);
      }

      return QuestionPropertyBoxController;

    })(RegionController);
  });
});
