var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/textbooks/textbook-single/templates/chapters-list.html', 'text!apps/textbooks/textbook-single/templates/chapter-list-item.html', 'text!apps/textbooks/textbook-single/templates/no-chapters.html'], function(App, chapterslistTpl, listitemTpl, nochaptersTpl) {
  return App.module("TextbooksApp.Single.Views", function(Views, App) {
    var ChapterListItemView, EmptyView;
    ChapterListItemView = (function(superClass) {
      extend(ChapterListItemView, superClass);

      function ChapterListItemView() {
        return ChapterListItemView.__super__.constructor.apply(this, arguments);
      }

      ChapterListItemView.prototype.tagName = 'tr';

      ChapterListItemView.prototype.className = 'gradeX odd';

      ChapterListItemView.prototype.template = listitemTpl;

      return ChapterListItemView;

    })(Marionette.ItemView);
    EmptyView = (function(superClass) {
      extend(EmptyView, superClass);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.tagName = 'tr';

      EmptyView.prototype.template = nochaptersTpl;

      EmptyView.prototype.className = 'gradeX odd';

      return EmptyView;

    })(Marionette.ItemView);
    return Views.ChapterListView = (function(superClass) {
      extend(ChapterListView, superClass);

      function ChapterListView() {
        return ChapterListView.__super__.constructor.apply(this, arguments);
      }

      ChapterListView.prototype.template = chapterslistTpl;

      ChapterListView.prototype.className = 'grid simple ';

      ChapterListView.prototype.itemView = ChapterListItemView;

      ChapterListView.prototype.emptyView = EmptyView;

      ChapterListView.prototype.itemViewContainer = '#list-chapters';

      ChapterListView.prototype.onShow = function() {
        $('#example2').tablesorter();
        $('#example2').tablesorterPager({
          container: $("#pager")
        });
        $("html, body").animate({
          scrollTop: 0
        }, 700);
        console.log('collection');
        return console.log(this.collection);
      };

      return ChapterListView;

    })(Marionette.CompositeView);
  });
});
