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
        this.chapters = App.request("get:chapters", {
          'parent': term_id
        });
        this.layout = layout = this._getTextbookSingleLayout();
        this.listenTo(layout, "show", this._showTextBookSingle);
        this.listenTo(layout, "show", this._showChaptersView);
        return this.show(layout);
      };

      SingleTextbook.prototype._showTextBookSingle = function() {
        return App.execute("when:fetched", this.textbook, (function(_this) {
          return function() {
            var textbookDescView;
            textbookDescView = new Single.Views.TextbookDescriptionView({
              model: _this.textbook
            });
            return _this.layout.textbookDescriptionRegion.show(textbookDescView);
          };
        })(this));
      };

      SingleTextbook.prototype._getTextbookSingleLayout = function() {
        return new Single.Views.TextbookSingleLayout;
      };

      SingleTextbook.prototype._showChaptersView = function() {
        return App.execute("when:fetched", this.chapters, (function(_this) {
          return function() {
            var chaptersListView;
            chaptersListView = new Single.Views.ChapterListView({
              collection: _this.chapters
            });
            return _this.layout.chaptersRegion.show(chaptersListView);
          };
        })(this));
      };

      return SingleTextbook;

    })(RegionController);
  });
});
