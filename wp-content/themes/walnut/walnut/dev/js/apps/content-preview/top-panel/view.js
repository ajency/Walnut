var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentPreview.TopPanel.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.TopPanelView = (function(_super) {
      __extends(TopPanelView, _super);

      function TopPanelView() {
        return TopPanelView.__super__.constructor.apply(this, arguments);
      }

      TopPanelView.prototype.template = '<div class="tiles white grid simple vertical blue m-b-0"> <div class="grid-body no-border"> <div class="p-t-10"> <div class="row"> <div class="col-sm-8"> <div class="row m-b-10"> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Class</label> {{getClass}} </div> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Textbook</label> {{getTextbookName}} </div> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Chapter</label> {{getChapterName}} </div> </div> <div class="row"> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Section</label> {{getSectionsNames}} </div> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Sub-Section</label> {{getSubSectionsNames}} </div> <div class="col-xs-4 b-grey b-r"> <label class="form-label bold small-text">Type</label> <span style="text-transform: capitalize">{{question_type}}</span> </div> </div> </div> <div class="col-sm-4"> <label style="text-align:center" class="form-label bold small-text">Content Piece Timer</label> <div class="cpTimer" data-timer="{{timeLeftOrElapsed}}"></div> {{&getCompletedSummary}} </div> </div> </div> </div>';

      TopPanelView.prototype.onShow = function() {
        var qTime, qTimer, timerColor;
        console.log(Marionette.getOption(this, 'display_mode'));
        if (Marionette.getOption(this, 'display_mode') === 'class_mode') {
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
            circle_bg_color: "#EBEEF1",
            bg_width: 0.2
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
