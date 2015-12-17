var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("QuizReportApp.StudentsList.Views", function(Views, App) {
    Views.ListItemView = (function(superClass) {
      extend(ListItemView, superClass);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td>{{roll_no}}</td> <td>{{display_name}}</td> <td>{{#answered}} Marks Scored: {{marks_scored}}<br> Negative Marks: {{negative_scored}}<br> Total Marks Scored: {{total_marks_scored}} {{/answered}} {{^answered}}N/A{{/answered}} </td> <td>{{#answered}}{{time_taken}}{{/answered}} {{^answered}}N/A{{/answered}} </td> <td>{{#answered}}Attempted: {{attempts}} <span class="view-attempts fa fa-plus-circle"></span>{{/answered}} {{^answered}}N/A{{/answered}} </td> <td>{{#answered}} <button class="btn btn-success btn-small replay_quiz" data-summary-id={{summary_id}}>Replay</button> {{/answered}} {{^answered}}Not Taken{{/answered}} </td>';

      ListItemView.prototype.mixinTemplateHelpers = function(data) {
        var completed_summaries, summaries;
        summaries = Marionette.getOption(this, 'summaries');
        if (!_.isEmpty(summaries)) {
          completed_summaries = _.map(summaries, function(m) {
            if (m.get('status') === 'completed') {
              return m.toJSON();
            }
          });
          data.answered = true;
          data = _.extend(data, _.last(completed_summaries));
          data.attempts = _.size(summaries);
          data.time_taken = $.timeMinSecs(data.total_time_taken);
        }
        return data;
      };

      ListItemView.prototype.events = {
        'click .replay_quiz': function(e) {
          var summary_id;
          summary_id = $(e.target).attr('data-summary-id');
          return this.trigger('replay:quiz', this.model.id, summary_id);
        },
        'click .view-attempts': function(e) {
          return this.trigger("view:attempts", this.model.id);
        }
      };

      return ListItemView;

    })(Marionette.ItemView);
    return Views.EmptyView = (function(superClass) {
      extend(EmptyView, superClass);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = 'No students registered to this class';

      EmptyView.prototype.tagName = 'td';

      EmptyView.prototype.onShow = function() {
        return this.$el.attr('colspan', 6);
      };

      return EmptyView;

    })(Marionette.ItemView);
  });
});
