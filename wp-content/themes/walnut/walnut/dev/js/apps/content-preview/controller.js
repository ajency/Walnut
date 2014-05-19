var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/view', 'apps/content-preview/content-board/controller', 'apps/content-preview/top-panel/controller'], function(App, RegionController) {
  return App.module("ContentPreview", function(ContentPreview, App, Backbone, Marionette, $, _) {
    ContentPreview.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.model = options.model, this.questionResponseModel = options.questionResponseModel, this.timerObject = options.timerObject, this.display_mode = options.display_mode, this.classID = options.classID;
        this.layout = this._getContentPreviewLayout();
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            App.execute("show:top:panel", {
              region: _this.layout.topPanelRegion,
              model: _this.model,
              textbookNames: _this.textbookNames,
              questionResponseModel: _this.questionResponseModel,
              timerObject: _this.timerObject,
              display_mode: _this.display_mode,
              classID: _this.classID
            });
            return App.execute("show:content:board", {
              region: _this.layout.contentBoardRegion,
              model: _this.model
            });
          };
        })(this));
        return this.show(this.layout, {
          loading: true
        });
      };

      Controller.prototype._getContentPreviewLayout = function() {
        return new ContentPreview.Views.Layout;
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:content:preview", function(options) {
      return new ContentPreview.Controller(options);
    });
  });
});
