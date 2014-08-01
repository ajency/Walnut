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

      SingleQuestionLayout.prototype.template = '<div id="content-board" class="quizContent no-margin"></div> <div class="well m-b-10 p-t-10 p-b-10 h-center quizActions"> <button type="button" id="previous-question" class="btn btn-info pull-left"> <i class="fa fa-backward"></i> Previous </button> {{#allow_submit_answer}} <button type="button" id="submit-question" class="btn btn-success pull-right"> Submit <i class="fa fa-forward"></i> </button> {{/allow_submit_answer}} <button type="button" style="display:none" id="next-question" class="btn btn-info pull-right"> Next <i class="fa fa-forward"></i> </button> {{#allow_skip}} <button type="button" id="skip-question" class="btn btn-default btn-sm btn-small h-center block"> <i class="fa fa-refresh"></i> Skip </button> {{/allow_skip}} {{#show_hint}} <button type="button" id="show-hint" class="btn btn-default btn-sm btn-small h-center block"> <i class="fa fa-refresh"></i> Show Hint </button> {{/show_hint}} <div class="clearfix"></div> </div> <div class="tiles grey text-grey b-grey b-b m-t-30 qstnInfo"> <div class="grid simple m-b-0 transparent"> <div class="grid-title no-border"> <p class="small-text bold inline text-grey"><span class="fa fa-question"></span> Question Info </p> </div> <div class="grid-body no-border"> <p class="bold inline text-grey">{{&instructions}}</p> </div> <div class="qstnInfoBod no-border m-t-10 p-b-5 p-r-20 p-l-20"> <p class=""></p> </div> </div> </div>';

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
        var display_mode, responseModel;
        responseModel = Marionette.getOption(this, 'questionResponseModel');
        display_mode = Marionette.getOption(this, 'display_mode');
        if (display_mode !== 'replay') {
          data.allow_submit_answer = true;
          if (this.quizModel.hasPermission('allow_skip')) {
            data.allow_skip = true;
          }
          if (this.quizModel.hasPermission('allow_hint') && _.trim(data.hint)) {
            data.show_hint = true;
          }
          if (responseModel) {
            if (responseModel.get('status') !== 'skipped') {
              data.allow_submit_answer = false;
            }
            if (this.quizModel.hasPermission('single_attempt')) {
              data.allow_submit_answer = false;
            }
            if (this.quizModel.hasPermission('allow_resubmit')) {
              data.allow_submit_answer = true;
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
          return this.$el.find('#next-question').show();
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

      SingleQuestionLayout.prototype.submitQuestion = function() {
        this.trigger("submit:question");
        if (this.model.get('comment')) {
          this.trigger('show:comment:dialog');
        }
        this.$el.find("#submit-question").hide();
        this.$el.find("#next-question").show();
        return this.$el.find("#skip-question").hide();
      };

      return SingleQuestionLayout;

    })(Marionette.Layout);
  });
});
