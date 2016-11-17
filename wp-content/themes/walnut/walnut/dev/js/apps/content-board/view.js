var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.ContentBoardView = (function(superClass) {
      extend(ContentBoardView, superClass);

      function ContentBoardView() {
        return ContentBoardView.__super__.constructor.apply(this, arguments);
      }

      ContentBoardView.prototype.id = 'myCanvas';

      ContentBoardView.prototype.className = 'animated fadeIn';

      ContentBoardView.prototype.template = '<h1 id="loading-content-board">Loading ... <span class="fa fa-spin fa-spinner"></span></h1> <div class="vHidden" id="question-area"></div> <div id="feedback-area"> <div id="correct" class="alert alert-success text-center answrMsg"> <h3 class="bold">{{correct_answer_msg}}</h3> <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4> </div> <div id="wrong" class="alert alert-error text-center answrMsg"> <h3 class="bold">{{incorrect_answer_msg}}</h3> <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4> </div> <div id="partially-correct" class="alert alert-info text-center answrMsg"> <h3 class="bold">{{partial_correct_answers_msg}}</h3> <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4> </div> <div id="skipped" class="alert alert-error text-center answrMsg"> <h3 class="bold">{{skipped_msg}}</h3> <h4 class="semi-bold">You scored: <span class="bold">0/<span class="total-marks"></span></span></h4> </div> <div class="commentMsg"><label class="fosz14">Comment : </label> {{comment}}</div> </div>';

      ContentBoardView.prototype.mixinTemplateHelpers = function(data) {
        var quizModel;
        Marionette.getOption(this, 'display_mode');
        data.correct_answer_msg = 'You are correct!';
        data.incorrect_answer_msg = 'Sorry, you did not answer correctly';
        data.partial_correct_answers_msg = 'You are almost correct';
        quizModel = Marionette.getOption(this, 'quizModel');
        if (quizModel) {
          data.correct_answer_msg = quizModel.getMessageContent('correct_answer');
          data.incorrect_answer_msg = quizModel.getMessageContent('incorrect_answer');
          data.partial_correct_answers_msg = quizModel.getMessageContent('partial_correct_answers');
          data.skipped_msg = 'This question was skipped';
          data.comment = this.model.get('comment');
        }
        return data;
      };

      ContentBoardView.prototype.onRender = function() {
        return this.$el.find('#feedback-area div').hide();
      };

      ContentBoardView.prototype.onShowResponse = function(marks, total) {
        var answerModel, answer_model, display_marks, quizModel, replay_true;
        marks = parseFloat(marks);
        total = parseFloat(total);
        quizModel = Marionette.getOption(this, 'quizModel');
        if (marks === 0 && _.toBool(quizModel.get('negMarksEnable'))) {
          display_marks = -total * quizModel.get('negMarks') / 100;
        } else {
          display_marks = marks;
        }
        this.$el.find('.total-marks').text(total);
        this.$el.find('.marks').text(display_marks);
        this.$el.find('#feedback-area div').hide();
        answerModel = Marionette.getOption(this, 'answerModel');
        answer_model = Marionette.getOption(this, 'answerModel');
        replay_true = answer_model.get('status');
        console.log(replay_true);
        if (replay_true !== 'not_attempted') {
          if (this.model.get('comment') !== '') {
            this.$el.find('.commentMsg').show();
          }
        }
        if (answerModel && answerModel.get('status') === 'skipped') {
          return this.$el.find('#skipped').show();
        } else {
          if (marks === 0) {
            this.$el.find('#wrong').show();
          }
          if (marks === total) {
            this.$el.find('#correct').show();
          }
          if (marks > 0 && marks < total) {
            return this.$el.find('#partially-correct').show();
          }
        }
      };

      return ContentBoardView;

    })(Marionette.ItemView);
  });
});
