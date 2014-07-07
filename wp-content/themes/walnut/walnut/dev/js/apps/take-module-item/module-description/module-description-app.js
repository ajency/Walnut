var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/take-module-item/module-description/templates/module-description-template.html'], function(App, RegionController, moduleDescriptionTemplate) {
  return App.module("TeacherTeachingApp.ModuleDescription", function(ModuleDescription, App) {
    var ModuleDescriptionController, ModuleDescriptionView;
    ModuleDescriptionController = (function(_super) {
      __extends(ModuleDescriptionController, _super);

      function ModuleDescriptionController() {
        this._showModuleDescriptionView = __bind(this._showModuleDescriptionView, this);
        this._getNextItemID = __bind(this._getNextItemID, this);
        this._changeQuestion = __bind(this._changeQuestion, this);
        return ModuleDescriptionController.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionController.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model, this.questionResponseModel = opts.questionResponseModel, this.questionResponseCollection = opts.questionResponseCollection, this.timerObject = opts.timerObject, this.display_mode = opts.display_mode;
        this.currentItemID = this.questionResponseModel.get('content_piece_id');
        this.nextItemID = this._getNextItemID(this.currentItemID);
        this.view = view = this._showModuleDescriptionView(this.model);
        this.show(view, {
          loading: true,
          entities: [this.model, this.questionResponseModel]
        });
        this.listenTo(this.view, "goto:previous:route", (function(_this) {
          return function() {
            return _this.region.trigger("goto:previous:route");
          };
        })(this));
        return this.listenTo(view, "question:completed", this._changeQuestion);
      };

      ModuleDescriptionController.prototype._changeQuestion = function() {
        this.region.trigger("goto:next:question");
        this.nextItemID = this._getNextItemID(this.nextItemID);
        return this.view.triggerMethod("question:changed", this.nextItemID);
      };

      ModuleDescriptionController.prototype._getNextItemID = function(item_id) {
        var contentPieces, nextItemID, pieceIndex;
        contentPieces = this.model.get('content_pieces');
        contentPieces = _.map(contentPieces, function(m) {
          return parseInt(m);
        });
        pieceIndex = _.indexOf(contentPieces, item_id);
        nextItemID = parseInt(contentPieces[pieceIndex + 1]);
        if (!nextItemID) {
          nextItemID = false;
        }
        return nextItemID;
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
          display_mode: this.display_mode,
          nextItemID: this.nextItemID,
          templateHelpers: {
            showPauseButton: (function(_this) {
              return function() {
                var pauseBtn;
                pauseBtn = '';
                if (_this.display_mode === 'class_mode') {
                  pauseBtn = '<button type="button" id="pause-session" class="btn btn-white action h-center block m-t-5"><i class="fa fa-pause"></i> Pause</button>';
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
        this.questionCompleted = __bind(this.questionCompleted, this);
        return ModuleDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionView.prototype.className = 'pieceWrapper';

      ModuleDescriptionView.prototype.template = moduleDescriptionTemplate;

      ModuleDescriptionView.prototype.mixinTemplateHelpers = function(data) {
        data = ModuleDescriptionView.__super__.mixinTemplateHelpers.call(this, data);
        data.isTraining = this.display_mode === 'training' ? true : false;
        return data;
      };

      ModuleDescriptionView.prototype.initialize = function() {
        return this.display_mode = Marionette.getOption(this, 'display_mode');
      };

      ModuleDescriptionView.prototype.events = {
        'click #back-to-module, #pause-session': function() {
          return this.trigger("goto:previous:route");
        },
        'click #question-done': 'questionCompleted'
      };

      ModuleDescriptionView.prototype.onShow = function() {
        var onBackbuttonClick, stickyHeaderTop;
        if (!Marionette.getOption(this, 'nextItemID')) {
          this.$el.find("#question-done").html('<i class="fa fa-forward"></i> Finish Module');
        }
        if (this.model.get('status') === 'archive') {
          this.$el.find("#question-done").remove();
        }
        stickyHeaderTop = $("#module-details-region").height();
        $(window).scroll(function() {
          if ($(window).scrollTop() > stickyHeaderTop) {
            $("#module-details-region").addClass("condensed animated slideInDown");
            $("#question-details-region").css("margin-top", stickyHeaderTop + 15);
          } else {
            $("#module-details-region").removeClass("condensed slideInDown");
            $("#question-details-region").css("margin-top", 0);
          }
        });
        if (_.platform() === 'DEVICE') {
          $('body').css({
            'height': 'auto'
          });
          document.addEventListener("pause", (function(_this) {
            return function() {
              console.log('Fired cordova pause event for module-description');
              _this.trigger("goto:previous:route");
              return _.clearVideosWebDirectory();
            };
          })(this), false);
          onBackbuttonClick = (function(_this) {
            return function() {
              console.log('Fired cordova back button event for module-description');
              _this.trigger("goto:previous:route");
              _.clearVideosWebDirectory();
              return document.removeEventListener("backbutton", onBackbuttonClick, false);
            };
          })(this);
          navigator.app.overrideBackbutton(true);
          return document.addEventListener("backbutton", onBackbuttonClick, false);
        }
      };

      ModuleDescriptionView.prototype.questionCompleted = function() {
        if (Marionette.getOption(this, 'display_mode') === 'class_mode') {
          if (confirm('This item will be marked as complete. Continue?')) {
            return this.trigger("question:completed");
          }
        } else {
          return this.trigger("question:completed");
        }
      };

      ModuleDescriptionView.prototype.onQuestionChanged = function(nextItemID) {
        if (!nextItemID) {
          return this.$el.find("#question-done").html('<i class="fa fa-forward"></i> Finish Module');
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
