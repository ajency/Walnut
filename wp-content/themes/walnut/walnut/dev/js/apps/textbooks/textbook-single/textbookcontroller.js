var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/textbooks/textbook-single/single_views', 'apps/textbooks/textbook-single/chapters-list'], function(App, RegionController) {
  return App.module("TextbooksApp.Single", function(Single, App) {
    return Single.SingleTextbook = (function(_super) {
      __extends(SingleTextbook, _super);

      function SingleTextbook() {
        this._showChaptersView = __bind(this._showChaptersView, this);
        this._showTextBookSingle = __bind(this._showTextBookSingle, this);
        return SingleTextbook.__super__.constructor.apply(this, arguments);
      }

      SingleTextbook.prototype.initialize = function(opt) {
        var layout, term_id;
        term_id = opt.model_id;
        this.textbook = App.request("get:textbook:by:id", term_id);
        this.chapters = App.request("get:textbooks", {
          'parent': term_id
        });
        this.layout = layout = this._getTextbookSingleLayout();
        this.listenTo(layout, "show", this._showTextBookSingle, {
          loading: true
        });
        this.listenTo(layout, "show", this._showChaptersView);
        return this.show(layout);
      };

      SingleTextbook.prototype._showTextBookSingle = function() {
        var textbookDescView;
        textbookDescView = new Single.Views.TextbookDescriptionView({
          model: this.textbook
        });
        this.layout.textbookDescriptionRegion.show(textbookDescView);
        console.log('after region');
        return console.log(this.textbook);
      };

      SingleTextbook.prototype._getTextbookSingleLayout = function() {
        return new Single.Views.TextbookSingleLayout;
      };

      SingleTextbook.prototype._showChaptersView = function() {
        var chaptersListView;
        chaptersListView = new Single.Views.ChapterListView({
          collection: this.chapters
        });
        return this.layout.chaptersRegion.show(chaptersListView);
      };

      return SingleTextbook;

    })(RegionController);
  });
});
