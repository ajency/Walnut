var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.ContentBuilder.Element.BigAnswer.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.BigAnswerView = (function(_super) {
      __extends(BigAnswerView, _super);

      function BigAnswerView() {
        return BigAnswerView.__super__.constructor.apply(this, arguments);
      }

      BigAnswerView.prototype.template = '<input  type="text" maxlength="{{maxlength}}" placeholder="Answer" style=" font-family: {{font}}; font-size: {{font_size}}px; color: {{color}}; width:100%; height: 100%; line-height : inherit; border-width : 5px; border-style: none;">';

      BigAnswerView.prototype.onShow = function() {
        this.$el.parent().parent().on('click', (function(_this) {
          return function(evt) {
            _this.trigger("show:this:biganswer:properties");
            return evt.stopPropagation();
          };
        })(this));
        this._changeBGColor();
        return this._changeBigAnswerStyle(this.model, this.model.get('style'));
      };

      BigAnswerView.prototype.modelEvents = {
        'change:maxlength': '_changeMaxLength',
        'change:font': '_changeFont',
        'change:font_size': '_changeSize',
        'change:color': '_changeColor',
        'change:bg_color': '_changeBGColor',
        'change:bg_opacity': '_changeBGColor',
        'change:style': '_changeBigAnswerStyle'
      };

      BigAnswerView.prototype._changeMaxLength = function(model, maxlength) {
        return this.$el.find('input').prop('maxLength', parseInt(maxlength));
      };

      BigAnswerView.prototype._changeFont = function(model, font) {
        return this.$el.find('input').css('font-family', font);
      };

      BigAnswerView.prototype._changeSize = function(model, size) {
        return this.$el.find('input').css('font-size', size + "px");
      };

      BigAnswerView.prototype._changeColor = function(model, color) {
        return this.$el.find('input').css('color', color);
      };

      BigAnswerView.prototype._changeBGColor = function(model, bgColor) {
        return this.$el.find('input').css('background-color', _.convertHex(this.model.get('bg_color'), this.model.get('bg_opacity')));
      };

      BigAnswerView.prototype._changeBigAnswerStyle = function(model, style) {
        if (style === 'uline') {
          return this.$el.find('input').css('border-style', 'none none groove none');
        } else if (style === 'box') {
          return this.$el.find('input').css('border-style', 'groove');
        } else {
          return this.$el.find('input').css('border-style', 'none');
        }
      };

      return BigAnswerView;

    })(Marionette.ItemView);
  });
});
