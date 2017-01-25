var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/view-single-quiz/content-display/templates/content-display-item.html'], function(App, RegionController, contentDisplayItemTpl) {
  return App.module("QuizItemsDisplayApp.ContentCompositeView.ContentItemView", function(ContentItemView, App) {
    return ContentItemView.View = (function(superClass) {
      extend(View, superClass);

      function View() {
        return View.__super__.constructor.apply(this, arguments);
      }

      View.prototype.template = contentDisplayItemTpl;

      View.prototype.tagName = 'li';

      View.prototype.mixinTemplateHelpers = function(data) {
        var comment, marks_obtained, quizModel, responseModel, total_marks;
        data.commentId = _.uniqueId();
        data.commentIdAdmin = _.uniqueId();
        responseModel = Marionette.getOption(this, 'responseModel');
        quizModel = Marionette.getOption(this, 'quizModel');
        data.dateCompleted = 'N/A';
        if (responseModel) {
          data.dateCompleted = moment(responseModel.get('end_date')).format("Do MMM YYYY");
          data.timeTaken = $.timeMinSecs(responseModel.get('time_taken'));
          data.responseStatus = responseModel.get('status');
          data.display_answer = quizModel.hasPermission('display_answer');
          marks_obtained = responseModel.get('marks_scored');
          data.marks_obtained = parseFloat(parseFloat(marks_obtained).toFixed(1));
          total_marks = this.model.get('marks');
          data.total_marks = parseFloat(total_marks.toFixed(1));
          data.hint_viewed = responseModel.get('question_response').hint_viewed ? 'Yes' : 'No';
          if (!quizModel.hasPermission('allow_hint')) {
            data.hint = false;
          }
          if (this.model.get('comment') !== '') {
            comment = this.model.get('comment');
            if (comment.length > 20) {
              data.comment_modal = true;
              data.comment = comment;
            }
          } else {
            data.comment = false;
          }
          data.statusUI = (function() {
            switch (data.responseStatus) {
              case 'correct_answer':
                return {
                  divClass: 'text-success',
                  text: 'Correct',
                  icon: 'fa-check'
                };
              case 'partially_correct':
                return {
                  divClass: 'text-success',
                  text: 'Partially Correct',
                  icon: 'fa-check-square'
                };
              case 'skipped':
                return {
                  divClass: 'text-warning',
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
