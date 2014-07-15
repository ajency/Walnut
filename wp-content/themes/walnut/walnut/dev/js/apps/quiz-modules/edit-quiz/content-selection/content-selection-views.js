var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/quiz-modules/edit-quiz/content-selection/templates/content-selection.html'], function(App, contentSelectionTmpl) {
  return App.module('QuizModuleApp.EditQuiz.ContentSelection.Views', function(Views, App) {
    var DataContentItemView, NoDataItemView;
    NoDataItemView = (function(_super) {
      __extends(NoDataItemView, _super);

      function NoDataItemView() {
        return NoDataItemView.__super__.constructor.apply(this, arguments);
      }

      NoDataItemView.prototype.template = 'No Content Available';

      NoDataItemView.prototype.tagName = 'td';

      NoDataItemView.prototype.onShow = function() {
        return this.$el.attr('colspan', 4);
      };

      return NoDataItemView;

    })(Marionette.ItemView);
    DataContentItemView = (function(_super) {
      __extends(DataContentItemView, _super);

      function DataContentItemView() {
        return DataContentItemView.__super__.constructor.apply(this, arguments);
      }

      DataContentItemView.prototype.template = '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{ID}}" id="checkbox{{ID}}"> <label for="checkbox{{ID}}"></label> </div> </td> <td>{{post_excerpt}}</td> <td>{{post_author_name}}</td> <td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td>';

      DataContentItemView.prototype.tagName = 'tr';

      DataContentItemView.prototype.serializeData = function() {
        var data;
        data = DataContentItemView.__super__.serializeData.call(this);
        data.modified_date = moment(data.post_modified).format("Do MMM YYYY");
        data.sort_date = moment(data.post_modified).format("YYYYMMDD");
        return data;
      };

      return DataContentItemView;

    })(Marionette.ItemView);
    return Views.DataContentTableView = (function(_super) {
      __extends(DataContentTableView, _super);

      function DataContentTableView() {
        return DataContentTableView.__super__.constructor.apply(this, arguments);
      }

      DataContentTableView.prototype.template = contentSelectionTmpl;

      DataContentTableView.prototype.className = 'tiles grey grid simple vertical blue animated slideInRight';

      DataContentTableView.prototype.emptyView = NoDataItemView;

      DataContentTableView.prototype.itemView = DataContentItemView;

      DataContentTableView.prototype.itemViewContainer = '#dataContentTable tbody';

      DataContentTableView.prototype.events = {
        'change .filters': function(e) {
          console.log('change');
          return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
        }
      };

      DataContentTableView.prototype.onShow = function() {
        var pagerOptions, textbookFiltersHTML;
        this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        this.fullCollection = Marionette.getOption(this, 'fullCollection');
        textbookFiltersHTML = $.showTextbookFilters({
          textbooks: this.textbooksCollection
        });
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        this.$el.find("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter").select2();
        this.$el.find('#dataContentTable').tablesorter();
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find('#dataContentTable').tablesorterPager(pagerOptions);
      };

      DataContentTableView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType) {
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
        this.$el.find("#dataContentTable").trigger("updateCache");
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find('#dataContentTable').tablesorterPager(pagerOptions);
      };

      return DataContentTableView;

    })(Marionette.CompositeView);
  });
});
