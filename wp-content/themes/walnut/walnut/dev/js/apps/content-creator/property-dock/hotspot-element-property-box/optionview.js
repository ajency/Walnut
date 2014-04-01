var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.HotspotElementPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.OptionView = (function(_super) {
      __extends(OptionView, _super);

      function OptionView() {
        return OptionView.__super__.constructor.apply(this, arguments);
      }

      OptionView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> Question Properties </div> <div class="docket-body"> <div class="radio radio-success">Is this correct? <input id="yes" type="radio" name="optionyes" value="yes"> <label for="yes">Yes</label> <input id="no" type="radio" name="optionyes" value="no" checked="checked"> <label for="no">No</label> </div> Marks 	<select class="marks"> <option value="1">1</option> <option value="2">2</option> </select> <div class="form-group"> Color  <input type="hidden" id="hidden-input" class="fontColor" value="#1a45a1"> </div> <div id="transparency" class="checkbox check-success"> <input id="checkbox3" type="checkbox" value="1"> <label for="checkbox3">Set Transparent</label> </div> <div id="knob" class="form-group"> Rotate <input type="text" class="dial" data-min="0" data-max="360" data-width="40" data-height="40" data-displayInput=false data-thickness=".5" data-fgColor="#0AA699" data-angleOffset="90" data-cursor=true> </div> <div class="form-group"> <button type="button" id="delete" class="btn btn-danger btn-small">Delete</button> </div> </div> </div> </div>';

      OptionView.prototype.onShow = function() {
        if (this.model.get('transparent')) {
          console.log('yes');
          $('#transparency.checkbox #checkbox3').prop('checked', true);
        }
        $('#transparency.checkbox').on('change', (function(_this) {
          return function() {
            if ($('#transparency.checkbox').hasClass('checked')) {
              return _this.model.set('transparent', true);
            } else {
              return _this.model.set('transparent', false);
            }
          };
        })(this));
        $('.fontColor').minicolors({
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
        $('.fontColor').minicolors('value', this.model.get('color'));
        $('#delete.btn-danger').on('click', (function(_this) {
          return function() {
            return _this.model.set('toDelete', true);
          };
        })(this));
        if (this.model.get('shape') === 'Rect') {
          $('.dial').val(this.model.get('angle'));
          return $(".dial").knob({
            change: (function(_this) {
              return function(val) {
                return _this.model.set("angle", val);
              };
            })(this)
          });
        } else {
          return $('#knob').hide();
        }
      };

      return OptionView;

    })(Marionette.ItemView);
  });
});
