var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'bootbox'], function(App, bootbox) {
  return App.module("ClassQuizReportListing.Views", function(Views, App, Backbone, Marionette, $, _) {
    Views.ListItemView = (function(superClass) {
      extend(ListItemView, superClass);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}"> <label for="checkbox{{id}}"></label> </div> </td> <td>{{name}}</td> <td>{{&textbookName}}</td> <td>{{&chapterName}}</td> <td>{{duration}} mins</td> <td>{{quiz_type}}</td> <td>{{taken_by}}</td> {{#can_schedule}} <td> {{#class_test}} <div class="schedule_dates none"> From: <span id="schedule-from-date"> {{scheduleFrom}} </span> <br> To: <span id="schedule-to-date"> {{scheduleTo}} </span><br> <span class="schedule-quiz">change</a></span> | <span class="clear-schedule">clear</a> </div> <button id="schedule-button" type="button" class="btn btn-white btn-small pull-left m-r-10 schedule-quiz"> <i class="fa fa-calendar"></i> Schedule </button> {{/class_test}} </td> {{/can_schedule}} <td style="padding: 0 !important; vertical-align: middle;"><div class="report-container"><button class="btn btn-small btn-success view-report">view report</button><button class="xl-report"><i class="fa fa-download" aria-hidden="true"></i></button></div></td>';

      ListItemView.prototype.mixinTemplateHelpers = function(data) {
        var schedule, term_ids, textbooks;
        textbooks = Marionette.getOption(this, 'textbookNamesCollection');
        term_ids = data.term_ids;
        data.textbookName = textbooks.getTextbookName(term_ids);
        data.chapterName = textbooks.getChapterName(term_ids);
        if (data.quiz_type === 'class_test') {
          data.class_test = true;
        }
        data.quiz_type = this.model.getQuizTypeLabel();
        data.taken_by = (function() {
          switch (data.taken_by) {
            case 0:
              return 'None';
            case 1:
              return '1 Student';
            default:
              if (parseInt(data.taken_by) === parseInt(data.totalStudents)) {
                return 'All';
              } else {
                return data.taken_by + ' Students';
              }
          }
        })();
        if (this.model.get('quiz_type') === 'class_test' && this.model.get('schedule')) {
          schedule = this.model.get('schedule');
          data.scheduleFrom = schedule['from'];
          data.scheduleTo = schedule['to'];
        }
        if (App.request('current:user:can', 'schedule_quiz')) {
          data.can_schedule = true;
        }
        return data;
      };

      ListItemView.prototype.events = {
        'click .view-report': function() {
          return this.trigger('view:quiz:report', this.model.id);
        },
        'click .schedule-quiz': function() {
          return this.trigger('schedule:quiz', this.model.id);
        },
        'click .clear-schedule': 'clearSchedule',
        'click .xl-report': function() {
          return this.trigger('view:excel:report', this.model.id);
        }
      };

      ListItemView.prototype.modelEvents = {
        'change:schedule': 'changeScheduleDates'
      };

      ListItemView.prototype.onShow = function() {
        if (this.model.get('quiz_type') === 'class_test' && this.model.get('schedule')) {
          this.$el.find('.schedule_dates').show();
          return this.$el.find('#schedule-button').hide();
        } else {
          return this.$el.find('.xl-report').hide();
        }
      };

      ListItemView.prototype.changeScheduleDates = function() {
        var from, schedule, to;
        schedule = this.model.get('schedule');
        from = schedule['from'];
        to = schedule['to'];
        console.log(from);
        console.log(to);
        console.log(schedule);
        if (from && to) {
          this.$el.find('#schedule-from-date').html(from);
          this.$el.find('#schedule-to-date').html(to);
          this.$el.find('.schedule_dates').show();
          return this.$el.find('#schedule-button').hide();
        } else {
          this.$el.find('.schedule_dates').hide();
          return this.$el.find('#schedule-button').show();
        }
      };

      ListItemView.prototype.clearSchedule = function() {
        return bootbox.confirm('Are you sure you want to clear the scheduled date?', (function(_this) {
          return function(result) {
            if (result) {
              return _this.trigger('clear:schedule', _this.model.id);
            }
          };
        })(this));
      };

      return ListItemView;

    })(Marionette.ItemView);
    return Views.EmptyView = (function(superClass) {
      extend(EmptyView, superClass);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = 'No Content Available';

      EmptyView.prototype.tagName = 'td';

      EmptyView.prototype.onShow = function() {
        return this.$el.attr('colspan', 7);
      };

      return EmptyView;

    })(Marionette.ItemView);
  });
});
