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
        model = opts.model, this.questionResponseModel = opts.questionResponseModel, this.questionResponseCollection = opts.questionResponseCollection, this.timerObject = opts.timerObject, this.display_mode = opts.display_mode;
        this.view = view = this._showModuleDescriptionView(model);
        this.show(view, {
          loading: true
        });
        return this.listenTo(this.view, "goto:previous:route", (function(_this) {
          return function() {
            return _this.region.trigger("goto:previous:route");
          };
        })(this));
      };

      ModuleDescriptionController.prototype._showModuleDescriptionView = function(model) {
        var numOfQuestionsCompleted, terms, timeTakenArray, totalNumofQuestions, totalTimeTakenForModule;
        terms = model.get('term_ids');
        numOfQuestionsCompleted = _.size(this.questionResponseCollection.where({
          "status": "completed"
        }));
        totalNumofQuestions = _.size(model.get('content_pieces'));
        timeTakenArray = this.questionResponseCollection.pluck('time_taken');
        totalTimeTakenForModule = 0;
        if (_.size(timeTakenArray) > 0) {
          totalTimeTakenForModule = _.reduce(timeTakenArray, function(memo, num) {
            return parseInt(memo + parseInt(num));
          });
        }
        return new ModuleDescriptionView({
          model: model,
          mode: this.display_mode,
          templateHelpers: {
            showPauseButton: (function(_this) {
              return function() {
                var pauseBtn;
                pauseBtn = '';
                if (_this.display_mode === 'class_mode') {
                  pauseBtn = '<button type="button" id="pause-session" class="btn btn-white  action pull-right m-t-5 m-l-20"><i class="fa fa-pause"></i> Pause</button>';
                }
                return pauseBtn;
              };
            })(this),
            getProgressData: function() {
              return numOfQuestionsCompleted + '/' + totalNumofQuestions;
            },
            getProgressPercentage: function() {
              return parseInt((numOfQuestionsCompleted / totalNumofQuestions) * 100);
            },
            moduleTime: function() {
              var display_time, hours, mins, seconds, time;
              hours = 0;
              time = totalTimeTakenForModule;
              mins = parseInt(time / 60);
              if (mins > 59) {
                hours = parseInt(mins / 60);
                mins = parseInt(mins % 60);
              }
              seconds = parseInt(time % 60);
              display_time = '';
              if (hours > 0) {
                display_time = hours + 'h ';
              }
              return display_time += mins + 'm ' + seconds + 's';
            }
          }
        });
      };

      return ModuleDescriptionController;

    })(RegionController);
    ModuleDescriptionView = (function(_super) {
      __extends(ModuleDescriptionView, _super);

      function ModuleDescriptionView() {
        return ModuleDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionView.prototype.className = 'pieceWrapper';

      ModuleDescriptionView.prototype.template = moduleDescriptionTemplate;

      ModuleDescriptionView.prototype.mixinTemplateHelpers = function(data) {
        data = ModuleDescriptionView.__super__.mixinTemplateHelpers.call(this, data);
        data.isTraining = this.mode === 'training' ? true : false;
        return data;
      };

      ModuleDescriptionView.prototype.initialize = function() {
        return this.mode = Marionette.getOption(this, 'mode');
      };

      ModuleDescriptionView.prototype.events = {
        'click #back-to-module, #pause-session': function() {
          return this.trigger("goto:previous:route");
        }
      };

      ModuleDescriptionView.prototype.onShow = function() {
        var onBackbuttonClick;
        onBackbuttonClick = (function(_this) {
          return function() {
            console.log('Fired cordova back button event');
            _this.trigger("goto:previous:route");
            return document.removeEventListener("backbutton", onBackbuttonClick, false);
          };
        })(this);
        if (_.platform() === 'DEVICE') {
          document.addEventListener("backbutton", onBackbuttonClick, false);
          return document.addEventListener("pause", (function(_this) {
            return function() {
              console.log('Fired cordova pause event');
              return _this.trigger("goto:previous:route");
            };
          })(this), false);
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
