var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.HotspotElementPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.TextView = (function(_super) {
      __extends(TextView, _super);

      function TextView() {
        return TextView.__super__.constructor.apply(this, arguments);
      }

      TextView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> Text Properties </div> <div class="docket-body"> <div class="form-group"> <textarea id="hotspot-textelement-text" class="textarea" placeholder="Enter Text here" >{{text}}</textarea> </div> <div class="form-group"> <select class="font" id="hotspot-textelement-fontfamily"> <option value="0">Select a Font</option> <option value="1">Times New Roman</option> <option value="2">Georgia</option> <option value="2">Helvetica</option> </select> </div> <div class="form-group"> <div class="textProp slider success"> Size <input type="text" id="hotspot-textelement-fontsize" class="fontSize" data-slider-max="80" data-slider-step="1" data-slider-value="{{fontSize}}" data-slider-orientation="horizontal" data-slider-selection="before"> </div> </div> </div> </div> </div>';

      TextView.prototype.onShow = function() {
        $('.fontSize').slider();
        $('#hotspot-textelement-text').on('input', (function(_this) {
          return function() {
            return _this.model.set("text", $('#hotspot-textelement-text').val());
          };
        })(this));
        return $('#hotspot-textelement-fontsize').slider().on('slide', (function(_this) {
          return function() {
            var size;
            size = _this.model.get('fontSize');
            _this.model.set('fontSize', $('.fontSize').slider('getValue').val() || size);
            return console.log($('.fontSize').slider('getValue').val() || size);
          };
        })(this));
      };

      return TextView;

    })(Marionette.ItemView);
  });
});
