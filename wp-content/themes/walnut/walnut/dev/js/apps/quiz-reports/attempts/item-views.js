var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("AttemptsPopupApp.Views", function(Views, App) {
    return Views.AttemptsItemView = (function(_super) {
      __extends(AttemptsItemView, _super);

      function AttemptsItemView() {
        return AttemptsItemView.__super__.constructor.apply(this, arguments);
      }

      AttemptsItemView.prototype.tagName = 'tr';

      AttemptsItemView.prototype.className = 'gradeX odd';

      AttemptsItemView.prototype.template = '<td>{{taken_on}}</td> <td>Marks Scored: {{marks_scored}}<br> Negative Marks: {{negative_scored}}<br> Total Marks Scored: {{total_marks_scored}}</td> <td>{{time_taken}}</td> <td><button class="btn btn-success btn-small replay_quiz">Replay</button></td>';

      AttemptsItemView.prototype.mixinTemplateHelpers = function(data) {
        data.taken_on = moment(data.taken_on).format("Do MMM YYYY");
        data.time_taken = $.timeMinSecs(data.total_time_taken);
        return data;
      };

      AttemptsItemView.prototype.events = {
        'click .replay_quiz': function(e) {
          return this.trigger('replay:quiz', summary_id);
        }
      };

      return AttemptsItemView;

    })(Marionette.ItemView);
  });
});
