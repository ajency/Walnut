var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.HotspotElementBox.Views", function(Views, App) {
    Views.HotspotElementView = (function(_super) {
      __extends(HotspotElementView, _super);

      function HotspotElementView() {
        return HotspotElementView.__super__.constructor.apply(this, arguments);
      }

      HotspotElementView.prototype.tagName = 'li';

      HotspotElementView.prototype.className = 'hotspot-elements hotspotable';

      HotspotElementView.prototype.template = '<a class="drag builder-element"> <i class="fa {{icon}}"></i> </a>';

      HotspotElementView.prototype.onRender = function() {
        return this.$el.attr('data-element', this.model.get('element'));
      };

      return HotspotElementView;

    })(Marionette.ItemView);
    return Views.HotspotElementBoxView = (function(_super) {
      __extends(HotspotElementBoxView, _super);

      function HotspotElementBoxView() {
        return HotspotElementBoxView.__super__.constructor.apply(this, arguments);
      }

      HotspotElementBoxView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles blue"> <div class="tile-footer drag"> Hotspot Properties </div> <div class="docket-body"> <p class="text-center">Drag the below elements to your hotspot screen</p> <ul class="hotspot-elements-container"> </ul> <div class="clearfix"></div> </div> </div> </div>';

      HotspotElementBoxView.prototype.itemView = Views.HotspotElementView;

      HotspotElementBoxView.prototype.itemViewContainer = 'ul.hotspot-elements-container';

      HotspotElementBoxView.prototype.onShow = function() {
        return this.$el.find('.hotspot-elements').draggable({
          helper: 'clone',
          delay: 5,
          addClasses: false,
          distance: 5,
          revert: 'invalid'
        });
      };

      return HotspotElementBoxView;

    })(Marionette.CompositeView);
  });
});
