var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/content-builder/view', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements-loader'], function(App, RegionController) {
  return App.module("ContentCreator.ContentBuilder", function(ContentBuilder, App, Backbone, Marionette, $, _) {
    var API, ContentBuilderController;
    ContentBuilderController = (function(_super) {
      __extends(ContentBuilderController, _super);

      function ContentBuilderController() {
        return ContentBuilderController.__super__.constructor.apply(this, arguments);
      }

      ContentBuilderController.prototype.initialize = function(options) {
        this.view = this._getContentBuilderView();
        this.listenTo(this.view, "add:new:element", function(container, type) {
          return App.request("add:new:element", container, type);
        });
        return this.show(this.view);
      };

      ContentBuilderController.prototype._getContentBuilderView = function() {
        return new ContentBuilder.Views.ContentBuilderView;
      };

      return ContentBuilderController;

    })(RegionController);
    API = {
      addNewElement: function(container, type, modelData) {
        return new ContentBuilder.Element[type].Controller({
          container: container,
          modelData: modelData
        });
      }
    };
    App.commands.setHandler("show:content:builder", function(options) {
      return new ContentBuilderController({
        region: options.region
      });
    });
    return App.reqres.setHandler("add:new:element", function(container, type, modelData) {
      if (modelData == null) {
        modelData = {};
      }
      return API.addNewElement(container, type, modelData);
    });
  });
});
