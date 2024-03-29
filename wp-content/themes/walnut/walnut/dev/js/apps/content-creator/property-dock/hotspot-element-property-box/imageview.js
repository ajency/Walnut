var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.HotspotElementPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.ImageView = (function(superClass) {
      extend(ImageView, superClass);

      function ImageView() {
        return ImageView.__super__.constructor.apply(this, arguments);
      }

      ImageView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles blue"> <div class="tile-footer drag"> Hotspot <i class="fa fa-chevron-right"></i> <span class="semi-bold">Image Element</span> </div> <div class="docket-body"> <div id="knob" class="form-group"> Rotate <input type="text" class="dial" data-min="0" data-max="360" data-width="40" data-height="40" data-displayInput=false data-thickness=".5" data-fgColor="#0AA699" data-angleOffset="90" data-cursor=true> </div> <div class="form-group"> <button type="button" id="delete" class="btn btn-danger btn-small">Delete</button> </div> </div> </div> </div>';

      ImageView.prototype.onShow = function() {
        $('.dial').val(this.model.get('angle'));
        $(".dial").knob({
          change: (function(_this) {
            return function(val) {
              return _this.model.set("angle", val);
            };
          })(this)
        });
        return $('#delete.btn-danger').on('click', (function(_this) {
          return function() {
            return _this.model.set('toDelete', true);
          };
        })(this));
      };

      return ImageView;

    })(Marionette.ItemView);
  });
});
