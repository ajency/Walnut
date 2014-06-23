var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-pieces/list-content-pieces/templates/content-pieces-list-tpl.html'], function(App, contentListTpl, listitemTpl, notextbooksTpl) {
  return App.module("ContentPiecesApp.ContentList.Views", function(Views, App) {
    var EmptyView, ListItemView;
    ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td>{{&post_excerpt}}</td> <td>{{post_author_name}}</td> <td>{{modified_date}}</td> <td class="text-center"><a target="_blank" href="{{view_url}}">View</a> <span class="nonDevice">|</span> <a target="_blank" href="{{edit_url}}" class="nonDevice">Edit</a></td>';

      ListItemView.prototype.serializeData = function() {
        var data;
        data = ListItemView.__super__.serializeData.call(this);
        data.modified_date = moment(this.model.get('post_modified')).format("Do MMM YYYY");
        data.view_url = SITEURL + '/#content-piece/' + this.model.get('ID');
        data.edit_url = SITEURL + '/content-creator/#edit-content/' + this.model.get('ID');
        return data;
      };

      return ListItemView;

    })(Marionette.ItemView);
    EmptyView = (function(_super) {
      __extends(EmptyView, _super);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = 'No Content Available';

      EmptyView.prototype.tagName = 'td';

      EmptyView.prototype.onShow = function() {
        return this.$el.attr('colspan', 3);
      };

      return EmptyView;

    })(Marionette.ItemView);
    return Views.ListView = (function(_super) {
      __extends(ListView, _super);

      function ListView() {
        return ListView.__super__.constructor.apply(this, arguments);
      }

      ListView.prototype.template = contentListTpl;

      ListView.prototype.className = 'tiles white grid simple vertical green';

      ListView.prototype.itemView = ListItemView;

      ListView.prototype.emptyView = EmptyView;

      ListView.prototype.itemViewContainer = '#list-content-pieces';

      ListView.prototype.events = {
        'change .filters': function(e) {
          return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
        }
      };

      ListView.prototype.onShow = function() {
        var pagerOptions, textbookFiltersHTML;
        this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        this.fullCollection = Marionette.getOption(this, 'fullCollection');
        textbookFiltersHTML = $.showTextbookFilters(this.textbooksCollection);
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        $("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter").select2();
        $('#content-pieces-table').tablesorter();
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#content-pieces-table').tablesorterPager(pagerOptions);
      };

      ListView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType) {
        var filtered_data, pagerOptions;
        switch (filterType) {
          case 'textbooks-filter':
            $.populateChapters(filteredCollection, this.$el);
            break;
          case 'chapters-filter':
            $.populateSections(filteredCollection, this.$el);
            break;
          case 'sections-filter':
            $.populateSubSections(filteredCollection, this.$el);
        }
        filtered_data = $.filterTableByTextbooks(this);
        this.collection.set(filtered_data);
        $("#content-pieces-table").trigger("updateCache");
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#content-pieces-table').tablesorterPager(pagerOptions);
      };

      return ListView;

    })(Marionette.CompositeView);
  });
});
