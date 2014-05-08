var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module("ContentPreview.ContentBoard.Element.Hotspot.Views", function(Views, App, Backbone, Marionette, $, _) {
    Views.FibView = (function(_super) {
      __extends(FibView, _super);

      function FibView() {
        return FibView.__super__.constructor.apply(this, arguments);
      }

      return FibView;

    })(Marionette.ItemView);
    return Views.HotspotView = (function(_super) {
      __extends(HotspotView, _super);

      function HotspotView() {
        this._setResizeHandler = __bind(this._setResizeHandler, this);
        return HotspotView.__super__.constructor.apply(this, arguments);
      }

      HotspotView.prototype.className = 'stage';

      HotspotView.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        this.textCollection = this.model.get('textCollection');
        this.optionCollection = this.model.get('optionCollection');
        this.imageCollection = this.model.get('imageCollection');
        this.stageName = _.uniqueId('stage');
        this.imageLayer = new Kinetic.Layer({
          name: 'imageLayer'
        });
        this.optionLayer = new Kinetic.Layer({
          name: 'optionLayer'
        });
        this.textLayer = new Kinetic.Layer({
          name: 'textLayer'
        });
        return this.defaultLayer = new Kinetic.Layer({
          name: 'defaultLayer'
        });
      };

      HotspotView.prototype.onRender = function() {
        return this.$el.attr('id', this.stageName);
      };

      HotspotView.prototype.onShow = function() {
        this.stage = new Kinetic.Stage({
          container: this.stageName,
          width: this.$el.parent().width(),
          height: this.$el.parent().height() + 80
        });
        if (this.model.get('height') !== 0) {
          this.stage.height(this.model.get('height'));
        }
        this.stage.add(this.defaultLayer);
        this.stage.add(this.imageLayer);
        this.stage.add(this.textLayer);
        this.stage.add(this.optionLayer);
        this._initializeCanvasResizing();
        this.$el.parent().parent().on('click', (function(_this) {
          return function(evt) {
            _this.trigger('show:hotspot:elements');
            return evt.stopPropagation();
          };
        })(this));
        this.$el.parent().parent().on('mousedown', (function(_this) {
          return function(evt) {
            _this.trigger('close:hotspot:element:properties');
            return evt.stopPropagation();
          };
        })(this));
        this._drawExistingElements();
        return this.$el.find('.kineticjs-content').droppable({
          accept: '.hotspotable',
          drop: (function(_this) {
            return function(evt, ui) {
              var elementPos, type;
              if (ui.draggable.prop("tagName") === 'LI') {
                type = ui.draggable.attr('data-element');
                elementPos = {
                  left: evt.clientX - _this.$el.find('.kineticjs-content').offset().left,
                  top: evt.clientY - _this.$el.find('.kineticjs-content').offset().top + window.pageYOffset
                };
                return _this.triggerMethod("add:hotspot:element", type, elementPos);
              }
            };
          })(this)
        });
      };

      HotspotView.prototype._initializeCanvasResizing = function() {
        this.$el.resize(this._setResizeHandler);
        return this.$el.resizable({
          handles: "s"
        });
      };

      HotspotView.prototype._setResizeHandler = function() {
        this.stage.setSize({
          width: this.$el.width(),
          height: this.$el.height() - 5
        });
        this.model.set('height', this.stage.height());
        return this._updateDefaultImageSize();
      };

      HotspotView.prototype._setDefaultImage = function() {
        var defaultImage;
        defaultImage = new Image();
        defaultImage.onload = (function(_this) {
          return function() {
            _this.hotspotDefault = new Kinetic.Image({
              image: defaultImage
            });
            _this.defaultLayer.add(_this.hotspotDefault);
            _.delay(function() {
              return _this._updateDefaultLayer();
            }, 500);
            return _this._updateDefaultImageSize();
          };
        })(this);
        return defaultImage.src = "../wp-content/themes/walnut/images/empty-hotspot.svg";
      };

      HotspotView.prototype._updateDefaultLayer = function() {
        var i, isEmptyFlag;
        i = 1;
        isEmptyFlag = true;
        while (i < this.stage.getChildren().length) {
          if (i) {
            if (this.stage.getChildren()[i].getChildren().length) {
              this.defaultLayer.removeChildren();
              console.log("remove default");
              isEmptyFlag = false;
              break;
            }
          }
          i++;
        }
        if (isEmptyFlag) {
          if (!this.stage.getChildren()[0].getChildren().length) {
            this._setDefaultImage();
          }
        }
        return this.defaultLayer.draw();
      };

      HotspotView.prototype._updateDefaultImageSize = function() {
        var height, width;
        if (this.hotspotDefault) {
          width = this.stage.width();
          height = this.stage.height();
          this.hotspotDefault.setSize({
            width: 336,
            height: 200
          });
          if (width < 220) {
            this.hotspotDefault.setSize({
              width: width - 10,
              height: (width - 10) / 1.68
            });
          }
          if (height < 160) {
            this.hotspotDefault.setSize({
              width: (height - 10) * 1.68,
              height: height - 10
            });
          }
          this.hotspotDefault.position({
            x: this.stage.width() / 2 - this.hotspotDefault.width() / 2,
            y: this.stage.height() / 2 - this.hotspotDefault.height() / 2
          });
          return this.defaultLayer.draw();
        }
      };

      HotspotView.prototype._drawExistingElements = function() {
        console.log(this.textCollection);
        this.textCollection.each((function(_this) {
          return function(model, i) {
            return _this._addEachElements('Hotspot-Text', model);
          };
        })(this));
        this.optionCollection.each((function(_this) {
          return function(model, i) {
            if (model.get('shape') === 'Rect') {
              _this._addEachElements('Hotspot-Rectangle', model);
            }
            if (model.get('shape') === 'Circle') {
              return _this._addEachElements('Hotspot-Circle', model);
            }
          };
        })(this));
        this.imageCollection.each((function(_this) {
          return function(model, i) {
            return _this._addEachElements('Hotspot-Image', model);
          };
        })(this));
        this._updateDefaultLayer();
        return _.delay((function(_this) {
          return function() {
            return _this.$el.trigger('mousedown');
          };
        })(this), 10);
      };

      HotspotView.prototype._addEachElements = function(type, model) {
        return this.triggerMethod("add:hotspot:element", type, {
          left: model.get('x'),
          top: model.get('y')
        }, model);
      };

      HotspotView.prototype.onAddHotspotElement = function(type, elementPos, model) {
        if (type === "Hotspot-Circle") {
          this._addCircle(elementPos, model);
        } else if (type === "Hotspot-Rectangle") {
          this._addRectangle(elementPos, model);
        } else if (type === "Hotspot-Text") {
          this._addTextElement(elementPos, model);
        } else if (type === "Hotspot-Image") {
          if (model) {
            this._addImageElement(elementPos, model.get('url'), model);
          } else {
            this._uploadImage(elementPos);
          }
        }
        return this._updateDefaultLayer();
      };

      HotspotView.prototype._uploadImage = function(elementPos) {
        App.navigate("media-manager", {
          trigger: true
        });
        this.listenTo(App.vent, "media:manager:choosed:media", (function(_this) {
          return function(media) {
            _this._addImageElement(elementPos, media.toJSON().url);
            return _this.stopListening(App.vent, "media:manager:choosed:media");
          };
        })(this));
        return this.listenTo(App.vent, "stop:listening:to:media:manager", (function(_this) {
          return function() {
            return _this.stopListening(App.vent, "media:manager:choosed:media");
          };
        })(this));
      };

      HotspotView.prototype._addCircle = function(elementPos, model) {
        var circle, circleGrp, hotspotElement, modelData, self;
        if (model) {
          hotspotElement = model;
        } else {
          modelData = {
            type: 'Option',
            shape: 'Circle',
            x: elementPos.left,
            y: elementPos.top,
            radius: 20,
            color: '#000000',
            transparent: false,
            correct: false,
            marks: 1
          };
          hotspotElement = App.request("create:new:hotspot:element", modelData);
          this.optionCollection.add(hotspotElement);
        }
        self = this;
        this.trigger("show:hotspot:element:properties", hotspotElement);
        circle = new Kinetic.Circle({
          x: hotspotElement.get('x'),
          y: hotspotElement.get('y'),
          radius: hotspotElement.get('radius'),
          stroke: hotspotElement.get('color'),
          strokeWidth: 2,
          dash: [6, 4],
          dashEnabled: hotspotElement.get('transparent'),
          fill: hotspotElement.get("correct") ? "rgba(12, 199, 55, 0.28)" : ""
        });
        circleGrp = resizeCircle(circle, this.optionLayer);
        circleGrp.on('dragend', function(e) {
          hotspotElement.set('x', circle.getAbsolutePosition().x);
          hotspotElement.set('y', circle.getAbsolutePosition().y);
          return hotspotElement.set('radius', circle.radius());
        });
        hotspotElement.on("change:transparent", (function(_this) {
          return function() {
            circle.dashEnabled(hotspotElement.get('transparent'));
            return _this.optionLayer.draw();
          };
        })(this));
        hotspotElement.on("change:color", (function(_this) {
          return function() {
            circle.stroke(hotspotElement.get('color'));
            return _this.optionLayer.draw();
          };
        })(this));
        hotspotElement.on("change:correct", (function(_this) {
          return function() {
            if (hotspotElement.get('correct')) {
              circle.fill('rgba(12, 199, 55, 0.28)');
            } else {
              circle.fill('');
            }
            return _this.optionLayer.draw();
          };
        })(this));
        hotspotElement.on("change:toDelete", (function(_this) {
          return function() {
            circleGrp.destroy();
            _this.optionCollection.remove(hotspotElement);
            _this.trigger("close:hotspot:element:properties");
            _this.optionLayer.draw();
            return _this._updateDefaultLayer();
          };
        })(this));
        circleGrp.on('mousedown ', (function(_this) {
          return function(e) {
            e.stopPropagation();
            return _this.trigger("show:hotspot:element:properties", hotspotElement);
          };
        })(this));
        return this.optionLayer.draw();
      };

      HotspotView.prototype._addRectangle = function(elementPos, model) {
        var box, hotspotElement, modelData, rectGrp, self;
        if (model) {
          hotspotElement = model;
        } else {
          modelData = {
            type: 'Option',
            shape: 'Rect',
            x: elementPos.left,
            y: elementPos.top,
            width: 30,
            height: 30,
            color: '#000000',
            transparent: false,
            angle: 0,
            correct: false,
            marks: 1
          };
          hotspotElement = App.request("create:new:hotspot:element", modelData);
          this.optionCollection.add(hotspotElement);
        }
        self = this;
        this.trigger("show:hotspot:element:properties", hotspotElement);
        box = new Kinetic.Rect({
          name: "rect2",
          x: hotspotElement.get('x'),
          y: hotspotElement.get('y'),
          width: hotspotElement.get('width'),
          height: hotspotElement.get('height'),
          stroke: hotspotElement.get('color'),
          strokeWidth: 2,
          dash: [6, 4],
          dashEnabled: hotspotElement.get('transparent'),
          fill: hotspotElement.get("correct") ? "rgba(12, 199, 55, 0.28)" : ""
        });
        rectGrp = resizeRect(box, this.optionLayer);
        rectGrp.rotation(hotspotElement.get('angle'));
        rectGrp.on('dragend', function(e) {
          hotspotElement.set('x', box.getAbsolutePosition().x);
          hotspotElement.set('y', box.getAbsolutePosition().y);
          hotspotElement.set('width', box.width());
          return hotspotElement.set('height', box.height());
        });
        hotspotElement.on("change:transparent", (function(_this) {
          return function() {
            console.log(rectGrp);
            box.dashEnabled(hotspotElement.get('transparent'));
            return _this.optionLayer.draw();
          };
        })(this));
        hotspotElement.on("change:color", (function(_this) {
          return function() {
            box.stroke(hotspotElement.get('color'));
            return _this.optionLayer.draw();
          };
        })(this));
        hotspotElement.on("change:angle", (function(_this) {
          return function() {
            rectGrp.rotation(hotspotElement.get('angle'));
            return _this.optionLayer.draw();
          };
        })(this));
        hotspotElement.on("change:correct", (function(_this) {
          return function() {
            if (hotspotElement.get('correct')) {
              box.fill('rgba(12, 199, 55, 0.28)');
            } else {
              box.fill('');
            }
            return _this.optionLayer.draw();
          };
        })(this));
        hotspotElement.on("change:toDelete", (function(_this) {
          return function() {
            rectGrp.destroy();
            _this.optionCollection.remove(hotspotElement);
            _this.trigger("close:hotspot:element:properties");
            _this.optionLayer.draw();
            return _this._updateDefaultLayer();
          };
        })(this));
        rectGrp.on('mousedown ', (function(_this) {
          return function(e) {
            e.stopPropagation();
            return _this.trigger("show:hotspot:element:properties", hotspotElement);
          };
        })(this));
        return this.optionLayer.draw();
      };

      HotspotView.prototype._addTextElement = function(elementPos, model) {
        var canvasText, hotspotElement, modelData, self, tooltip;
        if (model) {
          hotspotElement = model;
        } else {
          modelData = {
            x: elementPos.left,
            y: elementPos.top,
            type: 'Text',
            text: '',
            fontFamily: 'Arial',
            fontSize: '14',
            fontColor: '#000000',
            fontBold: '',
            fontItalics: '',
            textAngle: 0
          };
          hotspotElement = App.request("create:new:hotspot:element", modelData);
          this.textCollection.add(hotspotElement);
        }
        self = this;
        this.trigger("show:hotspot:element:properties", hotspotElement);
        tooltip = new Kinetic.Label({
          x: hotspotElement.get('x'),
          y: hotspotElement.get('y'),
          width: 100,
          draggable: true,
          dragBoundFunc: function(pos) {
            return self._setBoundRegion(pos, this, self.stage);
          }
        });
        canvasText = new Kinetic.Text({
          text: 'CLICK TO ENTER TEXT',
          opacity: 0.3,
          fontFamily: hotspotElement.get('fontFamily'),
          fontSize: hotspotElement.get('fontSize'),
          fill: hotspotElement.get('fontColor'),
          fontStyle: hotspotElement.get('fontBold') + " " + hotspotElement.get('fontItalics'),
          padding: 5,
          rotation: hotspotElement.get('textAngle')
        });
        tooltip.on('dragend', function(e) {
          hotspotElement.set('x', tooltip.getAbsolutePosition().x);
          return hotspotElement.set('y', tooltip.getAbsolutePosition().y);
        });
        tooltip.on('mousedown ', (function(_this) {
          return function(e) {
            e.stopPropagation();
            return _this.trigger("show:hotspot:element:properties", hotspotElement);
          };
        })(this));
        if (hotspotElement.get('text') !== '') {
          canvasText.setText(hotspotElement.get('text'));
          canvasText.opacity(1);
          canvasText.fill(hotspotElement.get('fontColor'));
        }
        hotspotElement.on("change:text", (function(_this) {
          return function() {
            if (hotspotElement.get('text') !== "") {
              canvasText.setText(hotspotElement.get('text'));
              canvasText.opacity(1);
              canvasText.fill(hotspotElement.get('fontColor'));
            } else {
              canvasText.setText('CLICK TO ENTER TEXT');
              canvasText.opacity(0.3);
              canvasText.fill('fontColor');
            }
            return _this.textLayer.draw();
          };
        })(this));
        hotspotElement.on("change:fontSize", (function(_this) {
          return function() {
            canvasText.fontSize(hotspotElement.get('fontSize'));
            return _this.textLayer.draw();
          };
        })(this));
        hotspotElement.on("change:fontFamily", (function(_this) {
          return function() {
            canvasText.fontFamily(hotspotElement.get('fontFamily'));
            return _this.textLayer.draw();
          };
        })(this));
        hotspotElement.on("change:fontBold change:fontItalics", (function(_this) {
          return function() {
            canvasText.fontStyle(hotspotElement.get('fontBold') + " " + hotspotElement.get('fontItalics'));
            return _this.textLayer.draw();
          };
        })(this));
        hotspotElement.on("change:fontColor", (function(_this) {
          return function() {
            canvasText.fill(hotspotElement.get('fontColor'));
            return _this.textLayer.draw();
          };
        })(this));
        hotspotElement.on("change:toDelete", (function(_this) {
          return function() {
            tooltip.destroy();
            _this.textCollection.remove(hotspotElement);
            _this.trigger("close:hotspot:element:properties");
            _this.textLayer.draw();
            return _this._updateDefaultLayer();
          };
        })(this));
        hotspotElement.on("change:textAngle", (function(_this) {
          return function() {
            tooltip.rotation(hotspotElement.get('textAngle'));
            return _this.textLayer.draw();
          };
        })(this));
        tooltip.add(canvasText);
        this.textLayer.add(tooltip);
        return this.textLayer.draw();
      };

      HotspotView.prototype._addImageElement = function(elementPos, url, model) {
        var hotspotElement, imageGrp, imageObject, modelData;
        if (model) {
          hotspotElement = model;
        } else {
          modelData = {
            type: 'Image',
            x: elementPos.left,
            y: elementPos.top,
            width: 150,
            height: 150,
            angle: 0,
            url: url
          };
          hotspotElement = App.request("create:new:hotspot:element", modelData);
          this.imageCollection.add(hotspotElement);
        }
        imageGrp = null;
        imageObject = new Image();
        imageObject.src = hotspotElement.get('url');
        imageObject.onload = (function(_this) {
          return function() {
            var imageElement;
            _this.trigger("show:hotspot:element:properties", hotspotElement);
            imageElement = new Kinetic.Image({
              image: imageObject,
              x: hotspotElement.get('x'),
              y: hotspotElement.get('y'),
              width: hotspotElement.get('width'),
              height: hotspotElement.get('height')
            });
            imageGrp = resizeRect(imageElement, _this.imageLayer);
            _this._updateDefaultLayer();
            imageGrp.rotation(hotspotElement.get('angle'));
            _this.imageLayer.draw();
            imageGrp.on('dragend', function(e) {
              hotspotElement.set('x', imageElement.getAbsolutePosition().x);
              hotspotElement.set('y', imageElement.getAbsolutePosition().y);
              hotspotElement.set('width', imageElement.width());
              return hotspotElement.set('height', imageElement.height());
            });
            return imageGrp.on('mousedown ', function(e) {
              e.stopPropagation();
              return _this.trigger("show:hotspot:element:properties", hotspotElement);
            });
          };
        })(this);
        hotspotElement.on("change:angle", (function(_this) {
          return function() {
            imageGrp.rotation(hotspotElement.get('angle'));
            return _this.imageLayer.draw();
          };
        })(this));
        return hotspotElement.on("change:toDelete", (function(_this) {
          return function() {
            imageGrp.destroy();
            _this.imageCollection.remove(hotspotElement);
            _this.trigger("close:hotspot:element:properties");
            _this.imageLayer.draw();
            return _this._updateDefaultLayer();
          };
        })(this));
      };

      HotspotView.prototype._setBoundRegion = function(pos, inner, outer) {
        var X, Y, height, maxX, maxY, minX, minY;
        height = inner.getHeight();
        minX = outer.getX();
        maxX = outer.getX() + outer.getWidth() - inner.getWidth();
        minY = outer.getY();
        maxY = outer.getY() + outer.getHeight() - inner.getHeight();
        X = pos.x;
        Y = pos.y;
        if (X < minX) {
          X = minX;
        }
        if (X > maxX) {
          X = maxX;
        }
        if (Y < minY) {
          Y = minY;
        }
        if (Y > maxY) {
          Y = maxY;
        }
        return {
          x: X,
          y: Y
        };
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
