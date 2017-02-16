var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'bootbox', 'text!apps/quiz-modules/take-quiz-module/single-question/templates/question-area-tpl.html'], function(App, RegionController, bootbox, questionAreaTemplate) {
  return App.module("TakeQuizApp.SingleQuestion", function(SingleQuestion, App) {
    return SingleQuestion.SingleQuestionLayout = (function(superClass) {
      extend(SingleQuestionLayout, superClass);

      function SingleQuestionLayout() {
        this.onEnableSubmit = bind(this.onEnableSubmit, this);
        this.mixinTemplateHelpers = bind(this.mixinTemplateHelpers, this);
        this.submitQuest = bind(this.submitQuest, this);
        this.skipQuest = bind(this.skipQuest, this);
        return SingleQuestionLayout.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionLayout.prototype.template = questionAreaTemplate;

      SingleQuestionLayout.prototype.regions = {
        contentBoardRegion: '#content-board'
      };

      SingleQuestionLayout.prototype.events = {
        'click #submit-question': 'submitQuest',
        'click #previous-question': function() {
          return this.trigger("goto:previous:question");
        },
        'click #skip-question': 'skipQuest',
        'click #show-hint': function() {
          console.log(this.model.get('hint'));
          bootbox.alert(this.model.get('hint'));
          return this.trigger('show:hint:dialog');
        },
        'click #next-question': function() {
          return this.trigger("goto:next:question");
        }
      };

      SingleQuestionLayout.prototype.skipQuest = function() {
        localStorage.button = 'skip';
        this.$el.find('.submit-single').attr('disabled', 'disabled');
        this.$el.find('.skip-button').attr('disabled', 'disabled');
        this.$el.find('.errorSubmitMsg').addClass('hide');
        return this.trigger("skip:question");
      };

      SingleQuestionLayout.prototype.submitQuest = function() {
        localStorage.button = 'submit';
        this.$el.find('.submit-single').attr('disabled', 'disabled');
        this.$el.find('.skip-button').attr('disabled', 'disabled');
        this.$el.find('.errorSubmitMsg').addClass('hide');
        return this.trigger("validate:answer");
      };

      SingleQuestionLayout.prototype.mixinTemplateHelpers = function(data) {
        var display_mode, ref, responseModel;
        console.log(this.quizModel);
        responseModel = Marionette.getOption(this, 'questionResponseModel');
        display_mode = Marionette.getOption(this, 'display_mode');
        if (this.quizModel.hasPermission('allow_hint') && _.trim(data.hint)) {
          data.show_hint = true;
        }
        if (display_mode === 'replay') {
          data.showComment = true;
          data.replay = true;
        } else {
          data.replay = false;
          data.show_skip = true;
          data.allow_submit_answer = true;
          if (this.quizModel.hasPermission('single_attempt') && !this.quizModel.hasPermission('allow_resubmit')) {
            data.show_skip_helper_text = true;
          }
          if (responseModel) {
            if (responseModel.get('status') !== 'skipped') {
              data.allow_submit_answer = false;
            }
            if (this.quizModel.hasPermission('single_attempt')) {
              data.allow_submit_answer = false;
              data.show_skip = false;
            }
            if (this.quizModel.hasPermission('allow_resubmit')) {
              data.allow_submit_answer = true;
            }
            if (responseModel.get('status') === 'paused') {
              data.allow_submit_answer = true;
            }
            if ((ref = responseModel.get('status')) !== 'skipped' && ref !== 'paused') {
              data.show_skip = false;
            }
          }
          if (!data.allow_submit_answer) {
            data.allow_skip = false;
          }
        }
        console.log(data);
        return data;
      };

      SingleQuestionLayout.prototype.initialize = function() {
        var result;
        this.quizModel = Marionette.getOption(this, 'quizModel');
        if ((this.quizModel.get('quiz_type') === 'practice') && this.quizModel.hasPermission('display_answer')) {
          result = this.quizModel.get('permissions');
          return result.single_attempt = true;
        }
      };

      SingleQuestionLayout.prototype.onShow = function() {
        if (this.$el.find('#submit-question').length === 0) {
          if (this.model.id === parseInt(_.last(this.quizModel.get('content_pieces')))) {
            this.$el.find('#last_question').html('This is the last question');
            this.$el.find('#next-question').hide();
          } else {
            this.$el.find('#next-question').show();
          }
        }
        if ($('#collapseView').hasClass('in')) {
          $('.submit2').addClass('submit-pushed');
        }
        if (parseInt(this.model.id) === parseInt(_.first(this.quizModel.get('content_pieces')))) {
          this.$el.find('#first_question').html('This is the first question');
          return this.$el.find('#previous-question').hide();
        }
      };

      SingleQuestionLayout.prototype.onSubmitQuestion = function() {
        if (this.model.id === parseInt(_.last(this.quizModel.get('content_pieces')))) {
          this.$el.find('#last_question').html('This is the last question');
          return bootbox.alert('You have completed the quiz. Now click on end quiz to view your quiz summary');
        } else {
          return this.$el.find("#next-question").show();
        }
      };

      SingleQuestionLayout.prototype.onEnableSubmit = function() {
        this.$el.find('.submit-single').attr('disabled', false);
        return this.$el.find('.skip-button').attr('disabled', false);
      };

      SingleQuestionLayout.prototype.onDisplayError = function() {
        this.$el.find('.errorSubmitMsg').removeClass('hide');
        return this.$el.find('.skip-button').attr('disabled', false);
      };

      return SingleQuestionLayout;

    })(Marionette.Layout);
  });
});
