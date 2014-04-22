var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-creator/property-dock/fib-property-box/templates/fibpropview.html'], function(App, Template) {
  return App.module("ContentCreator.PropertyDock.FibPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = Template;

      PropertyView.prototype.events = {
        'change input#check-case-sensitive': '_checkCaseSensitive',
        'change select#fib-font': '_changeFont',
        'change select#marks': '_changeMarks',
        'change select#fib-style': '_changeStyle'
      };

      PropertyView.prototype.onShow = function(options) {
        if (this.model.get('case_sensitive')) {
          this.$el.find('#check-case-sensitive').prop('checked', true);
        }
        this.$el.find('#fib-font').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('#fib-font').select2('val', this.model.get('font'));
        this.$el.find('#marks').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('#marks').select2('val', this.model.get('marks'));
        this.$el.find('#fib-style').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('#fib-style').select2('val', this.model.get('style'));
        this.$el.find('.fontSize').slider();
        this.$el.find('#fib-fontsize').slider().on('slide', (function(_this) {
          return function() {
            var size;
            size = _this.model.get('font_size');
            return _this.model.set('font_size', _this.$el.find('.fontSize').slider('getValue').val() || size);
          };
        })(this));
        this.$el.find('#font-color.color-picker').minicolors({
          animationSpeed: 200,
          animationEasing: 'swing',
          control: 'hue',
          position: 'top left',
          showSpeed: 200,
          change: (function(_this) {
            return function(hex, opacity) {
              return _this.model.set('color', hex);
            };
          })(this)
        });
        return this.$el.find('#bg-color.color-picker').minicolors({
          animationSpeed: 200,
          animationEasing: 'swing',
          control: 'hue',
          position: 'top right',
          showSpeed: 200,
          opacity: true,
          change: (function(_this) {
            return function(hex, opacity) {
              _this.model.set('bg_color', hex);
              return _this.model.set('bg_opacity', opacity);
            };
          })(this)
        });
      };

      PropertyView.prototype._checkCaseSensitive = function(evt) {
        if ($(evt.target).prop('checked')) {
          return this.model.set('case_sensitive', true);
        } else {
          return this.model.set('case_sensitive', false);
        }
      };

      PropertyView.prototype._changeFont = function(evt) {
        return this.model.set('font', $(evt.target).val());
      };

      PropertyView.prototype._changeMarks = function(evt) {
        return this.model.set('marks', $(evt.target).val());
      };

      PropertyView.prototype._changeStyle = function(evt) {
        return this.model.set('style', $(evt.target).val());
      };

      return PropertyView;

    })(Marionette.ItemView);
  });
});
