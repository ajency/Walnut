var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/view-single-quiz/content-display/templates/content-display-item.html'], function(App, RegionController, contentDisplayItemTpl) {
  return App.module("QuizItemsDisplayApp.ContentCompositeView.ContentItemView", function(ContentItemView, App) {
    return ContentItemView.View = (function(_super) {
      __extends(View, _super);

      function View() {
        this.getResults = __bind(this.getResults, this);
        return View.__super__.constructor.apply(this, arguments);
      }

      View.prototype.template = contentDisplayItemTpl;

      View.prototype.tagName = 'li';

      View.prototype.mixinTemplateHelpers = function(data) {
        var responseModel;
        responseModel = Marionette.getOption(this, 'responseModel');
        data.dateCompleted = 'N/A';
        if (responseModel) {
          data.dateCompleted = moment(responseModel.get('end_date')).format("Do MMM YYYY");
          data.timeTaken = this.formatTimeTaken(responseModel.get('time_taken'));
          data.responseStatus = responseModel.get('status');
          data.statusUI = (function() {
            switch (data.responseStatus) {
              case 'correct_answer':
                return {
                  divClass: 'text-right',
                  text: 'Correct',
                  icon: 'fa-check'
                };
              case 'partially_correct':
                return {
                  divClass: 'text-right',
                  text: 'Parially Correct',
                  icon: 'fa-check-square'
                };
              case 'skipped':
                return {
                  divClass: 'text-error',
                  text: 'Skipped',
                  icon: 'fa-share-square'
                };
              case 'wrong_answer':
                return {
                  divClass: 'text-error',
                  text: 'Wrong',
                  icon: 'fa-times'
                };
            }
          })();
        }
        console.log(data);
        return data;
      };

      View.prototype.formatTimeTaken = function(time) {
        var mins, seconds, timeTaken;
        mins = parseInt(time / 60);
        if (mins > 59) {
          mins = parseInt(mins % 60);
        }
        seconds = parseInt(time % 60);
        return timeTaken = mins + 'm ' + seconds + 's';
      };

      View.prototype.getResults = function(question_response) {
        var ans, answeredCorrectly, correct_answer, name, names, studID, studentCollection, student_names, _i, _j, _len, _len1;
        correct_answer = 'No One';
        names = [];
        studentCollection = Marionette.getOption(this, 'studentCollection');
        if (this.model.get('question_type') === 'chorus') {
          if (question_response != null) {
            correct_answer = CHORUS_OPTIONS[question_response];
          }
        } else if (this.model.get('question_type') === 'individual') {
          for (_i = 0, _len = question_response.length; _i < _len; _i++) {
            studID = question_response[_i];
            answeredCorrectly = studentCollection.where({
              "ID": studID
            });
            for (_j = 0, _len1 = answeredCorrectly.length; _j < _len1; _j++) {
              ans = answeredCorrectly[_j];
              name = ans.get('display_name');
            }
            names.push(name);
          }
          if (_.size(names) > 0) {
            student_names = names.join(', ');
            correct_answer = _.size(names) + ' Students (' + student_names + ')';
          }
        } else {
          correct_answer = _.size(_.pluck(question_response, 'id')) + ' Students';
        }
        return correct_answer;
      };

      View.prototype.onShow = function() {
        var content_icon;
        content_icon = 'fa-question';
        if (this.model.get('content_type' === 'content_piece')) {
          content_icon = 'fa-youtube-play';
        }
        this.$el.find('.cbp_tmicon .fa').addClass(content_icon);
        if (this.model.get('content_type') === 'content_piece') {
          return this.$el.find('#correct-answer-div, .question-type-div').remove();
        }
      };

      return View;

    })(Marionette.ItemView);
  });
});
