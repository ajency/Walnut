var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.HotspotElementPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.TextView = (function(_super) {
      __extends(TextView, _super);

      function TextView() {
        return TextView.__super__.constructor.apply(this, arguments);
      }

      TextView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> Hotspot <i class="fa fa-chevron-right"> </i> <span class="semi-bold"> Text Element </span> </div> <div class="docket-body"> <div class="form-group"> <textarea id="hotspot-textelement-text" class="textarea" placeholder="Enter Text here" > {{text}} </textarea> </div> <div class="form-group"> <select class="font" id="hotspot-textelement-fontfamily"> <option value="1"> Arial </option> <option value="2"> Calibri </option> <option value="3"> Comic Sans MS </option> <option value="4"> Courier </option> <option value="5"> Georgia </option> <option value="6"> Helvetica </option> <option value="7"> Impact </option> <option value="8"> Lucida Console </option> <option value="9"> Lucida Sans Unicode </option> <option value="10"> Tahoma </option> <option value="11"> Times New Roman </option> <option value="12"> Trebuchet MS </option> <option value="13"> Verdana </option> </select> <div class="textFormat" data-toggle="buttons-checkbox"> <div id="font-style" class="btn-group"> <button id="bold-btn" class="btn"> <i class="fa fa-bold"> </i> </button> <button id="italic-btn" class="btn"> <i class="fa fa-italic"> </i> </button> </div> </div> </div> <div class=""> <div class="textProp slider success"> Size <input type="text" id="hotspot-textelement-fontsize" class="fontSize" data-slider-max="80" data-slider-step="1" data-slider-value="{{fontSize}}" data-slider-orientation="horizontal" data-slider-selection="before"> </div> </div> <div class="form-group inline"> Color <input type="hidden" id="hidden-input" class="fontColor" value="#1a45a1"> </div> <div class="form-group inline rotateCtrl"> Rotate <input type="text" class="dial" data-min="0" data-max="360" data-width="40" data-height="40" data-displayInput=false data-thickness=".7" data-fgColor="#0AA699" data-bgColor="#d1dade" data-angleOffset="90" data-cursor=true> </div> <div class="text-right"> <a id="delete" class="text-danger small" href="javascript:void(0)"><i class="fa fa-trash-o"></i> Delete</a> </div> </div> </div> </div>';

      TextView.prototype.onShow = function() {
        var self;
        self = this;
        $('.fontSize').slider();
        $('#hotspot-textelement-fontsize').slider().on('slide', (function(_this) {
          return function() {
            var size;
            size = _this.model.get('fontSize');
            return _this.model.set('fontSize', $('.fontSize').slider('getValue').val() || size);
          };
        })(this));
        $('.dial').val(self.model.get('textAngle'));
        $(".dial").knob({
          change: function(val) {
            return self.model.set("textAngle", val);
          }
        });
        $('.fontColor').minicolors({
          animationSpeed: 200,
          animationEasing: 'swing',
          control: 'hue',
          position: 'top left',
          showSpeed: 200,
          change: function(hex, opacity) {
            return self.model.set('fontColor', hex);
          }
        });
        $('.fontColor').minicolors('value', self.model.get('fontColor'));
        $('#hotspot-textelement-fontfamily').children('option').each(function() {
          if ($(this).text() === self.model.get('fontFamily')) {
            return this.selected = true;
          }
        });
        $('#hotspot-textelement-fontfamily').on('change', function() {
          this.options[0].disabled = true;
          return self.model.set('fontFamily', $('#hotspot-textelement-fontfamily  option:selected').text());
        });
        $('#hotspot-textelement-text').on('input', (function(_this) {
          return function() {
            return _this.model.set("text", $('#hotspot-textelement-text').val());
          };
        })(this));
        if (this.model.get('fontBold') === 'bold') {
          $('#font-style.btn-group #bold-btn.btn').addClass('active');
        }
        if (this.model.get('fontItalics') === 'italic') {
          $('#font-style.btn-group #italic-btn.btn').addClass('active');
        }
        $('#font-style.btn-group .btn').on('click', function() {
          return setTimeout(function() {
            console.log("timeout");
            if ($('#font-style.btn-group #bold-btn.btn').hasClass('active')) {
              self.model.set('fontBold', "bold");
            } else {
              self.model.set('fontBold', "");
            }
            if ($('#font-style.btn-group #italic-btn.btn').hasClass('active')) {
              return self.model.set('fontItalics', "italic");
            } else {
              return self.model.set('fontItalics', "");
            }
          }, 200);
        });
        return $('#delete.btn-danger').on('click', (function(_this) {
          return function() {
            return _this.model.set('toDelete', true);
          };
        })(this));
      };

      return TextView;

    })(Marionette.ItemView);
  });
});
