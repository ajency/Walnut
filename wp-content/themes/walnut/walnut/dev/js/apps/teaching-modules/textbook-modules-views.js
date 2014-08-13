var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module("TeachersDashboardApp.View.TakeClassTextbookModules", function(TextbookModules, App) {
    var ContentGroupsItemView, EmptyView;
    ContentGroupsItemView = (function(_super) {
      __extends(ContentGroupsItemView, _super);

      function ContentGroupsItemView() {
        return ContentGroupsItemView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsItemView.prototype.template = '<td class="v-align-middle">{{name}}</td> <td class="v-align-middle">{{chapterName}}</td> <td class="v-align-middle"><span style="display: none;">{{total_minutes}}</span> <span class="muted">{{duration}} {{minshours}}</span></td> <td> <span class="muted status_label">{{&status_str}}</span> <button data-id="{{id}}" type="button" class="btn btn-success btn-small pull-right action start-training"> {{&action_str}} </button> {{&training_date}} </td>';

      ContentGroupsItemView.prototype.tagName = 'tr';

      ContentGroupsItemView.prototype.onShow = function() {
        this.$el.attr('id', 'row-' + this.model.get('id'));
        return this.$el.attr('data-id', this.model.get('id'));
      };

      ContentGroupsItemView.prototype.serializeData = function() {
        var data, status, training_date;
        data = ContentGroupsItemView.__super__.serializeData.call(this);
        data.chapterName = (function(_this) {
          return function() {
            var chapter;
            chapter = _.chain(_this.chapters.findWhere({
              "term_id": data.term_ids.chapter
            })).pluck('name').compact().value();
            return chapter;
          };
        })(this);
        training_date = this.model.get('training_date');
        if (training_date === '') {
          training_date = 'Schedule';
        } else {
          training_date = moment(training_date).format("Do MMM YYYY");
        }
        status = this.model.get('status');
        if ((this.model.get('post_status') != null) && this.model.get('post_status') === 'archive') {
          console.log('im here');
          data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>';
          data.status_str = '<span class="label label-success">Archived</span>';
          data.action_str = '<i class="fa fa-repeat"></i> Replay';
        } else {
          if (status === 'started' || status === 'resumed') {
            data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>';
            data.status_str = '<span class="label label-info">In Progress</span>';
            data.action_str = '<i class="fa fa-pause"></i> Resume';
          } else if (status === 'completed') {
            data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>';
            data.status_str = '<span class="label label-success">Completed</span>';
            data.action_str = '<i class="fa fa-repeat"></i> Replay';
          } else {
            data.status_str = '<span class="label label-important">Not Started</span>';
            data.action_str = '<i class="fa fa-play"></i> Start';
            data.training_date = '<button type="button" data-target="#schedule" data-toggle="modal" class="btn btn-white btn-small pull-right m-r-10 training-date"> <i class="fa fa-calendar"></i> ' + training_date + '</button>';
          }
        }
        return data;
      };

      ContentGroupsItemView.prototype.initialize = function(options) {
        return this.chapters = options.chaptersCollection;
      };

      return ContentGroupsItemView;

    })(Marionette.ItemView);
    EmptyView = (function(_super) {
      __extends(EmptyView, _super);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = 'No Modules Available';

      EmptyView.prototype.tagName = 'td';

      EmptyView.prototype.onShow = function() {
        return this.$el.attr('colspan', 4);
      };

      return EmptyView;

    })(Marionette.ItemView);
    return TextbookModules.ContentGroupsView = (function(_super) {
      __extends(ContentGroupsView, _super);

      function ContentGroupsView() {
        this.onShow = __bind(this.onShow, this);
        this.startTraining = __bind(this.startTraining, this);
        return ContentGroupsView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsView.prototype.template = '<div class="tiles white grid simple  animated fadeIn"> <div class="grid-title"> <h3 class="m-t-5 m-b-5">Textbook <span class="semi-bold">{{showTextbookName}}</span></h3> </div> <div class="grid-body contentSelect" style="overflow: hidden; display: block;"> <div class="row"> <div class="col-xs-12"> <div class="filters"> <div class="table-tools-actions"> <span id="textbook-filters"></span> <select class="select2-filters" id="content-status-filter" style="width:150px"> <option value="">All Status</option> <option value="started">In Progress</option> <option value="not started">Not Started</option> <option value="completed">Completed</option> </select> </div> </div> </div> <div class="clearfix"></div> <div class="col-sm-12"></div> </div> <div class="row m-t-15"> <div class="col-lg-12"> <!--<h4>{{&showModulesHeading}}</h4>--> <table class="table table-condensed table-fixed-layout table-bordered takeClass" id="take-class-modules"> <thead> <tr> <th>Name</th> <th>Chapter</th> <th class="{sorter:\'minutesSort\'}">Duration</th> <th><div id="status_header">Status</div></th> </tr> </thead> <tbody> </tbody> </table> <div id="pager" class="pager"> <i class="fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="fa fa-chevron-right next"></i> <select class="pagesize"> <option value="25" selected>25</option> <option value="50">50</option> <option value="100">100</option> </select> </div> </div> </div> </div> </div>';

      ContentGroupsView.prototype.itemView = ContentGroupsItemView;

      ContentGroupsView.prototype.itemViewContainer = 'tbody';

      ContentGroupsView.prototype.itemViewOptions = function() {
        return {
          chaptersCollection: Marionette.getOption(this, 'chaptersCollection')
        };
      };

      ContentGroupsView.prototype.emptyView = EmptyView;

      ContentGroupsView.prototype.className = 'teacher-app moduleList';

      ContentGroupsView.prototype.events = {
        'change .textbook-filter': function(e) {
          return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
        },
        'change #content-status-filter': 'setFilteredContent',
        'click .start-training': 'startTraining',
        'click .training-date': 'scheduleTraining'
      };

      ContentGroupsView.prototype.startTraining = function(e) {
        var currentRoute, dataID, _ref;
        dataID = $(e.currentTarget).attr('data-id');
        currentRoute = App.getCurrentRoute();
        if ((_ref = Marionette.getOption(this, 'mode')) === 'training' || _ref === 'take-class') {
          App.navigate(currentRoute + "/module/" + dataID, true);
        }
        if (Marionette.getOption(this, 'mode') === 'take-quiz') {
          return App.navigate(currentRoute + "/quiz/" + dataID, true);
        }
      };

      ContentGroupsView.prototype.onScheduledModule = function(id, date) {
        return this.$el.find('tr#row-' + id + ' .training-date').html('<i class="fa fa-calendar"></i> ' + moment(date).format("Do MMM YYYY"));
      };

      ContentGroupsView.prototype.scheduleTraining = function(e) {
        var dataID;
        dataID = $(e.target).closest('tr').attr('data-id');
        return this.trigger("schedule:training", dataID);
      };

      ContentGroupsView.prototype.onShow = function() {
        var pagerOptions, textbookFiltersHTML;
        $('.page-content').removeClass('expand-page');
        if (Marionette.getOption(this, 'mode') === 'training') {
          this.$el.find('.status_label, .training-date, #status_header, .dateInfo').remove();
        }
        textbookFiltersHTML = $.showTextbookFilters({
          chapters: Marionette.getOption(this, 'chaptersCollection')
        });
        this.fullCollection = Marionette.getOption(this, 'fullCollection');
        console.log(this.fullCollection);
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        this.$el.find(".select2-filters").select2();
        $('#take-class-modules').tablesorter();
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#take-class-modules').tablesorterPager(pagerOptions);
      };

      ContentGroupsView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType) {
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
        return this.setFilteredContent();
      };

      ContentGroupsView.prototype.setFilteredContent = function() {
        var filtered_data, pagerOptions;
        filtered_data = $.filterTableByTextbooks(this);
        this.collection.set(filtered_data);
        $("#take-class-modules").trigger("updateCache");
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#take-class-modules').tablesorterPager(pagerOptions);
      };

      return ContentGroupsView;

    })(Marionette.CompositeView);
  });
});
