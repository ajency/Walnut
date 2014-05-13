var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/teacher-teaching-module/module-description/templates/module-description-template.html'], function(App, RegionController, moduleDescriptionTemplate) {
  return App.module("TeacherTeachingApp.ModuleDescription", function(ModuleDescription, App) {
    var ModuleDescriptionController, ModuleDescriptionView;
    ModuleDescriptionController = (function(_super) {
      __extends(ModuleDescriptionController, _super);

      function ModuleDescriptionController() {
        this._showModuleDescriptionView = __bind(this._showModuleDescriptionView, this);
        return ModuleDescriptionController.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionController.prototype.initialize = function(opts) {
        var model, view;
        model = opts.model, this.questionResponseModel = opts.questionResponseModel, this.questionResponseCollection = opts.questionResponseCollection, this.timerObject = opts.timerObject;
        this.view = view = this._showModuleDescriptionView(model);
        this.show(view, {
          loading: true
        });
        return this.listenTo(this.view, "goto:previous:route", (function(_this) {
          return function() {
            var elapsedTime;
            if (_this.questionResponseModel.get('status') !== 'completed') {
              elapsedTime = _this.timerObject.request("get:elapsed:time");
              _this.questionResponseModel.set({
                'time_taken': elapsedTime,
                'status': 'paused'
              });
              _this.questionResponseModel.save();
            }
            return _this.region.trigger("goto:previous:route");
          };
        })(this));
      };

      ModuleDescriptionController.prototype._showModuleDescriptionView = function(model) {
        var numOfQuestionsCompleted, terms, totalNumofQuestions, totalTimeTakenForModule;
        terms = model.get('term_ids');
        numOfQuestionsCompleted = _.size(this.questionResponseCollection.where({
          "status": "completed"
        }));
        totalNumofQuestions = _.size(model.get('content_pieces'));
        totalTimeTakenForModule = _.reduce(this.questionResponseCollection.pluck('time_taken'), function(memo, num) {
          return parseInt(memo + parseInt(num));
        });
        console.log(totalTimeTakenForModule);
        return new ModuleDescriptionView({
          model: model,
          templateHelpers: {
            getProgressData: function() {
              return numOfQuestionsCompleted + '/' + totalNumofQuestions;
            },
            getProgressPercentage: function() {
              return parseInt((numOfQuestionsCompleted / totalNumofQuestions) * 100);
            },
            moduleTime: function() {
              var hours, mins, seconds, time;
              hours = 0;
              time = totalTimeTakenForModule;
              mins = parseInt(time / 60);
              if (mins > 59) {
                hours = parseInt(mins / 60);
                mins = mins % 60;
              }
              seconds = time % 60;
              return time = hours + 'h ' + mins + 'm ' + seconds + 's';
            }
          }
        });
      };

      return ModuleDescriptionController;

    })(RegionController);
    ModuleDescriptionView = (function(_super) {
      __extends(ModuleDescriptionView, _super);

      function ModuleDescriptionView() {
        this.updateTime = __bind(this.updateTime, this);
        return ModuleDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionView.prototype.className = 'pieceWrapper';

      ModuleDescriptionView.prototype.template = moduleDescriptionTemplate;

      ModuleDescriptionView.prototype.events = {
        'click #back-to-module, #pause-session': function() {
          return this.trigger("goto:previous:route");
        }
      };

      ModuleDescriptionView.prototype.onShow = function() {
        var clock;
        return clock = setInterval(this.updateTime, 500);
      };

      ModuleDescriptionView.prototype.updateTime = function() {
        if (_.size($('#timekeeper')) > 0) {
          return this.$el.find('.timedisplay').html('<i class="fa fa-clock-o"></i> ' + $('#timekeeper').html());
        }
      };

      return ModuleDescriptionView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:teacher:teaching:module:description", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ModuleDescriptionController(opt);
    });
  });
});
