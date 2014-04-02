var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.Hotspot.Views', function(Views, App, Backbone, Marionette, $, _) {
    var closequestionelementproperty, closequestionelements;
    closequestionelementproperty = true;
    closequestionelements = true;
    return Views.HotspotView = (function(_super) {
      __extends(HotspotView, _super);

      function HotspotView() {
        return HotspotView.__super__.constructor.apply(this, arguments);
      }

      HotspotView.prototype.className = 'stage';

      HotspotView.prototype.template = '&nbsp;';

      HotspotView.prototype.events = {
        'mousedown': function() {
          return this.trigger("show:hotspot:properties");
        }
      };

      HotspotView.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        this.stageName = "stage" + new Date().getTime();
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
        console.log("in canvas");
        this.stage = new Kinetic.Stage({
          container: this.stageName,
          width: this.$el.parent().width(),
          height: this.$el.parent().height() + 80
        });
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
        this._setPropertyBoxCloseHandlers();
        this.listenTo(this, 'add:hotspot:element', function(type, elementPos) {
          this._addElements(type, elementPos);
          return this._updateDefaultLayer();
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

      HotspotView.prototype._setPropertyBoxCloseHandlers = function() {
        $('body').on('mousedown', function() {
          if (closequestionelementproperty) {
            App.execute("close:question:element:properties");
          }
          if (closequestionelements && closequestionelementproperty) {
            return App.execute("close:question:elements");
          }
        });
        $('#question-elements-property').on('mouseover', function() {
          return closequestionelementproperty = false;
        });
        $('#question-elements-property').on('mouseout', function() {
          return closequestionelementproperty = true;
        });
        $('#' + this.stageName + '.stage').on('mouseenter', '.kineticjs-content', function() {
          return closequestionelements = false;
        });
        $('#' + this.stageName + '.stage').on('mouseleave', '.kineticjs-content', function() {
          return closequestionelements = true;
        });
        $('#question-elements').on('mouseover', function() {
          return closequestionelements = false;
        });
        return $('#question-elements').on('mouseout', function() {
          return closequestionelements = true;
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
            _this.defaultLayer.add(_this.hotspotDefault);
            return _this._updateDefaultImageSize();
          };
        })(this);
        return defaultImage.src = "../wp-content/themes/walnut/images/empty-hotspot.svg";
      };

      HotspotView.prototype._updateDefaultLayer = function() {
        var i;
        i = 1;
        while (i < this.stage.getChildren().length) {
          if (i) {
            if (this.stage.getChildren()[i].getChildren().length) {
              this.defaultLayer.removeChildren();
              break;
            }
          }
          i++;
        }
        return this.defaultLayer.draw();
      };

      HotspotView.prototype._updateDefaultImageSize = function() {
        var height, width;
        width = this.stage.width();
        height = this.stage.height();
        console.log(width + "  " + height);
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
      };

      HotspotView.prototype._addElements = function(type, elementPos) {
        if (type === "Hotspot-Circle") {
          this._addCircle(elementPos);
        } else if (type === "Hotspot-Rectangle") {
          this._addRectangle(elementPos);
        } else if (type === "Hotspot-Text") {
          this._addTextElement(elementPos);
        } else if (type === "Hotspot-Image") {
          App.navigate("media-manager", {
            trigger: true
          });
          this.listenTo(App.vent, "media:manager:choosed:media", (function(_this) {
            return function(media) {
              _this._addImageElement(elementPos, media.toJSON().url);
              return _this.stopListening(App.vent, "media:manager:choosed:media");
            };
          })(this));
        }
        return this.optionLayer.draw();
      };

      HotspotView.prototype._addCircle = function(elementPos) {
        var circle, circleGrp, hotspotElement, modelData, self;
        modelData = {
          type: 'Option',
          shape: 'Circle',
          color: '#000000',
          transparent: false,
          correct: false
        };
        hotspotElement = App.request("create:new:hotspot:element", modelData);
        self = this;
        App.execute("show:question:element:properties", {
          model: hotspotElement
        });
        circle = new Kinetic.Circle({
          name: "rect1",
          x: elementPos.left,
          y: elementPos.top,
          radius: 20,
          stroke: hotspotElement.get('color'),
          strokeWidth: 2,
          dash: [6, 4],
          dashEnabled: hotspotElement.get('transparent')
        });
        circleGrp = resizeCircle(circle, this.optionLayer);
        hotspotElement.on("change:transparent", (function(_this) {
          return function() {
            console.log('transparent');
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
            closequestionelementproperty = true;
            App.execute("close:question:element:properties");
            return _this.optionLayer.draw();
          };
        })(this));
        circleGrp.on('mousedown click', function(e) {
          e.stopPropagation();
          return App.execute("show:question:element:properties", {
            model: hotspotElement
          });
        });
        circleGrp.on('mouseover', function() {
          return closequestionelementproperty = false;
        });
        return circleGrp.on('mouseout', function() {
          return closequestionelementproperty = true;
        });
      };

      HotspotView.prototype._addRectangle = function(elementPos) {
        var box, hotspotElement, modelData, rectGrp, self;
        alert(SITEURL);
        modelData = {
          type: 'Option',
          shape: 'Rect',
          color: '#000000',
          transparent: false,
          angle: 0,
          correct: false
        };
        hotspotElement = App.request("create:new:hotspot:element", modelData);
        self = this;
        App.execute("show:question:element:properties", {
          model: hotspotElement
        });
        box = new Kinetic.Rect({
          name: "rect2",
          x: elementPos.left,
          y: elementPos.top,
          width: 25,
          height: 25,
          stroke: hotspotElement.get('color'),
          strokeWidth: 2,
          dash: [6, 4],
          dashEnabled: hotspotElement.get('transparent')
        });
        rectGrp = resizeRect(box, this.optionLayer);
        hotspotElement.on("change:transparent", (function(_this) {
          return function() {
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
              console.log(hotspotElement.get('correct'));
            } else {
              box.fill('');
            }
            return _this.optionLayer.draw();
          };
        })(this));
        hotspotElement.on("change:toDelete", (function(_this) {
          return function() {
            rectGrp.destroy();
            closequestionelementproperty = true;
            App.execute("close:question:element:properties");
            return _this.optionLayer.draw();
          };
        })(this));
        rectGrp.on('mousedown click', function(e) {
          e.stopPropagation();
          return App.execute("show:question:element:properties", {
            model: hotspotElement
          });
        });
        rectGrp.on('mouseover', function() {
          return closequestionelementproperty = false;
        });
        return rectGrp.on('mouseout', function() {
          return closequestionelementproperty = true;
        });
      };

      HotspotView.prototype._addTextElement = function(elementPos) {
        var canvasText, hotspotElement, modelData, rotator, self, tooltip;
        modelData = {
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
        self = this;
        App.execute("show:question:element:properties", {
          model: hotspotElement
        });
        tooltip = new Kinetic.Label({
          x: elementPos.left,
          y: elementPos.top,
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
          padding: 5
        });
        rotator = new Kinetic.Circle({
          x: canvasText.width(),
          y: 0,
          stroke: 'black',
          radius: 5,
          draggable: true
        });
        tooltip.on('mousedown click', function(e) {
          e.stopPropagation();
          App.execute("show:question:element:properties", {
            model: hotspotElement
          });
          return console.log(this);
        });
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
            closequestionelementproperty = true;
            App.execute("close:question:element:properties");
            return _this.textLayer.draw();
          };
        })(this));
        hotspotElement.on("change:textAngle", (function(_this) {
          return function() {
            tooltip.rotation(hotspotElement.get('textAngle'));
            console.log(tooltip.rotation());
            return _this.textLayer.draw();
          };
        })(this));
        tooltip.on('mouseover', function() {
          return closequestionelementproperty = false;
        });
        tooltip.on('mouseout', function() {
          return closequestionelementproperty = true;
        });
        tooltip.add(canvasText);
        this.textLayer.add(tooltip);
        return this.textLayer.draw();
      };

      HotspotView.prototype._addImageElement = function(elementPos, url) {
        var imageObject;
        imageObject = new Image();
        imageObject.onload = (function(_this) {
          return function() {
            var imageElement, imageGrp;
            console.log("in default image load");
            imageElement = new Kinetic.Image({
              image: imageObject,
              x: elementPos.left,
              y: elementPos.top,
              width: 150,
              height: 150
            });
            imageGrp = resizeRect(imageElement, _this.imageLayer);
            _this.imageLayer.draw();
            return _this._updateDefaultLayer();
          };
        })(this);
        return imageObject.src = url;
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
