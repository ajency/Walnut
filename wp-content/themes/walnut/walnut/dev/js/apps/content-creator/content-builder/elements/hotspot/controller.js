var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/hotspot/views'], function(App, Element) {
  return App.module('ContentCreator.ContentBuilder.Element.Hotspot', function(Hotspot, App, Backbone, Marionette, $, _) {
    return Hotspot.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this.renderElement = bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.eventObj = options.eventObj;
        _.defaults(options.modelData, {
          element: 'Hotspot',
          height: 0,
          marks: 1,
          transparent: false,
          enableIndividualMarks: false,
          optionCollection: [],
          textCollection: [],
          imageCollection: [],
          complete: false
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype._getHotspotView = function() {
        return new Hotspot.Views.HotspotView({
          model: this.layout.model
        });
      };

      Controller.prototype.renderElement = function() {
        var imageCollectionArray, optionCollectionArray, textCollectionArray;
        optionCollectionArray = this.layout.model.get('optionCollection');
        textCollectionArray = this.layout.model.get('textCollection');
        imageCollectionArray = this.layout.model.get('imageCollection');
        this._parseArray(optionCollectionArray, textCollectionArray, imageCollectionArray);
        if (!(optionCollectionArray instanceof Backbone.Collection)) {
          this.optionCollection = App.request("create:new:hotspot:element:collection", optionCollectionArray);
          this.textCollection = App.request("create:new:hotspot:element:collection", textCollectionArray);
          this.imageCollection = App.request("create:new:hotspot:element:collection", imageCollectionArray);
          this.layout.model.set('optionCollection', this.optionCollection);
          this.layout.model.set('textCollection', this.textCollection);
          this.layout.model.set('imageCollection', this.imageCollection);
        }
        this.view = this._getHotspotView();
        this.listenTo(this.view, "show show:hotspot:elements", (function(_this) {
          return function() {
            App.execute("show:question:elements", {
              model: _this.layout.model
            });
            return App.execute("show:question:properties", {
              model: _this.layout.model
            });
          };
        })(this));
        this.listenTo(this.view, "close:hotspot:element:properties", function() {
          return App.execute("close:question:element:properties");
        });
        this.listenTo(this.view, "show:hotspot:element:properties", function(hotspotElement) {
          return App.execute("show:hotspot:element:properties", {
            model: hotspotElement,
            hotspotModel: this.layout.model
          });
        });
        return this.layout.elementRegion.show(this.view, {
          loading: true
        });
      };

      Controller.prototype._parseArray = function(optionCollectionArray, textCollectionArray, imageCollectionArray) {
        _.each(optionCollectionArray, (function(_this) {
          return function(option) {
            return _this._parseObject(option);
          };
        })(this));
        _.each(textCollectionArray, (function(_this) {
          return function(text) {
            return _this._parseObject(text);
          };
        })(this));
        return _.each(imageCollectionArray, (function(_this) {
          return function(image) {
            return _this._parseObject(image);
          };
        })(this));
      };

      Controller.prototype._parseObject = function(object) {
        var Booleans, Floats, Integers;
        Integers = ['radius', 'marks', 'width', 'height', 'angle', 'textAngle', 'fontSize'];
        Floats = ['x', 'y'];
        Booleans = ['toDelete', 'correct'];
        return _.each(object, function(value, key) {
          if (indexOf.call(Integers, key) >= 0) {
            object[key] = parseInt(value);
          }
          if (indexOf.call(Floats, key) >= 0) {
            object[key] = parseFloat(value);
          }
          if (indexOf.call(Booleans, key) >= 0) {
            return object[key] = _.toBoolean(value);
          }
        });
      };

      Controller.prototype.deleteElement = function(model) {
        model.set('optionCollection', '');
        model.set('textCollection', '');
        model.set('imageCollection', '');
        Controller.__super__.deleteElement.call(this, model);
        App.execute("close:question:elements");
        App.execute("close:question:properties");
        return App.execute("close:question:element:properties");
      };

      return Controller;

    })(Element.Controller);
  });
});
