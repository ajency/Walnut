var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-collection/content-display/templates/content-display.html'], function(App, RegionController, contentDisplayTpl) {
  return App.module("CollectionContentDisplayApp.Controller", function(Controller, App) {
    var ContentDisplayView;
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
        return new ContentDisplayView;
      };

      return CollectionContentDisplayController;

    })(RegionController);
    ContentDisplayView = (function(_super) {
      __extends(ContentDisplayView, _super);

      function ContentDisplayView() {
        return ContentDisplayView.__super__.constructor.apply(this, arguments);
      }

      ContentDisplayView.prototype.template = contentDisplayTpl;

      ContentDisplayView.prototype.className = 'col-md-10';

      ContentDisplayView.prototype.id = 'myCanvas-miki';

      return ContentDisplayView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:content:displayapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.CollectionContentDisplayController(opt);
    });
  });
});
