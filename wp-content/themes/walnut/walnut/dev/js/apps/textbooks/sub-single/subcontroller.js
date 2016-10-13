var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/textbooks/sub-single/single_views', 'apps/textbooks/sub-single/list'], function(App, RegionController) {
  return App.module("TextbooksApp.Single", function(Single, App) {
    return Single.SingleSub = (function(superClass) {
      extend(SingleSub, superClass);

      function SingleSub() {
        this._showSubSubView = bind(this._showSubSubView, this);
        this._showSubSingle = bind(this._showSubSingle, this);
        return SingleSub.__super__.constructor.apply(this, arguments);
      }

      SingleSub.prototype.initialize = function(opt) {
        var chapter_id, layout, section_id, term_id, textbook_id;
        console.log(opt);
        textbook_id = opt.model_id;
        chapter_id = opt.chapter;
        section_id = opt.section;
        term_id = opt.sub;
        console.log(term_id);
        this.textbook = App.request("get:textbook:by:id", term_id);
        this.chapters = App.request("get:chapters", {
          'parent': term_id,
          'to_fetch': 'chapters'
        });
        this.layout = layout = this._getSubSingleLayout();
        this.listenTo(layout, "show", this._showSubSingle);
        this.listenTo(layout, "show", this._showSubSubView);
        return this.show(layout);
      };

      SingleSub.prototype._showSubSingle = function() {
        return App.execute("when:fetched", this.textbook, (function(_this) {
          return function() {
            var breadcrumb_items, subDescView;
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
            subDescView = new Single.Views.SubDescriptionView({
              model: _this.textbook
            });
            return _this.layout.subDescriptionRegion.show(subDescView);
          };
        })(this));
      };

      SingleSub.prototype._getSubSingleLayout = function() {
        return new Single.Views.SubSingleLayout;
      };

      SingleSub.prototype._showSubSubView = function() {
        return App.execute("when:fetched", this.chapters, (function(_this) {
          return function() {
            var subsubListView;
            subsubListView = new Single.Views.SubListView({
              collection: _this.chapters
            });
            return _this.layout.subRegion.show(subsubListView);
          };
        })(this));
      };

      return SingleSub;

    })(RegionController);
  });
});
