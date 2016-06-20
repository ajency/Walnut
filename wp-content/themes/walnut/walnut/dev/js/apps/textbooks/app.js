var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/textbooks/list/listcontroller', 'apps/textbooks/textbook-single/textbookcontroller', 'apps/textbooks/textadd-popup/add-textbook-app'], function(App) {
  return App.module("TextbooksApp", function(TextbooksApp, App) {
    var Controller, TextbooksRouter;
    TextbooksRouter = (function(superClass) {
      extend(TextbooksRouter, superClass);

      function TextbooksRouter() {
        return TextbooksRouter.__super__.constructor.apply(this, arguments);
      }

      TextbooksRouter.prototype.appRoutes = {
        'textbooks': 'showTextbooks',
        'textbook/:term_id': 'showSingleTextbook'
      };

      return TextbooksRouter;

    })(Marionette.AppRouter);
    Controller = {
      showTextbooks: function() {
        if ($.allowRoute('textbooks')) {
          return new TextbooksApp.List.ListController({
            region: App.mainContentRegion
          });
        }
      },
      showSingleTextbook: function(term_id) {
        if ($.allowRoute('textbooks')) {
          return new TextbooksApp.Single.SingleTextbook({
            region: App.mainContentRegion,
            model_id: term_id
          });
        }
      }
    };
    return TextbooksApp.on("start", function() {
      return new TextbooksRouter({
        controller: Controller
      });
    });
  });
});
