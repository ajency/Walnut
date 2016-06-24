var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/textbooks/chapter-single/single_views', 'apps/textbooks/chapter-single/sections-list'], function(App, RegionController) {
  return App.module("TextbooksApp.Single", function(Single, App) {
    return Single.SingleChapter = (function(superClass) {
      extend(SingleChapter, superClass);

      function SingleChapter() {
        this._showSectionsView = bind(this._showSectionsView, this);
        this._showChapterSingle = bind(this._showChapterSingle, this);
        return SingleChapter.__super__.constructor.apply(this, arguments);
      }

      SingleChapter.prototype.initialize = function(opt) {
        var layout, term_id, textbook_id;
        console.log(opt);
        textbook_id = opt.model_id;
        console.log(textbook_id);
        term_id = opt.chapter;
        console.log(term_id);
        this.textbook_name = App.request("get:textbook:name:by:id", textbook_id);
        console.log(this.textbook_name);
        this.textbook = App.request("get:textbook:by:id", term_id);
        this.textbook.textbook_id = textbook_id;
        this.chapters = App.request("get:chapters", {
          'parent': term_id,
          'term_type': 'sections'
        });
        this.chapters.textbook_id = textbook_id;
        this.chapters.parent = term_id;
        console.log(this.chapters);
        this.layout = layout = this._getChaptersSingleLayout();
        this.listenTo(layout, "show", this._showChapterSingle);
        this.listenTo(layout, "show", this._showSectionsView(this.chapters));
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

      SingleChapter.prototype._showChapterSingle = function() {
        return App.execute("when:fetched", this.textbook, (function(_this) {
          return function() {
            var breadcrumb_items, chapterDescView;
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
            chapterDescView = new Single.Views.ChapterDescriptionView({
              model: _this.textbook
            });
            return _this.layout.chapterDescriptionRegion.show(chapterDescView);
          };
        })(this));
      };

      SingleChapter.prototype._getChaptersSingleLayout = function() {
        return new Single.Views.ChapterSingleLayout({
          collection: this.chapters
        });
      };

      SingleChapter.prototype._showSectionsView = function() {
        return App.execute("when:fetched", this.chapters, (function(_this) {
          return function() {
            var sectionsListView;
            console.log(_this.chapters);
            sectionsListView = new Single.Views.SectionListView({
              collection: _this.chapters
            });
            return _this.layout.chaptersRegion.show(sectionsListView);
          };
        })(this));
      };

      return SingleChapter;

    })(RegionController);
  });
});
