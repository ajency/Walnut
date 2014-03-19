var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ContentCreator.HotspotProperties", function(HotspotProperties, App, Backbone, Marionette, $, _) {
    var HotspotElementBoxView, HotspotPropertiesController;
    HotspotPropertiesController = (function(_super) {
      __extends(HotspotPropertiesController, _super);

      function HotspotPropertiesController() {
        return HotspotPropertiesController.__super__.constructor.apply(this, arguments);
      }

      HotspotPropertiesController.prototype.initialize = function(options) {
        console.log("in hotspot properties");
        this.view = this._getHotspotPropertiesView();
        return this.show(this.view);
      };

      HotspotPropertiesController.prototype._getHotspotPropertiesView = function() {
        return new HotspotElementBoxView;
      };

      return HotspotPropertiesController;

    })(RegionController);
    HotspotElementBoxView = (function(_super) {
      __extends(HotspotElementBoxView, _super);

      function HotspotElementBoxView() {
        return HotspotElementBoxView.__super__.constructor.apply(this, arguments);
      }

      HotspotElementBoxView.prototype.className = 'tile-more-content no-padding';

      HotspotElementBoxView.prototype.template = '<div class="tiles green"> <div class="tile-footer drag"> Hotspot Properties </div> <div class="docket-body"> <ul> <li data-element="circle"> <a href="#" class="drag builder-element"> <i class="fa fa-circle-o"></i> </a> </li> <li data-element="square"> <a href="#" class="drag builder-element"> <i class="fa fa-square-o"></i> </a> </li> <div class="clearfix"></div> </ul> </div> </div>';

      HotspotElementBoxView.prototype.onShow = function() {
        return this.$el.find('*[data-element]').draggable({
          connectToSortable: '.droppable-column',
          helper: 'clone',
          delay: 5,
          addClasses: false,
          distance: 5,
          revert: 'invalid'
        });
      };

      return HotspotElementBoxView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:hotspot:properties", function(options) {
      console.log("hi");
      return new HotspotPropertiesController({
        region: options.region
      });
    });
  });
});
