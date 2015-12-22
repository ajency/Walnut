var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/student-training-module/take-module/item-description/templates/top-panel.html'], function(App, TopPanelTemplate) {
  return App.module("StudentTrainingApp.TopPanel.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.TopPanelView = (function(superClass) {
      extend(TopPanelView, superClass);

      function TopPanelView() {
        this.countUp = bind(this.countUp, this);
        this.countDown = bind(this.countDown, this);
        return TopPanelView.__super__.constructor.apply(this, arguments);
      }

      TopPanelView.prototype.template = TopPanelTemplate;

      TopPanelView.prototype.events = function() {
        return {
          'click #top-panel-question-done': (function(_this) {
            return function() {
              return _this.trigger('top:panel:question:done');
            };
          })(this),
          'click #top-panel-previous': (function(_this) {
            return function() {
              return _this.trigger('top:panel:previous');
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
        $('.navbar').append('<div class="icon is-back go-back"><a onclick="location.reload();" href="javascript:" class="btn fab-content"><i class="fa fa-hand-o-left"></i>Back</a></div>');
        $('.navbar .container-fluid').css("visibility", "hidden");
        return this.mode = Marionette.getOption(this, 'display_mode');
      };

      TopPanelView.prototype.onShow = function() {
        var ref, timeLeftOrElapsed;
        $('.open-sidebar').click(function() {
          $('.video-sidebar').toggleClass('video-is-open');
        });
        if (this.model.get('question_type') === 'multiple_eval') {
          this.$el.find('#correct-answer-col').hide();
        }
        if ((ref = this.model.get('content_type')) === 'content_piece' || ref === 'student_question') {
          this.$el.find('#question-type-col, #correct-answer-col').hide();
        }
        if (this.model.get('content_type') !== 'student_question') {
          this.$el.find('#total-marks').hide();
        }
        timeLeftOrElapsed = Marionette.getOption(this, 'timeLeftOrElapsed');
        if (this.mode === 'class_mode') {
          if (timeLeftOrElapsed < 0) {
            this.countUp(timeLeftOrElapsed);
          } else {
            this.countDown(timeLeftOrElapsed);
          }
        }
        return this.trigger('top:panel:check:last:question');
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
        return console.log(marks);
      };

      return TopPanelView;

    })(Marionette.ItemView);
  });
});
