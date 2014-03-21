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
        return this.stageName = "stage" + new Date().getTime();
      };

      HotspotView.prototype.onRender = function() {
        return this.$el.attr('id', this.stageName);
      };

      HotspotView.prototype.onShow = function() {
        console.log("in canvas");
        this.stage = new Kinetic.Stage({
          container: this.stageName,
          width: this.$el.parent().width() - 15,
          height: this.$el.parent().height() + 80
        });
        $('#' + this.stageName + '.stage').resize((function(_this) {
          return function() {
            console.log($('#' + _this.stageName + '.stage').width());
            return _this.stage.setSize({
              width: $('#' + _this.stageName + '.stage').width(),
              height: $('#' + _this.stageName + '.stage').height() - 5
            });
          };
        })(this));
        this.imageLayer = new Kinetic.Layer;
        this.optionLayer = new Kinetic.Layer;
        this.stage.add(this.imageLayer);
        this.stage.add(this.optionLayer);
        this.listenTo(this, 'add:hotspot:element', function(type, elementPos) {
          if (type === "Image") {
            this.trigger("show:media:manager");
          }
          return this._addShapes(type, elementPos);
        });
        return $('#' + this.stageName + ' .kineticjs-content').droppable({
          accept: '.hotspotable',
          drop: (function(_this) {
            return function(evt, ui) {
              var elementPos, type;
              if (ui.draggable.prop("tagName") === 'LI') {
                type = ui.draggable.attr('data-element');
                elementPos = {
                  left: evt.clientX - $('#' + _this.stageName + ' .kineticjs-content').offset().left,
                  top: evt.clientY - $('#' + _this.stageName + ' .kineticjs-content').offset().top + window.pageYOffset
                };
                return _this.trigger("add:hotspot:element", type, elementPos);
              }
            };
          })(this)
        });
      };

      HotspotView.prototype._addShapes = function(type, elementPos) {
        var box, circle;
        if (type === "Hotspot-Circle") {
          circle = new Kinetic.Circle({
            name: "rect1",
            x: elementPos.left,
            y: elementPos.top,
            radius: 20,
            stroke: 'black',
            strokeWidth: 4
          });
          resizeCircle(circle, this.optionLayer);
        } else if (type === "Hotspot-Rectangle") {
          box = new Kinetic.Rect({
            name: "rect2",
            x: elementPos.left,
            y: elementPos.top,
            width: 25,
            height: 25,
            stroke: 'black',
            strokeWidth: 4
          });
          resizeRect(box, this.optionLayer);
        }
        return this.optionLayer.draw();
      };

      return HotspotView;

    })(Marionette.ItemView);
  });
});
