var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/quiz-reports/class-report/modules-listing/templates/outer-template.html', 'apps/quiz-reports/class-report/modules-listing/item-views'], function(App, contentListTpl) {
  return App.module("ClassQuizReportListing.Views", function(Views) {
    return Views.ModulesListingView = (function(_super) {
      __extends(ModulesListingView, _super);

      function ModulesListingView() {
        return ModulesListingView.__super__.constructor.apply(this, arguments);
      }

      ModulesListingView.prototype.template = contentListTpl;

      ModulesListingView.prototype.className = 'row';

      ModulesListingView.prototype.itemView = Views.ListItemView;

      ModulesListingView.prototype.emptyView = Views.EmptyView;

      ModulesListingView.prototype.itemViewContainer = '#list-content-pieces';

      ModulesListingView.prototype.itemViewOptions = function() {
        return {
          textbooksCollection: this.textbooks,
          chaptersCollection: Marionette.getOption(this, 'chaptersCollection')
        };
      };

      ModulesListingView.prototype.initialize = function() {
        this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        this.textbooks = new Array();
        return this.textbooksCollection.each((function(_this) {
          return function(textbookModel, ind) {
            return _this.textbooks.push({
              'name': textbookModel.get('name'),
              'id': textbookModel.get('term_id')
            });
          };
        })(this));
      };

      ModulesListingView.prototype.onShow = function() {
        this.$el.find('#content-pieces-table').tablesorter();
        return this.onUpdatePager();
      };

      ModulesListingView.prototype.onUpdatePager = function() {
        var pagerOptions;
        this.$el.find("#content-pieces-table").trigger("updateCache");
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find("#content-pieces-table").tablesorterPager(pagerOptions);
      };

      return ModulesListingView;

    })(Marionette.CompositeView);
  });
});
