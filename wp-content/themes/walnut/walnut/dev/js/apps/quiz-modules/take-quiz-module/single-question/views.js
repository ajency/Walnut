var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("TakeQuizApp.SingleQuestion", function(SingleQuestion, App) {
    return SingleQuestion.SingleQuestionLayout = (function(_super) {
      __extends(SingleQuestionLayout, _super);

      function SingleQuestionLayout() {
        return SingleQuestionLayout.__super__.constructor.apply(this, arguments);
      }

      SingleQuestionLayout.prototype.template = '<div id="content-board" class="quizContent no-margin"></div> <div class="well m-b-10 p-t-10 p-b-10 h-center quizActions"> <button type="button" id="previous-question" class="btn btn-info pull-left"> <i class="fa fa-backward"></i> Previous </button> <button type="button" id="submit-question" class="btn btn-success pull-right"> Submit <i class="fa fa-forward"></i> </button> <button type="button" style="display:none" id="next-question" class="btn btn-info pull-right"> Next <i class="fa fa-forward"></i> </button> <button type="button" id="skip-question" class="btn btn-default btn-sm btn-small h-center block"> <i class="fa fa-refresh"></i> Skip </button> <div class="clearfix"></div> </div> <div class="tiles grey text-grey b-grey b-b m-t-30 qstnInfo"> <div class="grid simple m-b-0 transparent"> <div class="grid-title no-border"> <p class="small-text bold inline text-grey"><span class="fa fa-question"></span> Question Info </p> </div> <div class="grid-body no-border"> <p class="bold inline text-grey">{{&instructions}}</p> </div> <div class="qstnInfoBod no-border m-t-10 p-b-5 p-r-20 p-l-20"> <p class=""></p> </div> </div> </div>';

      SingleQuestionLayout.prototype.regions = {
        contentBoardRegion: '#content-board'
      };

      SingleQuestionLayout.prototype.events = {
        'click #submit-question': 'submitQuestion',
        'click #previous-question': function() {
          return this.trigger("goto:previous:question");
        },
        'click #skip-question': function() {
          return this.trigger("skip:question");
        },
        'click #next-question': function() {
          return this.trigger("goto:next:question");
        }
      };

      SingleQuestionLayout.prototype.submitQuestion = function() {
        this.trigger("submit:question");
        if (this.model.get('comment_enable')) {
          this.trigger('show:comment:dialog', {
            comment: this.model.get('comment')
          });
        }
        this.$el.find("#submit-question").hide();
        this.$el.find("#next-question").show();
        return this.$el.find("#skip-question").hide();
      };

      return SingleQuestionLayout;

    })(Marionette.Layout);
  });
});
