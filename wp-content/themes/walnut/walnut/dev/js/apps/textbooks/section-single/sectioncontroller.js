var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/textbooks/section-single/single_views', 'apps/textbooks/section-single/sub-list'], function(App, RegionController) {
  return App.module("TextbooksApp.Single", function(Single, App) {
    return Single.SingleSection = (function(superClass) {
      extend(SingleSection, superClass);

      function SingleSection() {
        this._showSubView = bind(this._showSubView, this);
        this._showReloadSectionSingle = bind(this._showReloadSectionSingle, this);
        this._showSectionSingle = bind(this._showSectionSingle, this);
        return SingleSection.__super__.constructor.apply(this, arguments);
      }

      SingleSection.prototype.initialize = function(opt) {
        var chapter_id, term_id, textbook_id;
        console.log(opt);
        textbook_id = opt.model_id;
        chapter_id = opt.chapter;
        term_id = opt.section;
        window.base_textbook_id = textbook_id;
        window.base_chapter_id = chapter_id;
        console.log(term_id);
        this.textbook = App.request("get:textbook:by:id", term_id);
        this.base_textbook = App.request("get:textbook:by:id", textbook_id);
        return App.execute("when:fetched", this.base_textbook, (function(_this) {
          return function() {
            window.base_textbook_name = _this.base_textbook.get('name');
            window.base_classes_applicable = _this.base_textbook.get('classes_applicable');
            _this.base_chapter = App.request("get:textbook:by:id", chapter_id);
            return App.execute("when:fetched", _this.base_chapter, function() {
              var layout;
              console.log('chapter window data');
              console.log(_this.base_chapter);
              window.base_chapter_name = _this.base_chapter.get('name');
              _this.chapters = App.request("get:chapters", {
                'parent': term_id,
                'term_type': 'subsections'
              });
              _this.chapters.textbook_id = textbook_id;
              _this.chapters.chapter_id = chapter_id;
              _this.chapters.parent = term_id;
              _this.chapters.isAdmin = localStorage.getItem('isAdmin');
              _this.layout = layout = _this._getSectionSingleLayout();
              _this.listenTo(layout, "show", _this._showSectionSingle);
              _this.listenTo(layout, "show", _this._showSubView);
              _this.listenTo(Backbone, 'reload:collection', function(collection) {
                _this.chapters = App.request("get:chapters", {
                  'parent': term_id,
                  'term_type': 'chapter'
                });
                _this.textbook = App.request("get:textbook:by:id", term_id);
                App.execute("when:fetched", _this.textbook, function() {
                  return _this._showReloadSectionSingle(_this.textbook);
                });
                return _this._showSubView(_this.chapters);
              });
              _this.listenTo(_this.layout, 'show:add:textbook:popup', function(collection1) {
                _this.collection = collection1;
                return App.execute('add:textbook:popup', {
                  region: App.dialogRegion,
                  collection: _this.collection
                });
              });
              return _this.show(layout);
            });
          };
        })(this));
      };

      SingleSection.prototype._showSectionSingle = function() {
        return App.execute("when:fetched", this.textbook, (function(_this) {
          return function() {
            var breadcrumb_items, sectionDescView;
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
            sectionDescView = new Single.Views.SectionDescriptionView({
              model: _this.textbook
            });
            return _this.layout.sectionDescriptionRegion.show(sectionDescView);
          };
        })(this));
      };

      SingleSection.prototype._showReloadSectionSingle = function(textbook) {
        var breadcrumb_items, sectionDescView;
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
        sectionDescView = new Single.Views.SectionDescriptionView({
          model: this.textbook
        });
        return this.layout.sectionDescriptionRegion.show(sectionDescView);
      };

      SingleSection.prototype._getSectionSingleLayout = function() {
        return new Single.Views.SectionSingleLayout({
          collection: this.chapters
        });
      };

      SingleSection.prototype._showSubView = function() {
        return App.execute("when:fetched", this.chapters, (function(_this) {
          return function() {
            var subListView;
            subListView = new Single.Views.SubListView({
              collection: _this.chapters
            });
            return _this.layout.sectionRegion.show(subListView);
          };
        })(this));
      };

      return SingleSection;

    })(RegionController);
  });
});
