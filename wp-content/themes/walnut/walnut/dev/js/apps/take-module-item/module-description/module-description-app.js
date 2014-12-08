var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/take-module-item/module-description/templates/module-description-template.html', 'bootbox'], function(App, RegionController, moduleDescriptionTemplate, bootbox) {
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
              var display_time;
              return display_time = $.timeMinSecs(totalTimeTakenForModule);
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
        this.onPauseSessionClick = __bind(this.onPauseSessionClick, this);
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
          return this.onPauseSessionClick();
        },
        'click #question-done': 'questionCompleted'
      };

      ModuleDescriptionView.prototype.onShow = function() {
        var stickyHeaderTop;
        if (!Marionette.getOption(this, 'nextItemID')) {
          this.$el.find("#question-done").html('<i class="fa fa-forward"></i> Finish Module');
        }
        if (this.model.get('post_status') === 'archive') {
          this.$el.find("#question-done").remove();
        }
        stickyHeaderTop = this.$el.find("#module-details-region").height();
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
          return this.cordovaEventsForModuleDescriptionView();
        }
      };

      ModuleDescriptionView.prototype.onPauseSessionClick = function() {
        if (_.platform() === 'BROWSER') {
          return this.trigger("goto:previous:route");
        } else {
          console.log('Invoked onPauseSessionClick');
          _.audioQueuesSelection('Click-Pause');
          this.trigger("goto:previous:route");
          _.clearMediaDirectory('videos-web');
          _.clearMediaDirectory('audio-web');
          return document.removeEventListener("backbutton", this.onPauseSessionClick, false);
        }
      };

      ModuleDescriptionView.prototype.cordovaEventsForModuleDescriptionView = function() {
        navigator.app.overrideBackbutton(true);
        document.addEventListener("backbutton", this.onPauseSessionClick, false);
        return document.addEventListener("pause", this.onPauseSessionClick, false);
      };

      ModuleDescriptionView.prototype.questionCompleted = function() {
        if (_.platform() === 'DEVICE') {
          _.audioQueuesSelection('Click-Next');
        }
        if (Marionette.getOption(this, 'display_mode') === 'class_mode') {
          return bootbox.confirm('This item will be marked as complete. Continue?', (function(_this) {
            return function(result) {
              if (result) {
                return _this.trigger("question:completed");
              }
            };
          })(this));
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
