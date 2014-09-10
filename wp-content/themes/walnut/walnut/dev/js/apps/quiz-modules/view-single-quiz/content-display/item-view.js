var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/view-single-quiz/content-display/templates/content-display-item.html'], function(App, RegionController, contentDisplayItemTpl) {
  return App.module("QuizItemsDisplayApp.ContentCompositeView.ContentItemView", function(ContentItemView, App) {
    return ContentItemView.View = (function(_super) {
      __extends(View, _super);

      function View() {
        return View.__super__.constructor.apply(this, arguments);
      }

      View.prototype.template = contentDisplayItemTpl;

      View.prototype.tagName = 'li';

      View.prototype.mixinTemplateHelpers = function(data) {
        var all_marks, marks_obtained, responseModel, total_marks;
        responseModel = Marionette.getOption(this, 'responseModel');
        data.dateCompleted = 'N/A';
        if (responseModel) {
          data.dateCompleted = moment(responseModel.get('end_date')).format("Do MMM YYYY");
          data.timeTaken = $.timeMinSecs(responseModel.get('time_taken'));
          data.responseStatus = responseModel.get('status');
          data.display_answer = Marionette.getOption(this, 'display_answer');
          marks_obtained = responseModel.get('question_response').marks;
          data.marks_obtained = parseFloat(parseFloat(marks_obtained).toFixed(2));
          all_marks = _.compact(_.pluck(this.model.get('layout'), 'marks'));
          total_marks = 0;
          if (all_marks.length > 0) {
            total_marks = _.reduce(all_marks, function(memo, num) {
              return parseInt(memo) + parseInt(num);
            });
          }
          data.total_marks = parseFloat(total_marks.toFixed(2));
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
                  text: 'Partially <br>Correct',
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
        return data;
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
