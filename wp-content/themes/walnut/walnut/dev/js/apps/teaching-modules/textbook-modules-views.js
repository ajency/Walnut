var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/teaching-modules/templates/content-modules-list.html'], function(App, contentModulesTpl) {
  return App.module("TeachersDashboardApp.View.TakeClassTextbookModules", function(TextbookModules, App) {
    var ContentGroupsItemView, EmptyView;
    ContentGroupsItemView = (function(_super) {
      __extends(ContentGroupsItemView, _super);

      function ContentGroupsItemView() {
        return ContentGroupsItemView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsItemView.prototype.template = '<td class="v-align-middle">{{name}}</td> <td class="v-align-middle">{{chapterName}}</td> {{#take_quiz}} <td class="v-align-middle">{{quiz_type}}</td> {{/take_quiz}} <td class="v-align-middle"><span style="display: none;">{{total_minutes}}</span> <span class="muted">{{duration}} {{minshours}}</span></td> <td> {{#practice_quiz}} {{#attempts}} <span class="label label-info">Attempts: <strong>{{attempts}}</strong></span> {{/attempts}} {{^attempts}} <span class="label label-important">Not Started</span> {{/attempts}} {{/practice_quiz}} {{^practice_quiz}} {{&status_str}} {{/practice_quiz}} </td> <td> <button data-id="{{id}}" type="button" class="btn btn-success btn-small pull-right action start-training"> {{&action_str}} </button> {{#schedule_button}} <button type="button" data-target="#schedule" data-toggle="modal" class="btn btn-white btn-small pull-left m-r-10 training-date"> <i class="fa fa-calendar"></i> {{taken_on}} </button> {{/schedule_button}} {{^schedule_button}} {{#taken_on}} <div class="alert alert-success inline pull-left m-b-0 m-r-10 dateInfo">{{taken_on}}</div> {{/taken_on}} {{^taken_on}} {{#schedule}} {{#schedule.is_active}} <div class="alert alert-info inline pull-left m-b-0 m-r-10"> Scheduled<br> From: {{scheduleFrom}}<br> To: {{scheduleTo}} </div> {{/schedule.is_active}} {{^schedule.is_active}} <div class="schedule_dates alert alert-info inline pull-left m-b-0 m-r-10"> Scheduled<br> From: {{scheduleFrom}}<br> To: {{scheduleTo}} </div> {{/schedule.is_active}} {{/schedule}} {{/taken_on}} {{/schedule_button}} </td>';

      ContentGroupsItemView.prototype.tagName = 'tr';

      ContentGroupsItemView.prototype.onShow = function() {
        this.$el.attr('id', 'row-' + this.model.get('id'));
        this.$el.attr('data-id', this.model.get('id'));
        if (this.model.get('quiz_type') === 'class_test' && this.model.get('schedule') && !this.model.get('schedule')['is_active']) {
          this.$el.find('.start-training').hide();
          return this.$el.find('.schedule_dates').removeClass('alert-info').addClass('alert-error');
        }
      };

      ContentGroupsItemView.prototype.serializeData = function() {
        var data, status, taken_on;
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
        if (this.model.get('type') === 'teaching-module') {
          taken_on = this.model.get('training_date');
          if (!taken_on) {
            taken_on = 'Schedule';
          } else {
            taken_on = moment(taken_on).format("Do MMM YYYY");
          }
        } else {
          taken_on = this.model.get('taken_on');
          if (!taken_on) {
            taken_on = null;
          } else {
            taken_on = moment(taken_on).format("Do MMM YYYY");
          }
          if (data.quiz_type === 'class_test' && data.status !== 'completed') {
            taken_on = null;
          }
        }
        status = this.model.get('status');
        if ((this.model.get('post_status') != null) && this.model.get('post_status') === 'archive') {
          data.status_str = '<span class="label label-success">Archived</span>';
          data.action_str = '<i class="fa fa-repeat"></i> Replay';
        } else {
          if (status === 'started' || status === 'resumed') {
            data.status_str = '<span class="label label-info">In Progress</span>';
            data.action_str = '<i class="fa fa-pause"></i> Resume';
          } else if (status === 'completed') {
            data.status_str = '<span class="label label-success">Completed</span>';
            data.action_str = '<i class="fa fa-repeat"></i> Replay';
          } else {
            data.status_str = '<span class="label label-important">Not Started</span>';
            data.action_str = '<i class="fa fa-play"></i> Start';
            if (Marionette.getOption(this, 'mode') !== 'take-quiz') {
              data.schedule_button = true;
            }
          }
        }
        data.taken_on = taken_on;
        if (Marionette.getOption(this, 'mode') === 'take-quiz') {
          data.take_quiz = true;
          data.quiz_type = this.model.get('quiz_type') === 'practice' ? 'Practice' : 'Quiz';
          if (data.schedule) {
            data.scheduleFrom = moment(data.schedule.from).format("Do MMM YYYY");
            data.scheduleTo = moment(data.schedule.to).format("Do MMM YYYY");
          }
        }
        if (this.model.get('quiz_type') === 'practice') {
          data.practice_quiz = true;
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
        if (Marionette.getOption(this, 'mode') === 'take-quiz') {
          return this.$el.attr('colspan', 5);
        } else {
          return this.$el.attr('colspan', 4);
        }
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

      ContentGroupsView.prototype.template = contentModulesTpl;

      ContentGroupsView.prototype.itemView = ContentGroupsItemView;

      ContentGroupsView.prototype.itemViewContainer = 'tbody';

      ContentGroupsView.prototype.itemViewOptions = function() {
        return {
          chaptersCollection: Marionette.getOption(this, 'chaptersCollection'),
          mode: Marionette.getOption(this, 'mode')
        };
      };

      ContentGroupsView.prototype.emptyView = EmptyView;

      ContentGroupsView.prototype.className = 'teacher-app moduleList';

      ContentGroupsView.prototype.events = {
        'change .textbook-filter': function(e) {
          return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
        },
        'change #content-status-filter': 'setFilteredContent',
        'change #quiz-type-filter': 'setFilteredContent',
        'click .start-training': 'startTraining',
        'click .training-date': 'scheduleTraining'
      };

      ContentGroupsView.prototype.serializeData = function() {
        var data;
        data = ContentGroupsView.__super__.serializeData.call(this);
        if (Marionette.getOption(this, 'mode') === 'take-quiz') {
          data.take_quiz = true;
        }
        return data;
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
        var dataType, filtered_data, pagerOptions;
        if (Marionette.getOption(this, 'mode') === 'take-quiz') {
          dataType = 'quiz';
        } else {
          dataType = 'teaching-modules';
        }
        filtered_data = $.filterTableByTextbooks(this, dataType);
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
