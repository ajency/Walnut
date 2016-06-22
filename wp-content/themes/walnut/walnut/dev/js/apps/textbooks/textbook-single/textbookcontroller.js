var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/textbooks/textbook-single/single_views', 'apps/textbooks/textbook-single/chapters-list'], function(App, RegionController) {
  return App.module("TextbooksApp.Single", function(Single, App) {
    return Single.SingleTextbook = (function(superClass) {
      extend(SingleTextbook, superClass);

      function SingleTextbook() {
        this._showChaptersView = bind(this._showChaptersView, this);
        this._showTextBookSingle = bind(this._showTextBookSingle, this);
        return SingleTextbook.__super__.constructor.apply(this, arguments);
      }

      SingleTextbook.prototype.initialize = function(opt) {
        var layout, term_id;
        console.log(opt);
        term_id = opt.model_id;
        this.textbook = App.request("get:textbook:by:id", term_id);
        this.chapters = App.request("get:chapters", {
          'parent': term_id
        });
        this.chapters.parent = term_id;
        this.layout = layout = this._getTextbookSingleLayout();
        this.listenTo(layout, "show", this._showTextBookSingle);
        this.listenTo(layout, "show", this._showChaptersView);
        this.listenTo(this.layout, 'show:add:textbook:popup', (function(_this) {
          return function(collection) {
            _this.collection = collection;
            return App.execute('add:textbook:popup', {
              region: App.dialogRegion,
              collection: _this.collection
            });
          };
        })(this));
        return this.show(layout);
      };

      SingleTextbook.prototype._showTextBookSingle = function() {
        return App.execute("when:fetched", this.textbook, (function(_this) {
          return function() {
            var breadcrumb_items, textbookDescView;
            breadcrumb_items = {
              'items': [
                {
                  'label': 'Dashboard',
                  'link': 'javascript://'
                }, {
                  'label': 'Content Management',
                  'link': 'javascript:;'
                }, {
                  'label': 'Textbooks',
                  'link': '#textbooks'
                }, {
                  'label': _this.textbook.get('name'),
                  'link': 'javascript:;',
                  'active': 'active'
                }
              ]
            };
            App.execute("update:breadcrumb:model", breadcrumb_items);
            textbookDescView = new Single.Views.TextbookDescriptionView({
              model: _this.textbook
            });
            return _this.layout.textbookDescriptionRegion.show(textbookDescView);
          };
        })(this));
      };

      SingleTextbook.prototype._getTextbookSingleLayout = function() {
        return new Single.Views.TextbookSingleLayout({
          collection: this.chapters
        });
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
