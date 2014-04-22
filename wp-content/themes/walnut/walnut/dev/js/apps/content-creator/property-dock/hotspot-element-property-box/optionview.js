var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-creator/property-dock/hotspot-element-property-box/templates/optionview.html'], function(App, Template) {
  return App.module("ContentCreator.PropertyDock.HotspotElementPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.OptionView = (function(_super) {
      __extends(OptionView, _super);

      function OptionView() {
        return OptionView.__super__.constructor.apply(this, arguments);
      }

      OptionView.prototype.template = Template;

      OptionView.prototype.onShow = function() {
        if (this.model.get('transparent')) {
          this.$el.find('#transparency.checkbox #checkbox3').prop('checked', true);
        }
        this.$el.find('#transparency.checkbox').on('change', (function(_this) {
          return function() {
            if (_this.$el.find('#transparency.checkbox').hasClass('checked')) {
              return _this.model.set('transparent', true);
            } else {
              return _this.model.set('transparent', false);
            }
          };
        })(this));
        this.$el.find('.fontColor').minicolors({
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
        this.$el.find('.fontColor').minicolors('value', this.model.get('color'));
        this.$el.find('#delete.btn-danger').on('click', (function(_this) {
          return function() {
            return _this.model.set('toDelete', true);
          };
        })(this));
        if (this.model.get('shape') === 'Rect') {
          this.$el.find('.dial').val(this.model.get('angle'));
          this.$el.find(".dial").knob({
            change: (function(_this) {
              return function(val) {
                return _this.model.set("angle", val);
              };
            })(this)
          });
        } else {
          this.$el.find('#knob').hide();
        }
        if (this.model.get('correct')) {
          this.$el.find("#correct-answer.radio input#yes").prop('checked', true);
        } else {
          this.$el.find("#correct-answer.radio input#no").prop('checked', true);
        }
        return this.$el.find('#correct-answer.radio input').on('change', (function(_this) {
          return function() {
            var _ref;
            return _this.model.set('correct', (_ref = _this.$el.find('#correct-answer.radio input:checked').val() === "yes") != null ? _ref : {
              "true": false
            });
          };
        })(this));
      };

      return OptionView;

    })(Marionette.ItemView);
  });
});
