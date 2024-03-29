var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.SortPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(superClass) {
      extend(PropertyView, superClass);

      function PropertyView() {
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles blue"> <div class="tile-footer drag"> Sort <i class="fa fa-chevron-right"></i> <span class="semi-bold">Sort Properties</span> </div> <div class="docket-body"> <div> Options <select id="options-num"> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> <option value="7">7</option> <option value="8">8</option> </select> </div> <div class="m-b-10"> Marks <input id="marks" type="text" value="{{marks}}" class="form-control" > </div> <div class=" inline colors"> Background Color <input type="hidden" id="bg-color"  class="color-picker" value={{bg_color}}> </div> <div class="textProp slider success"> Background Transparency <input type="text" id="bg-opacity" class="opacity" data-slider-max="1" data-slider-min="0" data-slider-step="0.01" data-slider-value="{{bg_opacity}}" data-slider-orientation="horizontal" data-slider-selection="before" style="width:85%"> </div> <div class="textProp slider success"> Height <input type="text" id="sort-height" class="height" data-slider-max="100" data-slider-min="40" data-slider-step="5" data-slider-value="{{height}}" data-slider-orientation="horizontal" data-slider-selection="before" style="width:85%"> </div> </div> </div> </div>';

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
          change: (function(_this) {
            return function(hex, opacity) {
              return _this.model.set('bg_color', hex);
            };
          })(this)
        });
        this.$el.find('#bg-opacity').slider();
        this.$el.find('#bg-opacity').slider().on('slide', (function(_this) {
          return function() {
            return _this.model.set('bg_opacity', _this.$el.find('#bg-opacity').slider('getValue').val());
          };
        })(this));
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
