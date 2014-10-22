var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/quiz-reports/class-report/modules-listing/templates/outer-template.html', 'apps/quiz-reports/class-report/modules-listing/item-views'], function(App, contentListTpl) {
  return App.module("ClassQuizReportListing.Views", function(Views) {
    return Views.ModulesListingView = (function(_super) {
      __extends(ModulesListingView, _super);

      function ModulesListingView() {
        this.onResetTextbookNames = __bind(this.onResetTextbookNames, this);
        return ModulesListingView.__super__.constructor.apply(this, arguments);
      }

      ModulesListingView.prototype.template = contentListTpl;

      ModulesListingView.prototype.className = 'row';

      ModulesListingView.prototype.itemView = Views.ListItemView;

      ModulesListingView.prototype.emptyView = Views.EmptyView;

      ModulesListingView.prototype.itemViewContainer = '#list-content-pieces';

      ModulesListingView.prototype.itemViewOptions = function() {
        return {
          textbookNamesCollection: this.textbookNamesCollection
        };
      };

      ModulesListingView.prototype.events = {
        'change #check_all_div': function() {
          return $.toggleCheckAll(this.$el.find('#content-pieces-table'));
        },
        'change .tab_checkbox,#check_all_div ': 'showSubmitButton',
        'click #send-email, #send-sms': 'saveCommunications'
      };

      ModulesListingView.prototype.initialize = function() {
        return this.textbookNamesCollection = Marionette.getOption(this, 'textbookNamesCollection');
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

      ModulesListingView.prototype.onResetTextbookNames = function(namesCollection) {
        this.textbookNamesCollection.reset(namesCollection.models);
        this.collection.trigger('reset');
        return this.onUpdatePager();
      };

      ModulesListingView.prototype.showSubmitButton = function() {
        if (this.$el.find('.tab_checkbox').is(':checked')) {
          return this.$el.find('#send-email, #send-sms').show();
        } else {
          return this.$el.find('#send-email, #send-sms').hide();
        }
      };

      ModulesListingView.prototype.saveCommunications = function(e) {
        var data;
        data = [];
        data.quizIDs = _.chain(this.$el.find('.tab_checkbox')).map(function(checkbox) {
          if ($(checkbox).is(':checked')) {
            return $(checkbox).val();
          }
        }).compact().value();
        data.division = this.$el.find('#divisions-filter').val();
        if (e.target.id === 'send-email') {
          data.communication_mode = 'email';
        } else {
          data.communication_mode = 'sms';
        }
        if (data.quizIDs) {
          this.trigger("save:communications", data);
          this.$el.find('#communication_sent').remove();
          return this.$el.find('#send-email').after('<span class="m-l-40 small" id="communication_sent"> Your ' + data.communication_mode + ' has been queued successfully</span>');
        }
      };

      return ModulesListingView;

    })(Marionette.CompositeView);
  });
});
