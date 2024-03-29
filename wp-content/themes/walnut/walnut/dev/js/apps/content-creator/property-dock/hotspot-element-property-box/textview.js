var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/content-creator/property-dock/hotspot-element-property-box/templates/textview.html'], function(App, Template) {
  return App.module("ContentCreator.PropertyDock.HotspotElementPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.TextView = (function(superClass) {
      extend(TextView, superClass);

      function TextView() {
        return TextView.__super__.constructor.apply(this, arguments);
      }

      TextView.prototype.template = Template;

      TextView.prototype.events = {
        'change #hotspot-textelement-fontfamily': function(e) {
          return this.model.set('fontFamily', $(e.target).val());
        },
        'input #hotspot-textelement-text': function(e) {
          return this.model.set("text", $(e.target).val());
        },
        'click #delete.text-danger': function() {
          return this.model.set('toDelete', true);
        }
      };

      TextView.prototype.mixinTemplateHelpers = function(data) {
        data.getText = function() {
          console.log(_.stripslashes(this.text));
          return _.stripslashes(this.text);
        };
        return data;
      };

      TextView.prototype.onShow = function() {
        var self;
        self = this;
        this.$el.find('.fontSize').slider();
        this.$el.find('#hotspot-textelement-fontsize').slider().on('slide', (function(_this) {
          return function() {
            var size;
            size = _this.model.get('fontSize');
            return _this.model.set('fontSize', _this.$el.find('.fontSize').slider('getValue').val() || size);
          };
        })(this));
        this.$el.find('.dial').val(self.model.get('textAngle'));
        this.$el.find(".dial").knob({
          change: function(val) {
            return self.model.set("textAngle", val);
          }
        });
        this.$el.find('.fontColor').minicolors({
          animationSpeed: 200,
          animationEasing: 'swing',
          control: 'hue',
          position: 'top left',
          showSpeed: 200,
          change: function(hex, opacity) {
            return self.model.set('fontColor', hex);
          }
        });
        this.$el.find('.fontColor').minicolors('value', self.model.get('fontColor'));
        this.$el.find('#hotspot-textelement-fontfamily').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('#hotspot-textelement-fontfamily').select2('val', self.model.get('fontFamily'));
        if (this.model.get('fontBold') === 'bold') {
          this.$el.find('#font-style #bold-checkbox').prop('checked', true);
        }
        if (this.model.get('fontItalics') === 'italic') {
          this.$el.find('#font-style #italic-checkbox').prop('checked', true);
        }
        return this.$el.find('#font-style .btn').on('click', (function(_this) {
          return function() {
            return _.delay(function() {
              console.log("timeout");
              if (_this.$el.find('#font-style #bold-checkbox').prop('checked')) {
                self.model.set('fontBold', "bold");
              } else {
                self.model.set('fontBold', "");
              }
              if (_this.$el.find('#font-style #italic-checkbox').prop('checked')) {
                return self.model.set('fontItalics', "italic");
              } else {
                return self.model.set('fontItalics', "");
              }
            }, 200);
          };
        })(this));
      };

      return TextView;

    })(Marionette.ItemView);
  });
});
