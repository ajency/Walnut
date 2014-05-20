var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/content-creator-controller', 'apps/content-creator/choose-content-type/choose-content-type-app'], function(App, RegionController) {
  return App.module("ContentCreator", function(ContentCreator, App, Backbone, Marionette, $, _) {
    var ContentCreatorRouter;
    ContentCreator.closequestionelementproperty = true;
    ContentCreator.closequestionelements = true;
    ContentCreator.closequestioneproperty = true;
    return ContentCreatorRouter = (function(_super) {
      var Controller;

      __extends(ContentCreatorRouter, _super);

      function ContentCreatorRouter() {
        return ContentCreatorRouter.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorRouter.prototype.appRoutes = {
        '': 'chooseContentType',
        'create-content/:contentType': 'showContentCreator'
      };

      Controller = {
        chooseContentType: function() {
          return new ContentCreator.Controller.ChooseContentType({
            region: App.mainContentRegion
          });
        },
        showContentCreator: function(contentType) {
          return new ContentCreator.Controller.ContentCreatorController({
            region: App.mainContentRegion,
            contentType: contentType
          });
        }
      };

      ContentCreator.on("start", function() {
        return new ContentCreatorRouter({
          controller: Controller
        });
      });

      return ContentCreatorRouter;

    })(Marionette.AppRouter);
  });
});
