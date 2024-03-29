var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("QuizReportApp.StudentsList.Views", function(Views, App) {
    Views.ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td>{{roll_no}}</td> <td>{{display_name}}</td> <td>{{#answered}} Marks Scored: {{marks_scored}}<br> Negative Marks: {{negative_scored}}<br> Total Marks Scored: {{total_marks_scored}} {{/answered}} {{^answered}}N/A{{/answered}} </td> <td>{{#answered}}{{total_time_taken}}{{/answered}} {{^answered}}N/A{{/answered}} </td> <td>{{#answered}}Attempted: {{attempts}}{{/answered}} {{^answered}}N/A{{/answered}} </td> <td>{{#answered}} <button class="btn btn-success btn-small replay_quiz" data-summary-id={{summary_id}}>Replay</button> {{/answered}} {{^answered}}Not Taken{{/answered}} </td>';

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
        }
        return data;
      };

      ListItemView.prototype.events = {
        'click .replay_quiz': function(e) {
          var summary_id;
          summary_id = $(e.target).attr('data-summary-id');
          return this.trigger('replay:quiz', this.model.id, summary_id);
        }
      };

      return ListItemView;

    })(Marionette.ItemView);
    return Views.EmptyView = (function(_super) {
      __extends(EmptyView, _super);

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
