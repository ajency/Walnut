var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.HotspotElementPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.TextView = (function(_super) {
      __extends(TextView, _super);

      function TextView() {
        return TextView.__super__.constructor.apply(this, arguments);
      }

      TextView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> Hotspot <i class="fa fa-chevron-right"> </i> <span class="semi-bold"> Text Element </span> </div> <div class="docket-body"> <div class="form-group"> <textarea id="hotspot-textelement-text" class="textarea" placeholder="Enter Text here" > {{text}} </textarea> </div> <div class="form-group"> <select class="font" id="hotspot-textelement-fontfamily"> <option value="Arial"> Arial </option> <option value="Calibri"> Calibri </option> <option value="Comic Sans MS"> Comic Sans MS </option> <option value="Courier"> Courier </option> <option value="Georgia"> Georgia </option> <option value="Helvetica"> Helvetica </option> <option value="Impact"> Impact </option> <option value="Lucida Console"> Lucida Console </option> <option value="Lucida Sans Unicode"> Lucida Sans Unicode </option> <option value="Tahoma"> Tahoma </option> <option value="Times New Roman"> Times New Roman </option> <option value="Trebuchet MS"> Trebuchet MS </option> <option value="Verdana"> Verdana </option> </select> <div class="textFormat" data-toggle="buttons-checkbox"> <div id="font-style" class="btn-group"> <button id="bold-btn" class="btn"> <i class="fa fa-bold"> </i> </button> <button id="italic-btn" class="btn"> <i class="fa fa-italic"> </i> </button> </div> </div> </div> <div class=""> <div class="textProp slider success"> Size <input type="text" id="hotspot-textelement-fontsize" class="fontSize" data-slider-max="80" data-slider-step="1" data-slider-value="{{fontSize}}" data-slider-orientation="horizontal" data-slider-selection="before"> </div> </div> <div class="form-group inline"> Color <input type="hidden" id="hidden-input" class="fontColor" value="#1a45a1"> </div> <div class="form-group inline rotateCtrl"> Rotate <input type="text" class="dial" data-min="0" data-max="360" data-width="40" data-height="40" data-displayInput=false data-thickness=".7" data-fgColor="#0AA699" data-bgColor="#d1dade" data-angleOffset="90" data-cursor=true> </div> <div class="text-right"> <a id="delete" class="text-danger small" href="javascript:void(0)"><i class="fa fa-trash-o"></i> Delete</a> </div> </div> </div> </div>';

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
        $('#hotspot-textelement-fontfamily').select2({
          minimumResultsForSearch: -1
        });
        $('#hotspot-textelement-fontfamily').select2('val', self.model.get('fontFamily'));
        $('#hotspot-textelement-fontfamily').on('change', function(e) {
          this.options[0].disabled = true;
          return self.model.set('fontFamily', $(e.target).val());
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
        return $('#delete.text-danger').on('click', (function(_this) {
          return function() {
            return _this.model.set('toDelete', true);
          };
        })(this));
      };

      return TextView;

    })(Marionette.ItemView);
  });
});
