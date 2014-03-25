var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/textbooks/list/listcontroller'], function(App) {
  return App.module("TextbooksApp", function(TextbooksApp, App) {
    var Controller, TextbooksRouter;
    TextbooksRouter = (function(_super) {
      __extends(TextbooksRouter, _super);

      function TextbooksRouter() {
        return TextbooksRouter.__super__.constructor.apply(this, arguments);
      }

      TextbooksRouter.prototype.appRoutes = {
        'textbooks': 'showTextbooks'
      };

      return TextbooksRouter;

    })(Marionette.AppRouter);
    Controller = {
      showTextbooks: function() {
        return new TextbooksApp.List.ListController({
          region: App.mainContentRegion
        });
      }
    };
    return TextbooksApp.on("start", function() {
      return new TextbooksRouter({
        controller: Controller
      });
    });
  });
});
