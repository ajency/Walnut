var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("StudentReportApp.QuizList.Views", function(Views, App) {
    Views.ListItemView = (function(superClass) {
      extend(ListItemView, superClass);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '{{#allowResetQuiz}} <td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}"> <label for="checkbox{{id}}"></label> </div> </td> {{/allowResetQuiz}} <td>{{name}}</td> <td>{{textbookName}}</td> <td>{{chapterName}}</td> <td>Quiz Time: {{total_minutes}}m<br> Time Taken: {{time_taken}} </td> <td>{{quiz_type}} </td> <td>Marks Scored: {{marks_scored}}<br> Negative Marks: {{negative_scored}}<br> Total Marks Scored: {{total_marks_scored}} </td> <td>Attempted: {{attempts}} <span class="view-attempts fa fa-plus-circle"></span> </td> <td><button class="btn btn-success btn-small replay_quiz" data-summary-id={{summary_id}}>Replay</button></td>';

      ListItemView.prototype.mixinTemplateHelpers = function(data) {
        var completed_summaries, summaries, textbookNames;
        summaries = Marionette.getOption(this, 'summaries');
        textbookNames = Marionette.getOption(this, 'textbookNames');
        if (!_.isEmpty(summaries)) {
          completed_summaries = _.map(summaries, function(m) {
            if (m.get('status') === 'completed') {
              return m.toJSON();
            }
          });
          data.answered = true;
          data = _.extend(data, _.last(completed_summaries));
          data.quiz_type = this.model.getQuizTypeLabel();
          data.time_taken = $.timeMinSecs(data.total_time_taken);
          data.attempts = _.size(summaries);
        }
        data.textbookName = textbookNames.getTextbookName(data.term_ids);
        data.chapterName = textbookNames.getChapterName(data.term_ids);
        if (Marionette.getOption(this, 'allowResetQuiz')) {
          data.allowResetQuiz = true;
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

      EmptyView.prototype.template = "This student hasn't taken any quizzes yet";

      EmptyView.prototype.tagName = 'td';

      EmptyView.prototype.onShow = function() {
        return this.$el.attr('colspan', 7);
      };

      return EmptyView;

    })(Marionette.ItemView);
  });
});
