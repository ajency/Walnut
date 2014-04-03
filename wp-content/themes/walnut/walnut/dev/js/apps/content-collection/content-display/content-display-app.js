var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-collection/content-display/templates/content-display.html'], function(App, RegionController, contentDisplayTpl) {
  return App.module("CollectionContentDisplayApp.Controller", function(Controller, App) {
    var contentDisplayView;
    Controller.CollectionContentDisplayController = (function(_super) {
      __extends(CollectionContentDisplayController, _super);

      function CollectionContentDisplayController() {
        return CollectionContentDisplayController.__super__.constructor.apply(this, arguments);
      }

      CollectionContentDisplayController.prototype.initialize = function() {
        var view;
        this.view = view = this._getCollectionContentDisplayView();
        return this.show(view);
      };

      CollectionContentDisplayController.prototype._getCollectionContentDisplayView = function() {
        return new contentDisplayView;
      };

      return CollectionContentDisplayController;

    })(RegionController);
    contentDisplayView = (function(_super) {
      __extends(contentDisplayView, _super);

      function contentDisplayView() {
        return contentDisplayView.__super__.constructor.apply(this, arguments);
      }

      contentDisplayView.prototype.template = contentDisplayTpl;

      contentDisplayView.prototype.className = 'col-md-10';

      contentDisplayView.prototype.id = 'myCanvas-miki';

      return contentDisplayView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:content:displayapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.CollectionContentDisplayController(opt);
    });
  });
});
