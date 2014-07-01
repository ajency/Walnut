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
        var qTime, qTimer, timerColor;
        if (this.model.get('question_type') === 'multiple_eval') {
          this.$el.find('#correct-answer-col').hide();
        }
        if (this.model.get('content_type') === 'content_piece') {
          this.$el.find('#question-type-col, #correct-answer-col').hide();
        }
        if (this.mode === 'class_mode') {
          qTimer = this.$el.find('div.cpTimer');
          qTime = qTimer.data('timer');
          timerColor = '#1ec711';
          if (qTime < 10) {
            timerColor = '#f8a616';
          }
          if (qTime < 0) {
            timerColor = '#ea0d0d';
          }
          return qTimer.TimeCircles({
            time: {
              Days: {
                show: false
              },
              Hours: {
                show: false
              },
              Minutes: {
                color: timerColor
              },
              Seconds: {
                color: timerColor
              }
            },
            circle_bg_color: "#d6d5d4",
            bg_width: 0.2,
            fg_width: 0.02,
            animation: "ticks"
          }).addListener(function(unit, value, total) {
            if (total === 10) {
              qTimer.data('timer', 10);
              return qTimer.TimeCircles({
                time: {
                  Days: {
                    show: false
                  },
                  Hours: {
                    show: false
                  },
                  Minutes: {
                    color: '#f8a616'
                  },
                  Seconds: {
                    color: '#f8a616'
                  }
                }
              });
            } else if (total === 5) {
              return console.log('The expected time for this question is almost over.');
            } else if (total === -1) {
              return qTimer.TimeCircles({
                time: {
                  Days: {
                    show: false
                  },
                  Hours: {
                    show: false
                  },
                  Minutes: {
                    color: '#ea0d0d'
                  },
                  Seconds: {
                    color: '#ea0d0d'
                  }
                }
              });
            }
          });
        }
      };

      return TopPanelView;

    })(Marionette.ItemView);
  });
});
