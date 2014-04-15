var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.FibPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> FIB<i class="fa fa-chevron-right"></i> <span class="semi-bold">Fill In The Blanks Properties</span> </div> <div class="docket-body"> <div >Max Characters <input id="answer-max-length" type="type"  value="{{maxlength}}"> </div> <div> <input id="check-case-sensitive" type="checkbox" name="check-ind-marks"> Case Sensitive </div> <div> Font <select class="font" id="fib-font"> <option value="Arial"> Arial </option> <option value="Calibri"> Calibri </option> <option value="Comic Sans MS"> Comic Sans MS </option> <option value="Courier"> Courier </option> <option value="Georgia"> Georgia </option> <option value="Helvetica"> Helvetica </option> <option value="Impact"> Impact </option> <option value="Lucida Console"> Lucida Console </option> <option value="Lucida Sans Unicode"> Lucida Sans Unicode </option> <option value="Tahoma"> Tahoma </option> <option value="Times New Roman"> Times New Roman </option> <option value="Trebuchet MS"> Trebuchet MS </option> <option value="Verdana"> Verdana </option> </select> </div> <div class=""> <div class="textProp slider success"> Size <input type="text" id="fib-fontsize" class="fontSize" data-slider-max="80" data-slider-max="12" data-slider-step="1" data-slider-value="{{font_size}}" data-slider-orientation="horizontal" data-slider-selection="before"> </div> </div> <div> Marks <select id="marks"> <option value="1">1</option> <option value="2">2</option> </select> </div> <div class="form-group inline"> Font-Color <input type="hidden" id="font-color" class="color-picker" value="{{color}}"> </div> <div class="form-group inline"> Background-Color <input type="hidden" id="bg-color" data-opacity="{{bg_opacity}}" class="color-picker" value={{bg_color}}> </div> </div> </div> </div>';

      PropertyView.prototype.events = {
        'blur #answer-max-length': '_changeMaxLength',
        'change input#check-case-sensitive': '_checkCaseSensitive',
        'change select#fib-font': '_changeFont'
      };

      PropertyView.prototype.onShow = function(options) {
        if (this.model.get('case_sensitive')) {
          this.$el.find('#check-case-sensitive').prop('checked', true);
        }
        $('#fib-font').select2({
          minimumResultsForSearch: -1
        });
        $('#fib-font').select2('val', this.model.get('font'));
        $('.fontSize').slider();
        $('#fib-fontsize').slider().on('slide', (function(_this) {
          return function() {
            var size;
            size = _this.model.get('font_size');
            return _this.model.set('font_size', $('.fontSize').slider('getValue').val() || size);
          };
        })(this));
        $('#font-color.color-picker').minicolors({
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
        return $('#bg-color.color-picker').minicolors({
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

      PropertyView.prototype._changeMaxLength = function(evt) {
        if (!isNaN($(evt.target).val())) {
          console.log(this.model);
          this.model.set('maxlength', $(evt.target).val());
          return console.log(this.model);
        }
      };

      return PropertyView;

    })(Marionette.ItemView);
  });
});
