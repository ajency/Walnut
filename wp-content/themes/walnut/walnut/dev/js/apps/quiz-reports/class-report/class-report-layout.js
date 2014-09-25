var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/quiz-reports/class-report/templates/class-report-layout.html'], function(App, RegionController, classReportLayoutTpl) {
  return App.module("ClassReportApp.Layout", function(Layout, App) {
    return Layout.ContentPiecesLayout = (function(_super) {
      __extends(ContentPiecesLayout, _super);

      function ContentPiecesLayout() {
        return ContentPiecesLayout.__super__.constructor.apply(this, arguments);
      }

      ContentPiecesLayout.prototype.template = classReportLayoutTpl;

      ContentPiecesLayout.prototype.className = 'tiles white grid simple vertical green';

      ContentPiecesLayout.prototype.regions = {
        studentFilterRegion: '#students-filter-region',
        filtersRegion: '#filters-region',
        allContentRegion: '#all-content-region',
        searchResultsRegion: '#search-results-region'
      };

      ContentPiecesLayout.prototype.events = {
        'click #addContent a': 'changeTab'
      };

      ContentPiecesLayout.prototype.onShow = function() {
        return this.onChangeDivision(Marionette.getOption(this, 'students'));
      };

      ContentPiecesLayout.prototype.onChangeDivision = function(students) {
        return this.$el.find("#students-count").html(_.size(students));
      };

      ContentPiecesLayout.prototype.changeTab = function(e) {
        e.preventDefault();
        this.$el.find('#addContent a').removeClass('active');
        return $(e.target).closest('a').addClass('active').tab('show');
      };

      return ContentPiecesLayout;

    })(Marionette.Layout);
  });
});
