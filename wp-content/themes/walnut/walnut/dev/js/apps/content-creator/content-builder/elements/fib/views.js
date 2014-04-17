var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.ContentBuilder.Element.Fib.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.FibView = (function(_super) {
      __extends(FibView, _super);

      function FibView() {
        return FibView.__super__.constructor.apply(this, arguments);
      }

      FibView.prototype.template = '<input  type="text" maxlength="{{maxlength}}" placeholder="Answer" style=" font-family: {{font}}; font-size: {{font_size}}px; color: {{color}}; width:100%; height: 100%; line-height : inherit; border-width : 5px; border-style: none;">';

      FibView.prototype.onShow = function() {
        this.$el.parent().parent().on('click', (function(_this) {
          return function(evt) {
            _this.trigger("show:this:fib:properties");
            return evt.stopPropagation();
          };
        })(this));
        this._changeBGColor();
        return this._changeFibStyle(this.model, this.model.get('style'));
      };

      FibView.prototype.modelEvents = {
        'change:maxlength': '_changeMaxLength',
        'change:font': '_changeFont',
        'change:font_size': '_changeSize',
        'change:color': '_changeColor',
        'change:bg_color': '_changeBGColor',
        'change:bg_opacity': '_changeBGColor',
        'change:style': '_changeFibStyle'
      };

      FibView.prototype._changeMaxLength = function(model, maxlength) {
        return this.$el.find('input').prop('maxLength', parseInt(maxlength));
      };

      FibView.prototype._changeFont = function(model, font) {
        return this.$el.find('input').css('font-family', font);
      };

      FibView.prototype._changeSize = function(model, size) {
        return this.$el.find('input').css('font-size', size + "px");
      };

      FibView.prototype._changeColor = function(model, color) {
        return this.$el.find('input').css('color', color);
      };

      FibView.prototype._changeBGColor = function(model, bgColor) {
        return this.$el.find('input').css('background-color', this._convertHex(this.model.get('bg_color'), this.model.get('bg_opacity')));
      };

      FibView.prototype._changeFibStyle = function(model, style) {
        if (style === 'uline') {
          return this.$el.find('input').css('border-style', 'none none groove none');
        } else if (style === 'box') {
          return this.$el.find('input').css('border-style', 'groove');
        } else {
          return this.$el.find('input').css('border-style', 'none');
        }
      };

      FibView.prototype._convertHex = function(hex, opacity) {
        var b, g, r, result;
        hex = hex.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
        return result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
      };

      return FibView;

    })(Marionette.ItemView);
  });
});
