var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/take-module-item/item-description/templates/top-panel.html'], function(App, TopPanelTemplate) {
  return App.module("ContentPreview.TopPanel.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.TopPanelView = (function(_super) {
      __extends(TopPanelView, _super);

      function TopPanelView() {
        this.countUp = __bind(this.countUp, this);
        this.countDown = __bind(this.countDown, this);
        return TopPanelView.__super__.constructor.apply(this, arguments);
      }

      TopPanelView.prototype.template = TopPanelTemplate;

      TopPanelView.prototype.events = function() {
        return {
          'click #top-panel-question-done': (function(_this) {
            return function() {
              return _this.trigger('top:panel:question:done');
            };
          })(this)
        };
      };

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
        var timeLeftOrElapsed, _ref;
        if (this.model.get('question_type') === 'multiple_eval') {
          this.$el.find('#correct-answer-col').hide();
        }
        if ((_ref = this.model.get('content_type')) === 'content_piece' || _ref === 'student_question') {
          this.$el.find('#question-type-col, #correct-answer-col').hide();
        }
        if (this.model.get('content_type') !== 'student_question') {
          this.$el.find('#total-marks').hide();
        }
        timeLeftOrElapsed = Marionette.getOption(this, 'timeLeftOrElapsed');
        if (this.mode === 'class_mode') {
          if (timeLeftOrElapsed < 0) {
            return this.countUp(timeLeftOrElapsed);
          } else {
            return this.countDown(timeLeftOrElapsed);
          }
        }
      };

      TopPanelView.prototype.countDown = function(time) {
        return this.$el.find('#downUpTimer').attr('timerdirection', 'countDown').countdown('destroy').countdown({
          until: time,
          format: 'MS',
          onExpiry: this.countUp
        });
      };

      TopPanelView.prototype.countUp = function(time) {
        if (time == null) {
          time = 0;
        }
        return this.$el.find('#downUpTimer').attr('timerdirection', 'countUp').addClass('negative').countdown('destroy').countdown({
          since: time,
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
