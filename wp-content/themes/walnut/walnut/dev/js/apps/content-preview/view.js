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

      Layout.prototype.template = '<div class="preview"> <div class="" id="top-panel"></div> <div class="" id="content-board"></div> <div class="tiles grey text-grey b-grey b-b m-t-20"> <div class="grid simple m-b-0 transparent"> <div class="grid-title no-border qstnInfo"> <p class="bold small-text inline text-grey"><i class="fa fa-question"></i> Question Info </p> <div class="tools"> <a href="javascript:;" class="arrow expand"></a> </div> </div> <div class="qstnInfoBod no-border m-t-10 p-b-5 p-r-20 p-l-20"> <p class="">{{instructions}}</p> </div> </div> </div> </div>';

      Layout.prototype.regions = {
        contentBoardRegion: '#content-board',
        topPanelRegion: '#top-panel'
      };

      return Layout;

    })(Marionette.Layout);
  });
});
