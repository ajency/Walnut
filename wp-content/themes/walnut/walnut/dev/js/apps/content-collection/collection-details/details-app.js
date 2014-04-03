var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-collection/collection-details/templates/collection-details.html'], function(App, RegionController, collectionDetailsTpl) {
  return App.module("CollecionDetailsApp.Controller", function(Controller, App) {
    var collectionDetailsView;
    Controller.CollecionDetailsController = (function(_super) {
      __extends(CollecionDetailsController, _super);

      function CollecionDetailsController() {
        return CollecionDetailsController.__super__.constructor.apply(this, arguments);
      }

      CollecionDetailsController.prototype.initialize = function() {
        var view;
        this.view = view = this._getCollectionDetailsView();
        return this.show(view);
      };

      CollecionDetailsController.prototype._getCollectionDetailsView = function() {
        return new collectionDetailsView;
      };

      return CollecionDetailsController;

    })(RegionController);
    collectionDetailsView = (function(_super) {
      __extends(collectionDetailsView, _super);

      function collectionDetailsView() {
        return collectionDetailsView.__super__.constructor.apply(this, arguments);
      }

      collectionDetailsView.prototype.template = collectionDetailsTpl;

      collectionDetailsView.prototype.className = 'tiles white grid simple vertical green';

      return collectionDetailsView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:collections:detailsapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.CollecionDetailsController(opt);
    });
  });
});
