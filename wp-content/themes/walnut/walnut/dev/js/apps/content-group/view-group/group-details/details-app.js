var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/view-group/group-details/templates/group-details.html'], function(App, RegionController, collectionDetailsTpl) {
  return App.module("CollecionDetailsApp.Controller", function(Controller, App) {
    var CollectionDetailsView;
    Controller.ViewCollecionDetailsController = (function(_super) {
      __extends(ViewCollecionDetailsController, _super);

      function ViewCollecionDetailsController() {
        return ViewCollecionDetailsController.__super__.constructor.apply(this, arguments);
      }

      ViewCollecionDetailsController.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model;
        this.view = view = this._getCollectionDetailsView(this.model);
        return this.show(view, {
          loading: true
        });
      };

      ViewCollecionDetailsController.prototype._getCollectionDetailsView = function(model) {
        return new CollectionDetailsView({
          model: model
        });
      };

      return ViewCollecionDetailsController;

    })(RegionController);
    CollectionDetailsView = (function(_super) {
      __extends(CollectionDetailsView, _super);

      function CollectionDetailsView() {
        return CollectionDetailsView.__super__.constructor.apply(this, arguments);
      }

      CollectionDetailsView.prototype.template = collectionDetailsTpl;

      CollectionDetailsView.prototype.className = 'tiles white grid simple vertical green';

      return CollectionDetailsView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:viewgroup:content:group:detailsapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.ViewCollecionDetailsController(opt);
    });
  });
});
