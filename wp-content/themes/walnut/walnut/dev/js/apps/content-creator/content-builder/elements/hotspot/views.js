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
          height: 500
        });
        this.imageLayer = new Kinetic.Layer;
        this.optionLayer = new Kinetic.Layer;
        this.stage.add(this.imageLayer);
        this.stage.add(this.optionLayer);
        this.listenTo(this, 'add:hotspot:element', function(type) {
          return this._addShapes(type);
        });
        return $('.stage .kineticjs-content').droppable({
          drop: (function(_this) {
            return function(evt, ui) {
              var type;
              if (ui.draggable.prop("tagName") === 'LI') {
                type = ui.draggable.attr('data-element');
                return _this.trigger("add:hotspot:element", type);
              }
            };
          })(this)
        });
      };

      HotspotView.prototype._addShapes = function(type) {
        var box;
        if (type === "Hotspot-Circle") {
          console.log(type);
          box = new Kinetic.Circle({
            name: "rect1",
            x: 100,
            y: 100,
            radius: 20,
            stroke: 'black',
            strokeWidth: 4,
            draggable: true
          });
          this.optionLayer.add(box);
        } else if (type === "Hotspot-Rectangle") {
          box = new Kinetic.Rect({
            name: "rect1",
            x: 10,
            y: 15,
            width: 25,
            height: 25,
            stroke: 'black',
            strokeWidth: 4,
            draggable: true
          });
          this.optionLayer.add(box);
        }
        return this.optionLayer.draw();
      };

      return HotspotView;

    })(Marionette.ItemView);
  });
});
