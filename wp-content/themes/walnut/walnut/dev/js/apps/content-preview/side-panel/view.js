var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentPreview.SidePanel.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.SidePanelView = (function(_super) {
      __extends(SidePanelView, _super);

      function SidePanelView() {
        return SidePanelView.__super__.constructor.apply(this, arguments);
      }

      SidePanelView.prototype.template = '<div id="Result">Result : </div>';

      return SidePanelView;

    })(Marionette.ItemView);
  });
});
