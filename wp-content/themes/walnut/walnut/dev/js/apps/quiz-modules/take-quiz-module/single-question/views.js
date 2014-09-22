var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("TakeQuizApp.SingleQuestion", function(SingleQuestion, App) {
    return SingleQuestion.SingleQuestionLayout = (function(_super) {
      __extends(SingleQuestionLayout, _super);

      function SingleQuestionLayout() {
        this.mixinTemplateHelpers = __bind(this.mixinTemplateHelpers, this);
        return SingleQuestionLayout.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionLayout.prototype.template = '<div id="content-board" class="quizContent no-margin"></div> <div class="well m-b-10 p-t-10 p-b-10 h-center quizActions"> <span class="pull-left" id="first_question"></span> <button type="button" id="previous-question" class="btn btn-info pull-left"> <i class="fa fa-backward"></i> Previous </button> {{#allow_submit_answer}} <button type="button" id="submit-question" class="btn btn-success pull-right"> Submit <i class="fa fa-forward"></i> </button> {{/allow_submit_answer}} <span class="pull-right" id="last_question"></span> <button type="button" id="next-question" class="none btn btn-info pull-right"> Next <i class="fa fa-forward"></i> </button> <div class="text-center"> {{#show_hint}} <button type="button" id="show-hint" class="btn btn-default btn-sm btn-small m-r-10"> <i class="fa fa-lightbulb-o"></i> Hint </button> {{/show_hint}} {{#show_skip}} <button type="button" id="skip-question" class="btn btn-default btn-sm btn-small"> Skip <i class="fa fa-step-forward"></i> </button> {{/show_skip}} {{#show_skip_helper_text}} <div><i class="small">(questions once skipped cannot be answered later)</i></div> {{/show_skip_helper_text}} </div> <div class="clearfix"></div> </div> <div class="tiles grey text-grey b-grey b-b m-t-30 qstnInfo"> <div class="grid simple m-b-0 transparent"> <div class="grid-title no-border"> <p class="small-text bold inline text-grey"><span class="fa fa-question"></span> Question Info </p> </div> <div class="grid-body no-border"> <p class="bold inline text-grey">{{&instructions}}</p> </div> <div class="qstnInfoBod no-border m-t-10 p-b-5 p-r-20 p-l-20"> <p class=""></p> </div> </div> </div>';

      SingleQuestionLayout.prototype.regions = {
        contentBoardRegion: '#content-board'
      };

      SingleQuestionLayout.prototype.events = {
        'click #submit-question': function() {
          return this.trigger("validate:answer");
        },
        'click #previous-question': function() {
          return this.trigger("goto:previous:question");
        },
        'click #skip-question': function() {
          return this.trigger("skip:question");
        },
        'click #show-hint': function() {
          return this.trigger('show:hint:dialog');
        },
        'click #next-question': function() {
          return this.trigger("goto:next:question");
        }
      };

      SingleQuestionLayout.prototype.mixinTemplateHelpers = function(data) {
        var display_mode, responseModel, _ref;
        responseModel = Marionette.getOption(this, 'questionResponseModel');
        display_mode = Marionette.getOption(this, 'display_mode');
        if (display_mode !== 'replay') {
          data.show_skip = true;
          data.allow_submit_answer = true;
          if (this.quizModel.hasPermission('allow_hint') && _.trim(data.hint)) {
            data.show_hint = true;
          }
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
            if ((_ref = responseModel.get('status')) !== 'skipped' && _ref !== 'paused') {
              data.show_skip = false;
            }
          }
          if (!data.allow_submit_answer) {
            data.allow_skip = false;
          }
        }
        return data;
      };

      SingleQuestionLayout.prototype.initialize = function() {
        return this.quizModel = Marionette.getOption(this, 'quizModel');
      };

      SingleQuestionLayout.prototype.onShow = function() {
        if (this.$el.find('#submit-question').length === 0) {
          if (this.model.id === parseInt(_.last(this.quizModel.get('content_pieces')))) {
            this.$el.find('#last_question').html('This is the last question');
          } else {
            this.$el.find('#next-question').show();
          }
        }
        if (parseInt(this.model.id) === parseInt(_.first(this.quizModel.get('content_pieces')))) {
          this.$el.find('#first_question').html('This is the first question');
          return this.$el.find('#previous-question').hide();
        }
      };

      SingleQuestionLayout.prototype.onAnswerValidated = function(isEmptyAnswer) {
        if (isEmptyAnswer) {
          if (confirm('You havent completed the question. Are you sure you want to continue?')) {
            return this.submitQuestion();
          }
        } else {
          return this.submitQuestion();
        }
      };

      SingleQuestionLayout.prototype.onSubmitQuestion = function() {
        if (this.model.get('comment')) {
          this.trigger('show:comment:dialog');
        }
        this.$el.find("#submit-question").hide();
        if (this.model.id === parseInt(_.last(this.quizModel.get('content_pieces')))) {
          this.$el.find('#last_question').html('This is the last question');
        } else {
          this.$el.find("#next-question").show();
        }
        return this.$el.find("#skip-question").hide();
      };

      return SingleQuestionLayout;

    })(Marionette.Layout);
  });
});
