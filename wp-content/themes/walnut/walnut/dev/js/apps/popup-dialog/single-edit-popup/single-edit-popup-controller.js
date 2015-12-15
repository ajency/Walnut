var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/popup-dialog/single-edit-popup/single-edit-popup-view'], function(App, RegionController) {
  return App.module('SingleEditPopup', function(SingleEditPopup, App) {
    SingleEditPopup.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.textArray = options.textArray;
        this.title = options.title;
        this.view = this._getHintView(options);
        this.listenTo(this.view, 'close:popup', function(opt) {
          this.textArray[this.title] = opt.text;
          return this.region.closeDialog();
        });
        return this.show(this.view);
      };

      Controller.prototype._getHintView = function() {
        return new SingleEditPopup.Views.SingleEditView({
          text: this.textArray[this.title],
          title: _.humanize(this.title)
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:single:edit:popup', function(options) {
      return new SingleEditPopup.Controller({
        region: App.dialogRegion,
        textArray: options.textArray,
        title: options.title
      });
    });
  });
});
