var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'text!apps/take-module-item/module-description/templates/module-description-template.html', 'bootbox'], function(App, RegionController, moduleDescriptionTemplate, bootbox) {
  return App.module("StudentTrainingApp.ModuleDescription", function(ModuleDescription, App) {
    var ModuleDescriptionController, ModuleDescriptionView;
    ModuleDescriptionController = (function(superClass) {
      extend(ModuleDescriptionController, superClass);

      function ModuleDescriptionController() {
        this._showModuleDescriptionView = bind(this._showModuleDescriptionView, this);
        this._getNextItemID = bind(this._getNextItemID, this);
        this._changeQuestion = bind(this._changeQuestion, this);
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
        this.listenTo(this.region, "top:panel:question:done", (function(_this) {
          return function() {
            return _this.view.triggerMethod("top:panel:question:done");
          };
        })(this));
        this.listenTo(this.region, "top:panel:check:last:question", (function(_this) {
          return function() {
            return _this.view.triggerMethod("top:panel:check:last:question");
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
        var contentLayout, contentPieces, nextItemID, pieceIndex;
        contentLayout = this.model.get('content_layout');
        contentPieces = _.map(contentLayout, function(m) {
          return parseInt(m.id);
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
    ModuleDescriptionView = (function(superClass) {
      extend(ModuleDescriptionView, superClass);

      function ModuleDescriptionView() {
        this.decidePageFlip = bind(this.decidePageFlip, this);
        this.questionCompleted = bind(this.questionCompleted, this);
        this.onTopPanelQuestionDone = bind(this.onTopPanelQuestionDone, this);
        return ModuleDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionView.prototype.className = 'pieceWrapper';

      ModuleDescriptionView.prototype.template = moduleDescriptionTemplate;

      ModuleDescriptionView.prototype.mixinTemplateHelpers = function(data) {
        data = ModuleDescriptionView.__super__.mixinTemplateHelpers.call(this, data);
        data.name = data.name.replace("Lecture -", "");
        data.isTraining = this.display_mode === 'training' ? true : false;
        return data;
      };

      ModuleDescriptionView.prototype.initialize = function() {
        this.display_mode = Marionette.getOption(this, 'display_mode');
        return this.isLastContentPiece = false;
      };

      ModuleDescriptionView.prototype.events = {
        'click #back-to-module, #pause-session': function() {
          return this.trigger("goto:previous:route");
        },
        'click #question-done': 'questionCompleted'
      };

      ModuleDescriptionView.prototype.onShow = function() {
        var stickyHeaderTop;
        if (!Marionette.getOption(this, 'nextItemID')) {
          this.isLastContentPiece = true;
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
        $('#collapseView').on('hidden.bs.collapse', function() {
          return $('#accordionToggle').text('Expand');
        });
        return $('#collapseView').on('shown.bs.collapse', function() {
          return $('#accordionToggle').text('Collapse');
        });
      };

      ModuleDescriptionView.prototype.onTopPanelQuestionDone = function() {
        return this.questionCompleted();
      };

      ModuleDescriptionView.prototype.questionCompleted = function() {
        if (Marionette.getOption(this, 'display_mode') === 'class_mode') {
          return bootbox.confirm('This item will be marked as complete. Continue?', (function(_this) {
            return function(result) {
              if (result) {
                return _this.decidePageFlip();
              }
            };
          })(this));
        } else {
          return this.decidePageFlip();
        }
      };

      ModuleDescriptionView.prototype.decidePageFlip = function() {
        if (this.isLastContentPiece) {
          return this.trigger("question:completed");
        } else {
          return this.trigger("question:completed");
        }
      };

      ModuleDescriptionView.prototype.onQuestionChanged = function(nextItemID) {
        if (!nextItemID) {
          this.isLastContentPiece = true;
          return this.$el.find("#question-done").html('<i class="fa fa-forward"></i> Finish Module');
        }
      };

      ModuleDescriptionView.prototype.onTopPanelCheckLastQuestion = function() {
        if (this.isLastContentPiece) {
          return $("#top-panel-question-done").html("<img src='wp-content/themes/walnut/walnut_student_assets/dev/images/stop.png' class='img-reponsive center-block'/><h4>Finish Module</h4>");
        }
      };

      return ModuleDescriptionView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:student:training:module:description", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ModuleDescriptionController(opt);
    });
  });
});
