var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.ContentBoardView = (function(_super) {
      __extends(ContentBoardView, _super);

      function ContentBoardView() {
        return ContentBoardView.__super__.constructor.apply(this, arguments);
      }

      ContentBoardView.prototype.template = '<div id="question-area"></div> <div id="feedback-area"> <div id="correct" class="alert alert-success text-center answrMsg"> <h3 class="bold">You are right!</h3> <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4> </div> <div id="wrong" class="alert alert-error text-center answrMsg"> <h3 class="bold"> Sorry, you did not get this right.</h3> <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4> </div> <div id="partially-correct" class="alert alert-info text-center answrMsg"> <h3 class="bold">Well you are almost right.</h3> <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4> </div> </div>';

      ContentBoardView.prototype.onRender = function() {
        this.$el.attr('id', 'myCanvas');
        return this.$el.find('#feedback-area div').hide();
      };

      ContentBoardView.prototype.onShowResponse = function(marks, total) {
        this.$el.find('.total-marks').text(total);
        this.$el.find('.marks').text(marks);
        if (marks === 0) {
          this.$el.find('#feedback-area div').hide();
          this.$el.find('#wrong').show();
        }
        if (marks === total) {
          this.$el.find('#feedback-area div').hide();
          this.$el.find('#correct').show();
        }
        if (marks > 0 && marks < total) {
          this.$el.find('#feedback-area div').hide();
          return this.$el.find('#partially-correct').show();
        }
      };

      return ContentBoardView;

    })(Marionette.ItemView);
  });
});
