var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/textbooks/list/listcontroller', 'apps/textbooks/textbook-single/textbookcontroller', 'apps/textbooks/textadd-popup/add-textbook-app', 'apps/textbooks/chapter-single/chaptercontroller', 'apps/textbooks/section-single/sectioncontroller', 'apps/textbooks/sub-single/subcontroller'], function(App) {
  return App.module("TextbooksApp", function(TextbooksApp, App) {
    var Controller, TextbooksRouter;
    TextbooksRouter = (function(superClass) {
      extend(TextbooksRouter, superClass);

      function TextbooksRouter() {
        return TextbooksRouter.__super__.constructor.apply(this, arguments);
      }

      TextbooksRouter.prototype.appRoutes = {
        'textbooks': 'showTextbooks',
        'textbook/:term_id': 'showSingleTextbook',
        'textbook/:term_id/chapter/:chap_id': 'showSingleChapter',
        'textbook/:term_id/chapter/:chap_id/section/:sect': 'showSingleSection',
        'textbook/:term_id/chapter/:chap_id/section/:sect/sub/:sub': 'showSingleSub'
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
      },
      showSingleChapter: function(term_id, chap_id) {
        if ($.allowRoute('textbooks')) {
          return new TextbooksApp.Single.SingleChapter({
            region: App.mainContentRegion,
            model_id: term_id,
            chapter: chap_id,
            term: 'chapter'
          });
        }
      },
      showSingleSection: function(term_id, chap_id, sect) {
        if ($.allowRoute('textbooks')) {
          return new TextbooksApp.Single.SingleSection({
            region: App.mainContentRegion,
            model_id: term_id,
            chapter: chap_id,
            section: sect,
            term: 'section'
          });
        }
      },
      showSingleSub: function(term_id, chap_id, sect, sub) {
        if ($.allowRoute('textbooks')) {
          return new TextbooksApp.Single.SingleSub({
            region: App.mainContentRegion,
            model_id: term_id,
            chapter: chap_id,
            section: sect,
            sub: sub,
            term: 'sub'
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
