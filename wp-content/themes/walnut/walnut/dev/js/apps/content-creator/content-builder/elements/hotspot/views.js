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

      HotspotView.prototype.events = {
        'click': function() {
          return this.trigger("show:hotspot:properties");
        }
      };

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
        this.imageLayer = new Kinetic.Layer;
        this.optionLayer = new Kinetic.Layer;
        this.textLayer = new Kinetic.Layer;
        this.defaultLayer = new Kinetic.Layer;
        this._setDefaultImage();
        this.stage.add(this.defaultLayer);
        this.stage.add(this.imageLayer);
        this.stage.add(this.textLayer);
        this.stage.add(this.optionLayer);
        $('#' + this.stageName + '.stage').resize((function(_this) {
          return function() {
            _this.stage.setSize({
              width: $('#' + _this.stageName + '.stage').width(),
              height: $('#' + _this.stageName + '.stage').height() - 5
            });
            console.log("Stage resized");
            return _this._updateDefaultImageSize();
          };
        })(this));
        $('#' + this.stageName + '.stage').resizable({
          handles: "s"
        });
        this.listenTo(this, 'add:hotspot:element', function(type, elementPos) {
          if (type === "Hotspot-Image") {
            this.trigger("show:media:manager");
          } else {
            this._addElements(type, elementPos);
          }
          return this._updateDefaultLayer();
        });
        $('button.btn.btn-success.btn-cons2').on('mouseover', (function(_this) {
          return function() {
            return console.log(_this.stage.toJSON());
          };
        })(this));
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

      HotspotView.prototype._setDefaultImage = function() {
        var defaultImage;
        defaultImage = new Image();
        defaultImage.onload = (function(_this) {
          return function() {
            console.log("in default image load");
            _this.hotspotDefault = new Kinetic.Image({
              image: defaultImage
            });
            _this._updateDefaultImageSize();
            _this.defaultLayer.add(_this.hotspotDefault);
            return _this.defaultLayer.draw();
          };
        })(this);
        return defaultImage.src = "../wp-content/themes/walnut/images/empty-hotspot.svg";
      };

      HotspotView.prototype._updateDefaultLayer = function() {
        var i, _results;
        i = 1;
        _results = [];
        while (i < this.stage.getChildren().length) {
          if (i) {
            if (this.stage.getChildren()[i].getChildren().length) {
              this.defaultLayer.remove(this.hotspotElement);
              break;
            }
            console.log(this.stage.getChildren()[i]);
          }
          _results.push(i++);
        }
        return _results;
      };

      HotspotView.prototype._updateDefaultImageSize = function() {
        var height, width;
        width = this.stage.width();
        height = this.stage.height();
        console.log(width + "  " + height);
        if (width < 220) {
          this.hotspotDefault.setSize({
            width: width - 10,
            height: (width - 10) / 1.4
          });
        }
        if (height < 160) {
          this.hotspotDefault.setSize({
            width: (height - 10) * 1.4,
            height: height - 10
          });
        }
        return this.hotspotDefault.position({
          x: this.stage.width() / 2 - this.hotspotDefault.width() / 2,
          y: this.stage.height() / 2 - this.hotspotDefault.height() / 2
        });
      };

      HotspotView.prototype._addElements = function(type, elementPos) {
        if (type === "Hotspot-Circle") {
          this._addCircle(elementPos);
        } else if (type === "Hotspot-Rectangle") {
          this._addRectangle(elementPos);
        } else if (type === "Hotspot-Text") {
          this._addTextElement(elementPos);
        }
        return this.optionLayer.draw();
      };

      HotspotView.prototype._addCircle = function(elementPos) {
        var circle;
        circle = new Kinetic.Circle({
          name: "rect1",
          x: elementPos.left,
          y: elementPos.top,
          radius: 20,
          stroke: 'black',
          strokeWidth: 4
        });
        return resizeCircle(circle, this.optionLayer);
      };

      HotspotView.prototype._addRectangle = function(elementPos) {
        var box;
        box = new Kinetic.Rect({
          name: "rect2",
          x: elementPos.left,
          y: elementPos.top,
          width: 25,
          height: 25,
          stroke: 'black',
          strokeWidth: 4
        });
        return resizeRect(box, this.optionLayer);
      };

      HotspotView.prototype._addTextElement = function(elementPos) {
        var canvasText, hotspotElement, modelData, textBorder, tooltip;
        modelData = {
          text: '',
          fontFamily: 'Arial',
          fontSize: '12',
          fontColor: 'black'
        };
        hotspotElement = App.request("create:new:hotspot:element", modelData);
        tooltip = new Kinetic.Label({
          x: elementPos.left,
          y: elementPos.top,
          width: 100,
          opacity: 0.75,
          draggable: true
        });
        textBorder = new Kinetic.Tag({
          fill: 'white',
          stroke: 'black',
          width: 50,
          lineJoin: 'round'
        });
        canvasText = new Kinetic.Text({
          text: hotspotElement.get('text'),
          fontFamily: hotspotElement.get('fontFamily'),
          fontSize: hotspotElement.get('fontSize'),
          fill: hotspotElement.get('fontColor'),
          padding: 5
        });
        tooltip.on('click', function() {
          return console.log("text box");
        });
        tooltip.add(textBorder);
        tooltip.add(canvasText);
        this.textLayer.add(tooltip);
        return this.textLayer.draw();
      };

      HotspotView.prototype.updateModel = function() {
        this.layout.model.set('content', this._getHotspotData());
        return console.log('updatedmodel             ' + this.layout.model);
      };

      HotspotView.prototype._getHotspotData = function() {
        return this.stage.toJSON();
      };

      return HotspotView;

    })(Marionette.ItemView);
  });
});
