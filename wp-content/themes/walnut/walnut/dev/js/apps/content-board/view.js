var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.ContentBoardView = (function(_super) {
      __extends(ContentBoardView, _super);

      function ContentBoardView() {
        return ContentBoardView.__super__.constructor.apply(this, arguments);
      }

      ContentBoardView.prototype.id = 'myCanvas';

      ContentBoardView.prototype.template = ' <h2 id="loading-content"> Loading Content.. Please Wait.. </h2> <div class="none" id="question-area"></div> <div id="feedback-area"> <div id="correct" class="alert alert-success text-center answrMsg"> <h3 class="bold">{{correct_answer_msg}}</h3> <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4> </div> <div id="wrong" class="alert alert-error text-center answrMsg"> <h3 class="bold">{{incorrect_answer_msg}}</h3> <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4> </div> <div id="partially-correct" class="alert alert-info text-center answrMsg"> <h3 class="bold">{{partial_correct_answers_msg}}</h3> <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4> </div> </div>';

      ContentBoardView.prototype.mixinTemplateHelpers = function(data) {
        var quizModel;
        data.correct_answer_msg = 'You are correct!';
        data.incorrect_answer_msg = 'Sorry, you did not answer correctly';
        data.partial_correct_answers_msg = 'You are almost correct';
        quizModel = Marionette.getOption(this, 'quizModel');
        if (quizModel) {
          data.correct_answer_msg = quizModel.getMessageContent('correct_answer');
          data.incorrect_answer_msg = quizModel.getMessageContent('incorrect_answer');
          data.partial_correct_answers_msg = quizModel.getMessageContent('partial_correct_answers');
        }
        return data;
      };

      ContentBoardView.prototype.onRender = function() {
        return this.$el.find('#feedback-area div').hide();
      };

      ContentBoardView.prototype.onShowResponse = function(marks, total) {
        this.$el.find('.total-marks').text(total);
        this.$el.find('.marks').text(marks);
        this.$el.find('#feedback-area div').hide();
        if (marks === 0) {
          this.$el.find('#wrong').show();
        }
        if (marks === total) {
          this.$el.find('#correct').show();
        }
        if (marks > 0 && marks < total) {
          return this.$el.find('#partially-correct').show();
        }
      };

      return ContentBoardView;

    })(Marionette.ItemView);
  });
});
