var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/dialogs/hint-dialog/hint-dialog-views'], function(App, RegionController) {
  return App.module('ContentPreview.Dialogs.HintDialog', function(HintDialog, App) {
    HintDialog.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var hint;
        hint = options.hint;
        this.view = this._getHintView(hint);
        this.listenTo(this.view, 'close:hint:dialog', function() {
          return this.region.closeDialog();
        });
        return this.show(this.view);
      };

      Controller.prototype._getHintView = function(hint) {
        return new HintDialog.Views.HintView({
          hint: hint
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:hint:dialog', function(options) {
      return new HintDialog.Controller({
        region: App.dialogRegion,
        hint: options.hint
      });
    });
  });
});
