var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'holder', 'text!apps/content-preview/content-board/element/templates/element.html'], function(App, Holder, elementTpl) {
  return App.module('ContentPreview.ContentBoard.Element.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.ElementView = (function(_super) {
      __extends(ElementView, _super);

      function ElementView() {
        this.onShow = __bind(this.onShow, this);
        this.initialize = __bind(this.initialize, this);
        return ElementView.__super__.constructor.apply(this, arguments);
      }

      ElementView.prototype.template = elementTpl;

      ElementView.prototype.tagName = 'div';

      ElementView.prototype.regions = {
        elementRegion: '> .element-markup'
      };

      ElementView.prototype.className = 'element-wrapper';

      ElementView.prototype.initialize = function() {};

      ElementView.prototype.onRender = function() {};

      ElementView.prototype.onShow = function() {};

      ElementView.prototype.onBeforeRenderElement = function() {
        var field, _i, _len, _ref, _results;
        _ref = ['meta_id', 'style', 'element'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          _results.push(this.setHiddenField(field, this.model.get(field)));
        }
        return _results;
      };

      ElementView.prototype.setMargin = function(newMargin, prevMargin) {
        var element;
        if (prevMargin == null) {
          prevMargin = '';
        }
        element = this.elementRegion.currentView;
        element.$el.removeClass(prevMargin);
        return element.$el.addClass(newMargin);
      };

      ElementView.prototype.setStyle = function(newStyle, prevStyle) {
        var element;
        if (prevStyle == null) {
          prevStyle = '';
        }
        element = this.elementRegion.currentView;
        element.$el.removeClass(prevStyle);
        return element.$el.addClass(newStyle);
      };

      ElementView.prototype.setHiddenField = function(name, value) {
        if (this.$el.children('form').find("input[name='" + name + "']").length === 1) {
          return this.$el.children('form').find("input[name='" + name + "']").val(value);
        }
      };

      ElementView.prototype.addHiddenFields = function() {
        var field, _i, _len, _ref, _results;
        _ref = ['draggable', 'style'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          _results.push(this.$el.children('form').append("<input type='hidden' name='" + field + "' value=''/>"));
        }
        return _results;
      };

      ElementView.prototype.onElementModelCreated = function() {
        return this.$el.find('.element-markup > span').spin(false);
      };

      ElementView.prototype._getOptions = function() {
        return {
          lines: 10,
          length: 6,
          width: 2.5,
          radius: 7,
          corners: 1,
          rotate: 9,
          direction: 1,
          color: '#000',
          speed: 1,
          trail: 60,
          shadow: false,
          hwaccel: true,
          className: 'spinner',
          zIndex: 2e9,
          top: '0px',
          left: '40px'
        };
      };

      return ElementView;

    })(Marionette.Layout);
  });
});
