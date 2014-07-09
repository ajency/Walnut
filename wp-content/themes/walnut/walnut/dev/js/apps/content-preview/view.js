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

      Layout.prototype.template = '<div class="preview"> <div class="" id="top-panel"></div> <div class="container-grey m-b-5  qstnInfo "> <label class="form-label bold small-text muted no-margin inline">Question Info: </label> <span class="small-text" style="text-transform: capitalize">{{instructions}}</span> </div> <div class="" id="content-board"></div> {{#content_preview}} <input type="button" class="btn btn-info btn-cons2 h-center block" id="submit-answer-button" value="submit"> {{/content_preview}} <div class="clearfix"></div> </div>';

      Layout.prototype.regions = {
        contentBoardRegion: '#content-board',
        topPanelRegion: '#top-panel'
      };

      Layout.prototype.mixinTemplateHelpers = function(data) {
        data = Layout.__super__.mixinTemplateHelpers.call(this, data);
        data.content_preview = Marionette.getOption(this, 'content_preview');
        return data;
      };

      return Layout;

    })(Marionette.Layout);
  });
});
