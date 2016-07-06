var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/textbooks/chapter-single/templates/sections-list.html', 'text!apps/textbooks/chapter-single/templates/section-list-item.html', 'text!apps/textbooks/chapter-single/templates/no-sections.html'], function(App, sectionslistTpl, listitemTpl, nosectionsTpl) {
  return App.module("TextbooksApp.Single.Views", function(Views, App) {
    var EmptyView, SectionListItemView;
    SectionListItemView = (function(superClass) {
      extend(SectionListItemView, superClass);

      function SectionListItemView() {
        return SectionListItemView.__super__.constructor.apply(this, arguments);
      }

      SectionListItemView.prototype.tagName = 'tr';

      SectionListItemView.prototype.className = 'gradeX odd';

      SectionListItemView.prototype.template = listitemTpl;

      SectionListItemView.prototype.serializeData = function() {
        var data;
        data = SectionListItemView.__super__.serializeData.call(this);
        data.textbook_id = Marionette.getOption(this, 'textbook_id');
        return data;
      };

      return SectionListItemView;

    })(Marionette.ItemView);
    EmptyView = (function(superClass) {
      extend(EmptyView, superClass);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.tagName = 'tr';

      EmptyView.prototype.template = nosectionsTpl;

      EmptyView.prototype.className = 'gradeX odd';

      return EmptyView;

    })(Marionette.ItemView);
    return Views.SectionListView = (function(superClass) {
      extend(SectionListView, superClass);

      function SectionListView() {
        return SectionListView.__super__.constructor.apply(this, arguments);
      }

      SectionListView.prototype.template = sectionslistTpl;

      SectionListView.prototype.className = 'grid simple ';

      SectionListView.prototype.itemView = SectionListItemView;

      SectionListView.prototype.emptyView = EmptyView;

      SectionListView.prototype.itemViewContainer = '#list-chapters';

      SectionListView.prototype.itemViewOptions = function() {
        return {
          textbook_id: base_textbook_id,
          base_textbook_name: base_textbook_name,
          base_class: base_classes_applicable
        };
      };

      SectionListView.prototype.onShow = function() {
        $('#example2').tablesorter();
        $('#example2').tablesorterPager({
          container: $("#pager")
        });
        return $("html, body").animate({
          scrollTop: 0
        }, 700);
      };

      return SectionListView;

    })(Marionette.CompositeView);
  });
});
