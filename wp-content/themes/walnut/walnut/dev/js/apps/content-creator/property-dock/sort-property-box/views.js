var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.SortPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> MCQ <i class="fa fa-chevron-right"></i> <span class="semi-bold">Multiple Choice Question Properties</span> </div> <div class="docket-body"> <div> Options <select id="options-num"> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> <option value="7">7</option> <option value="8">8</option> </select> </div> <div class="m-b-10"> Marks <input id="marks" type="text" value="{{marks}}" class="form-control" > </div> <div class="form-group inline"> Background-Color <input type="hidden" id="bg-color" data-opacity="{{bg_opacity}}" class="color-picker" value={{bg_color}}> </div> <div class="slider success"> Height <input type="text" id="sort-height" class="height" data-slider-max="100" data-slider-min="40" data-slider-step="5" data-slider-value="{{height}}" data-slider-orientation="horizontal" data-slider-selection="before"> </div> </div> </div> </div>';

      PropertyView.prototype.events = {
        'change select#options-num': '_changeOptionNumber',
        'blur input#marks': '_changeMarks'
      };

      PropertyView.prototype.onShow = function() {
        this.$el.find('select#options-num').select2({
          minimumResultsForSearch: -1
        });
        this.$el.find('select#options-num').select2('val', this.model.get('optioncount'));
        this.$el.find('#bg-color.color-picker').minicolors({
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
        this.$el.find('#sort-height.height').slider();
        return this.$el.find('#sort-height.height').slider().on('slide', (function(_this) {
          return function() {
            var height;
            height = _this.model.get('height');
            return _this.model.set('height', _this.$el.find('#sort-height.height').slider('getValue').val() || height);
          };
        })(this));
      };

      PropertyView.prototype._changeMarks = function(evt) {
        if (!isNaN($(evt.target).val())) {
          return this.model.set('marks', parseInt($(evt.target).val()));
        }
      };

      PropertyView.prototype._changeOptionNumber = function(evt) {
        return this.model.set('optioncount', parseInt($(evt.target).val()));
      };

      return PropertyView;

    })(Marionette.ItemView);
  });
});
