var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module('ScheduleQuizPopup', function(ScheduleQuizPopup, App) {
    var ScheduleQuizView;
    ScheduleQuizPopup.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getScheduleQuizView = __bind(this._getScheduleQuizView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.division = options.division, this.quizModel = options.quizModel;
        this.view = this._getScheduleQuizView();
        this.show(this.view);
        this.listenTo(this.view, 'close:popup:dialog', function() {
          return this.region.closeDialog();
        });
        return this.listenTo(this.view, 'save:quiz:schedule', function(from, to) {
          var data, schedule;
          this.quizModel.set({
            'schedule_from': from,
            'schedule_to': to
          });
          data = {
            quiz_id: this.quizModel.id,
            division: this.division,
            schedule_from: from,
            schedule_to: to
          };
          schedule = App.request("save:quiz:schedule", data);
          return schedule.done((function(_this) {
            return function(response) {
              return _this.view.triggerMethod("schedule:saved", response);
            };
          })(this));
        });
      };

      Controller.prototype._getScheduleQuizView = function() {
        return new ScheduleQuizView({
          model: this.quizModel
        });
      };

      return Controller;

    })(RegionController);
    ScheduleQuizView = (function(_super) {
      __extends(ScheduleQuizView, _super);

      function ScheduleQuizView() {
        this.saveScheduled = __bind(this.saveScheduled, this);
        return ScheduleQuizView.__super__.constructor.apply(this, arguments);
      }

      ScheduleQuizView.prototype.template = '<form> <div class="row"> <div class="input-daterange"> <div class="col-md-6"> From: <br> <div class="input-append success date"> <input id="scheduleFrom" name="scheduleFrom" type="text" required="required" value="{{schedule_from}}" placeholder="Select Date" class="input-small span12"> <span class="add-on"><span class="arrow"></span><i class="fa fa-calendar"></i></span> </div> </div> <div class="col-md-6"> To:  <br> <div class="input-append success date"> <input id="scheduleTo" name="scheduleTo" type="text" required="required" value="{{schedule_to}}" placeholder="Select Date" class="input-small span12"> <span class="add-on"><span class="arrow"></span><i class="fa fa-calendar"></i></span> </div> </div> </div> <div class="row"> <div class="col-md-12"> <button type="button" class="clear btn btn-success m-t-20 pull-left">Schedule Quiz</button> <div class=" p-l-10 p-t-30 pull-left success-msg"></div> </div> </div> </div> </form>';

      ScheduleQuizView.prototype.events = {
        'click .btn-success': 'saveScheduled'
      };

      ScheduleQuizView.prototype.initialize = function() {
        return this.dialogOptions = {
          modal_title: 'Schedule Quiz',
          modal_size: 'small'
        };
      };

      ScheduleQuizView.prototype.onShow = function() {
        var today;
        today = new Date();
        return this.$el.find('.input-daterange').datepicker({
          todayHighlight: true,
          startDate: today,
          format: 'yyyy-mm-dd'
        }).on('hide', (function(_this) {
          return function(e) {
            if (e.target.id === 'scheduleFrom') {
              return _this.$el.find('#scheduleTo').datepicker('setStartDate', e.date);
            }
          };
        })(this));
      };

      ScheduleQuizView.prototype.saveScheduled = function(e) {
        var scheduleFrom, scheduleTo;
        if (this.$el.find('form').valid()) {
          scheduleFrom = this.$el.find('#scheduleFrom').val();
          scheduleTo = this.$el.find('#scheduleTo').val();
          return this.trigger("save:quiz:schedule", scheduleFrom, scheduleTo);
        }
      };

      ScheduleQuizView.prototype.onScheduleSaved = function(response) {
        this.$el.find('.success-msg').html('').removeClass('text-success, text-error');
        if (response.code === 'ERROR') {
          return this.$el.find('.success-msg').html('Failed to save schedule').addClass('text-error');
        } else {
          this.$el.find('.success-msg').html('Saved Successfully').addClass('text-success');
          return setTimeout((function(_this) {
            return function() {
              return _this.trigger('close:popup:dialog');
            };
          })(this), 500);
        }
      };

      return ScheduleQuizView;

    })(Marionette.ItemView);
    return App.commands.setHandler('show:schedule:quiz:popup', function(options) {
      return new ScheduleQuizPopup.Controller(options);
    });
  });
});
