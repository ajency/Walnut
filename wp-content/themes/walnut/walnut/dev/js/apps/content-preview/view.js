var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentPreview.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.className = '';

      Layout.prototype.template = '<div class="page-title"> <h3><span class="semi-bold">Preview Question</span></h3> </div> <div class="preview"> <div class="" id="content-board"></div> <div class="" id="side-panel"></div> </div>';

      Layout.prototype.regions = {
        contentBoardRegion: '#content-board',
        sidePanelRegion: '#side-panel'
      };

      return Layout;

    })(Marionette.Layout);
  });
});
