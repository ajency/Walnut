var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/media/upload/views'], function(App, AppController) {
  return App.module("Media.Upload", function(Upload, App) {
    Upload.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function() {
        var view;
        view = this._getView();
        return this.show(view);
      };

      Controller.prototype._getView = function(mediaCollection) {
        return new Upload.Views.UploadView;
      };

      return Controller;

    })(AppController);
    return App.commands.setHandler('start:media:upload:app', (function(_this) {
      return function(options) {
        return new Upload.Controller({
          region: options.region
        });
      };
    })(this));
  });
});
