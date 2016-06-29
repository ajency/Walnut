var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/textbooks/chapter-single/single_views', 'apps/textbooks/chapter-single/sections-list'], function(App, RegionController) {
  return App.module("TextbooksApp.Single", function(Single, App) {
    return Single.SingleChapter = (function(superClass) {
      extend(SingleChapter, superClass);

      function SingleChapter() {
        this._showSectionsView = bind(this._showSectionsView, this);
        this._showReloadChapterSingle = bind(this._showReloadChapterSingle, this);
        this._showChapterSingle = bind(this._showChapterSingle, this);
        return SingleChapter.__super__.constructor.apply(this, arguments);
      }

      SingleChapter.prototype.initialize = function(opt) {
        var term_id, textbook_id;
        textbook_id = opt.model_id;
        term_id = opt.chapter;
        window.base_textbook_id = textbook_id;
        this.base_textbook = App.request("get:textbook:by:id", textbook_id);
        return App.execute("when:fetched", this.base_textbook, (function(_this) {
          return function() {
            var layout;
            window.base_textbook_name = _this.base_textbook.get('name');
            window.base_classes_applicable = _this.base_textbook.get('classes_applicable');
            _this.textbook = App.request("get:textbook:by:id", term_id);
            _this.textbook.textbook_id = textbook_id;
            _this.chapters = App.request("get:chapters", {
              'parent': term_id,
              'term_type': 'sections'
            });
            _this.chapters.textbook_id = textbook_id;
            _this.chapters.parent = term_id;
            _this.chapters.isAdmin = isAdmin;
            _this.layout = layout = _this._getChaptersSingleLayout();
            _this.listenTo(layout, "show", _this._showChapterSingle);
            _this.listenTo(layout, "show", _this._showSectionsView(_this.chapters));
            _this.listenTo(Backbone, 'reload:collection', function(collection) {
              _this.chapters = App.request("get:chapters", {
                'parent': term_id,
                'term_type': 'chapter'
              });
              _this.textbook = App.request("get:textbook:by:id", term_id);
              App.execute("when:fetched", _this.textbook, function() {
                return _this._showReloadChapterSingle(_this.textbook);
              });
              return _this._showSectionsView(_this.chapters);
            });
            _this.listenTo(_this.layout, 'show:add:textbook:popup', function(collection1) {
              _this.collection = collection1;
              return App.execute('add:textbook:popup', {
                region: App.dialogRegion,
                collection: _this.collection
              });
            });
            return _this.show(layout);
          };
        })(this));
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

      SingleChapter.prototype._showReloadChapterSingle = function(textbook) {
        var breadcrumb_items, chapterDescView;
        this.textbook = textbook;
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
              'label': this.textbook.get('name'),
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        chapterDescView = new Single.Views.ChapterDescriptionView({
          model: this.textbook
        });
        return this.layout.chapterDescriptionRegion.show(chapterDescView);
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
