var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/textbook-single/controller'], function(App) {
  return App.module("TextbookSingleApp", function(TextbookSingleApp, App) {
    var Controller, TextbookSingleRouter;
    TextbookSingleRouter = (function(_super) {
      __extends(TextbookSingleRouter, _super);

      function TextbookSingleRouter() {
        return TextbookSingleRouter.__super__.constructor.apply(this, arguments);
      }

      TextbookSingleRouter.prototype.appRoutes = {
        'testSingleTestbook': 'showSingleTextbook'
      };

      return TextbookSingleRouter;

    })(Marionette.AppRouter);
    Controller = {
      showSingleTextbook: function() {
        return new TextbookSingleApp.Controller.SingleTextbook({
          region: App.mainContentRegion
        });
      }
    };
    return TextbookSingleApp.on("start", function() {
      return new TextbookSingleRouter({
        controller: Controller
      });
    });
  });
});
