var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-preview/top-panel/templates/top-panel.html'], function(App, TopPanelTemplate) {
  return App.module("ContentPreview.TopPanel.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.TopPanelView = (function(_super) {
      __extends(TopPanelView, _super);

      function TopPanelView() {
        return TopPanelView.__super__.constructor.apply(this, arguments);
      }

      TopPanelView.prototype.template = TopPanelTemplate;

      TopPanelView.prototype.mixinTemplateHelpers = function(data) {
        data = TopPanelView.__super__.mixinTemplateHelpers.call(this, data);
        if (data.question_type === 'multiple_eval') {
          data.question_type = 'multiple Evaluation';
        }
        data.isTraining = this.mode === 'training' ? true : false;
        return data;
      };

      TopPanelView.prototype.initialize = function() {
        return this.mode = Marionette.getOption(this, 'display_mode');
      };

      TopPanelView.prototype.onShow = function() {
        var timeLeftOrElapsed;
        if (this.model.get('question_type') === 'multiple_eval') {
          this.$el.find('#correct-answer-col').hide();
        }
        if (this.model.get('content_type') === 'content_piece') {
          this.$el.find('#question-type-col, #correct-answer-col').hide();
        }
        if (this.model.get('content_type') !== 'student_question') {
          this.$el.find('#total-marks').hide();
        }
        timeLeftOrElapsed = Marionette.getOption(this, 'timeLeftOrElapsed');
        if (this.mode === 'class_mode') {
          return $('#downUpTimer').countdown({
            until: timeLeftOrElapsed,
            format: 'MS',
            onExpiry: this.countUp
          });
        }
      };

      TopPanelView.prototype.countUp = function() {
        $('#downUpTimer').countdown('destroy');
        return $('#downUpTimer').countdown({
          since: -0,
          format: 'MS'
        });
      };

      TopPanelView.prototype.onShowTotalMarks = function(marks) {
        console.log(marks);
        return console.log(this.$el.find('#total-marks span').text(marks));
      };

      return TopPanelView;

    })(Marionette.ItemView);
  });
});
