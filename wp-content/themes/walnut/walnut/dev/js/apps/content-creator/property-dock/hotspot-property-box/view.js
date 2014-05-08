var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.HotspotPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> MCQ <i class="fa fa-chevron-right"></i> <span class="semi-bold">Hotspot Question Properties</span> </div> <div class="docket-body"> <div class="m-b-10"> Marks <input id="marks" type="text" value="{{marks}}" class="form-control" > </div> </div> </div> </div>';

      PropertyView.prototype.events = {
        'blur input#marks': '_changeMarks'
      };

      PropertyView.prototype.onShow = function() {
        return console.log('ss');
      };

      PropertyView.prototype._changeMarks = function(evt) {
        if (!isNaN($(evt.target).val())) {
          return this.model.set('marks', parseInt($(evt.target).val()));
        }
      };

      return PropertyView;

    })(Marionette.ItemView);
  });
});
