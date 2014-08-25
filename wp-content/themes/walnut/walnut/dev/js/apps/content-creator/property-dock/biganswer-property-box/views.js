var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.BigAnswerPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> BigAnswer<i class="fa fa-chevron-right"></i> <span class="semi-bold">Big Answer Properties</span> </div> <div class="docket-body"> <!--	<div class="form-group"> <div class="bootstrap-tagsinput"> <input id="correct-answers" value="{{correctanswersFn}}" type="text" data-role="tagsinput" placeholder="Type Answer and press Enter" /> </div> </div> --> <div class="checkbox check-success"> <input id="check-case-sensitive" type="checkbox" name="check-ind-marks"> <label for="check-case-sensitive">Case Sensitive</label> </div> <div class="m-b-10">Max Characters <input id="answer-max-length" type="text"  value="{{maxlength}}" > </div> <div class="m-b-10"> Font <select class="font" id="biganswer-font"> <option value="Arial"> Arial </option> <option value="Calibri"> Calibri </option> <option value="Comic Sans MS"> Comic Sans MS </option> <option value="Courier"> Courier </option> <option value="Georgia"> Georgia </option> <option value="Helvetica"> Helvetica </option> <option value="Impact"> Impact </option> <option value="Lucida Console"> Lucida Console </option> <option value="Lucida Sans Unicode"> Lucida Sans Unicode </option> <option value="Tahoma"> Tahoma </option> <option value="Times New Roman"> Times New Roman </option> <option value="Trebuchet MS"> Trebuchet MS </option> <option value="Verdana"> Verdana </option> <option value="Chelsea Market"> Chelsea Market </option> <option value="Indie Flower"> Indie Flower </option> <option value="Just Another Hand"> Just Another Hand </option> <option value="Sacramento"> Sacramento </option> </select> </div> <div class="m-b-10 inline colors"> Font Color <input type="hidden" id="font-color" class="color-picker" value="{{color}}"> </div> <div class=""> <div class="textProp slider success"> Font Size <input type="text" id="biganswer-fontsize" class="fontSize" data-slider-max="60" data-slider-min="6" data-slider-step="1" data-slider-value="{{font_size}}" data-slider-orientation="horizontal" data-slider-selection="before"> </div> </div> <div class="m-b-10"> Blank Style <select id="biganswer-style"> <option value="uline">Underline</option> <option value="box">Box</option> <option value="blank">Blank</option> </select> </div> <div class="form-group inline colors"> Blank Background <input type="hidden" id="bg-color" data-opacity="{{bg_opacity}}" class="color-picker" value={{bg_color}}> </div> <div> Marks <input id="marks" type="text" value="{{marks}}" class="form-control" > </div> </div> </div> </div>';

      PropertyView.prototype.events = {
        'blur #answer-max-length': '_changeMaxLength',
        'change input#check-case-sensitive': '_checkCaseSensitive',
        'change select#biganswer-font': '_changeFont',
        'blur input#marks': '_changeMarks',
        'change select#biganswer-style': '_changeStyle'
      };

      PropertyView.prototype.onShow = function(options) {
        if (this.model.get('case_sensitive')) {
          this.$el.find('#check-case-sensitive').prop('checked', true);
        }
        this.$el.find('#biganswer-font').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('#biganswer-font').select2('val', this.model.get('font'));
        this.$el.find('#biganswer-style').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('#biganswer-style').select2('val', this.model.get('style'));
        this.$el.find('.fontSize').slider();
        this.$el.find('#biganswer-fontsize').slider().on('slide', (function(_this) {
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

      PropertyView.prototype._changeMaxLength = function(evt) {
        if (!isNaN($(evt.target).val())) {
          console.log(this.model);
          this.model.set('maxlength', $(evt.target).val());
          return console.log(this.model);
        }
      };

      PropertyView.prototype._changeStyle = function(evt) {
        return this.model.set('style', $(evt.target).val());
      };

      return PropertyView;

    })(Marionette.ItemView);
  });
});
