var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/textbooks/section-single/single_views', 'apps/textbooks/section-single/sub-list'], function(App, RegionController) {
  return App.module("TextbooksApp.Single", function(Single, App) {
    return Single.SingleSection = (function(superClass) {
      extend(SingleSection, superClass);

      function SingleSection() {
        this._showSubView = bind(this._showSubView, this);
        this._showSectionSingle = bind(this._showSectionSingle, this);
        return SingleSection.__super__.constructor.apply(this, arguments);
      }

      SingleSection.prototype.initialize = function(opt) {
        var chapter_id, layout, term_id, textbook_id;
        console.log(opt);
        textbook_id = opt.model_id;
        chapter_id = opt.chapter;
        term_id = opt.section;
        console.log(term_id);
        this.textbook = App.request("get:textbook:by:id", term_id);
        this.chapters = App.request("get:chapters", {
          'parent': term_id
        });
        this.chapters.textbook_id = textbook_id;
        this.chapters.chapter_id = chapter_id;
        this.chapters.parent = term_id;
        this.layout = layout = this._getSectionSingleLayout();
        this.listenTo(layout, "show", this._showSectionSingle);
        this.listenTo(layout, "show", this._showSubView);
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
