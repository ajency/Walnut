var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.Hotspot.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.HotspotView = (function(_super) {
      __extends(HotspotView, _super);

      function HotspotView() {
        return HotspotView.__super__.constructor.apply(this, arguments);
      }

      HotspotView.prototype.className = 'stage';

      HotspotView.prototype.template = '&nbsp;';

      HotspotView.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
      };

      HotspotView.prototype.onRender = function() {
        return this.$el.attr('id', 'stage');
      };

      HotspotView.prototype.onShow = function() {
        this.stage = new Kinetic.Stage({
          container: 'stage',
          width: 300,
          height: 400
        });
        this.layer = new Kinetic.Layer({
          width: 100
        });
        return this.stage.add(this.layer);
      };

      return HotspotView;

    })(Marionette.ItemView);
  });
});
