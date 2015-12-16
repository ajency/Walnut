var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/biganswer-property-box/views'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.BigAnswerPropertyBox", function(BigAnswerPropertyBox, App, Backbone, Marionette, $, _) {
    BigAnswerPropertyBox.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        App.execute("close:question:elements");
        App.execute("close:question:element:properties");
        this.model = options.model;
        this.layout = this._getView(this.model);
        return this.show(this.layout);
      };

      Controller.prototype._getView = function(model) {
        return new BigAnswerPropertyBox.Views.PropertyView({
          model: model
        });
      };

      Controller.prototype.onClose = function() {
        console.log(this.model);
        if (this.model.get('marks') > 0) {
          this.model.set('complete', true);
        } else {
          this.model.set('complete', false);
        }
        return this.model.save();
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:biganswer:properties", function(options) {
      return new BigAnswerPropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
  });
});
