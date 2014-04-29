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

      Layout.prototype.template = '<div class="page-title"> <h3><span class="semi-bold">Preview Question</span></h3> </div> <div class="preview"> <div class="" id="top-panel"></div> <div class="" id="content-board"></div> <div class="" id="bottom-panel"> <div> <div class="m-t-10  pull-right m-b-10 p-t-10 p-b-10"><button id="submit-answer-button" type="button" class="btn btn-primary"><i class="fa fa-check"></i> Submit</button></div> <div class="m-t-10 pull-right m-b-10 p-t-10 p-b-10 m-r-20"> <button id="skip-button" type="button" class="btn btn-danger"><i class="fa fa-forward"></i> Skip</button></div> <div class="clearfix"></div> </div> </div> </div>';

      Layout.prototype.regions = {
        contentBoardRegion: '#content-board',
        sidePanelRegion: '#side-panel',
        topPanelRegion: '#top-panel',
        bottomPanelRegion: '#bottom-panel'
      };

      Layout.prototype.ui = {
        skipButton: '#skip-button'
      };

      Layout.prototype.events = {
        'click @ui.skipButton': '_reloadPreview'
      };

      Layout.prototype._reloadPreview = function() {
        return App.execute("show:content:preview", {
          region: App.mainContentRegion
        });
      };

      return Layout;

    })(Marionette.Layout);
  });
});
