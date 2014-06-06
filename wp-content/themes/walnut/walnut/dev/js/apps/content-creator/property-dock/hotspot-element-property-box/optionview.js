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

      OptionView.prototype.ui = {
        individualMarksTextbox: '#individual-marks'
      };

      OptionView.prototype.events = {
        'blur @ui.individualMarksTextbox': '_changeIndividualMarks'
      };

      OptionView.prototype.initialize = function(options) {
        return this.hotspotModel = options.hotspotModel;
      };

      OptionView.prototype.onShow = function() {
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
        this.$el.find('#delete.text-danger').on('click', (function(_this) {
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
        this._initializeCorrectAnswer();
        this.$el.find('#correct-answer.radio input').on('change', (function(_this) {
          return function() {
            var _ref;
            _this.model.set('correct', (_ref = _this.$el.find('#correct-answer.radio input:checked').val() === "yes") != null ? _ref : {
              "true": false
            });
            return _this._toggleMarks();
          };
        })(this));
        this.ui.individualMarksTextbox.on('change', function() {
          return console.log('marks cxhanged');
        });
        this._toggleMarks();
        return this.listenTo(this.hotspotModel, 'change:enableIndividualMarks', this._toggleMarks);
      };

      OptionView.prototype._initializeCorrectAnswer = function() {
        if (this.model.get('correct')) {
          return this.$el.find("#correct-answer.radio input#yes").prop('checked', true);
        } else {
          return this.$el.find("#correct-answer.radio input#no").prop('checked', true);
        }
      };

      OptionView.prototype._toggleMarks = function(model, enableIndividualMarks) {
        if (this.hotspotModel.get('enableIndividualMarks') && this.model.get('correct')) {
          return this._enableMarks();
        } else {
          this.model.set('marks', 0);
          this.ui.individualMarksTextbox.trigger('change');
          return this._disableMarks();
        }
      };

      OptionView.prototype._disableMarks = function() {
        this.ui.individualMarksTextbox.val(0);
        return this.ui.individualMarksTextbox.prop('disabled', true);
      };

      OptionView.prototype._enableMarks = function() {
        this.ui.individualMarksTextbox.val(this.model.get('marks'));
        return this.ui.individualMarksTextbox.prop('disabled', false);
      };

      OptionView.prototype._changeIndividualMarks = function(evt) {
        if (!isNaN($(evt.target).val())) {
          return this.model.set('marks', parseInt($(evt.target).val()));
        }
      };

      OptionView.prototype.onBeforeClose = function() {
        return this.ui.individualMarksTextbox.trigger('blur');
      };

      return OptionView;

    })(Marionette.ItemView);
  });
});
