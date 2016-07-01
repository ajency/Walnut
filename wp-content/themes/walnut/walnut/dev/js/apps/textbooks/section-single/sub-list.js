var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/textbooks/section-single/templates/sub-list.html', 'text!apps/textbooks/section-single/templates/sub-list-item.html', 'text!apps/textbooks/section-single/templates/no-sub.html'], function(App, sublistTpl, listitemTpl, nosubTpl) {
  return App.module("TextbooksApp.Single.Views", function(Views, App) {
    var EmptyView, SubListItemView;
    SubListItemView = (function(superClass) {
      extend(SubListItemView, superClass);

      function SubListItemView() {
        return SubListItemView.__super__.constructor.apply(this, arguments);
      }

      SubListItemView.prototype.tagName = 'tr';

      SubListItemView.prototype.className = 'gradeX odd';

      SubListItemView.prototype.template = listitemTpl;

      return SubListItemView;

    })(Marionette.ItemView);
    EmptyView = (function(superClass) {
      extend(EmptyView, superClass);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.tagName = 'tr';

      EmptyView.prototype.template = nosubTpl;

      EmptyView.prototype.className = 'gradeX odd';

      return EmptyView;

    })(Marionette.ItemView);
    return Views.SubListView = (function(superClass) {
      extend(SubListView, superClass);

      function SubListView() {
        return SubListView.__super__.constructor.apply(this, arguments);
      }

      SubListView.prototype.template = sublistTpl;

      SubListView.prototype.className = 'grid simple ';

      SubListView.prototype.itemView = SubListItemView;

      SubListView.prototype.emptyView = EmptyView;

      SubListView.prototype.itemViewContainer = '#list-chapters';

      SubListView.prototype.onShow = function() {
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

      return SubListView;

    })(Marionette.CompositeView);
  });
});
