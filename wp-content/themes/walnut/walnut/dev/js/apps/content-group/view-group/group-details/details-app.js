var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/view-group/group-details/templates/group-details.html'], function(App, RegionController, collectionDetailsTpl) {
  return App.module("CollecionDetailsApp.Controller", function(Controller, App) {
    var CollectionDetailsView;
    Controller.ViewCollecionDetailsController = (function(_super) {
      __extends(ViewCollecionDetailsController, _super);

      function ViewCollecionDetailsController() {
        this.trainingModuleStopped = __bind(this.trainingModuleStopped, this);
        this.trainingModuleStarted = __bind(this.trainingModuleStarted, this);
        return ViewCollecionDetailsController.__super__.constructor.apply(this, arguments);
      }

      ViewCollecionDetailsController.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model, this.mode = opts.mode, this.questionResponseCollection = opts.questionResponseCollection;
        this.startTime = '';
        this.endTime = '';
        this.view = view = this._getCollectionDetailsView(this.model);
        this.show(view, {
          loading: true
        });
        this.listenTo(view, 'start:teaching:module', (function(_this) {
          return function() {
            return _this.region.trigger("start:teaching:module");
          };
        })(this));
        this.listenTo(this.model, 'training:module:started', this.trainingModuleStarted);
        return this.listenTo(this.model, 'training:module:stopped', this.trainingModuleStopped);
      };

      ViewCollecionDetailsController.prototype._getCollectionDetailsView = function(model) {
        var terms, textbook;
        terms = model.get('term_ids');
        textbook = terms.textbook;
        this.textbookName = App.request("get:textbook:name:by:id", textbook);
        return new CollectionDetailsView({
          model: model,
          mode: this.mode,
          templateHelpers: {
            getTextbookName: (function(_this) {
              return function() {
                return _this.textbookName;
              };
            })(this),
            startScheduleButton: (function(_this) {
              return function() {
                var actionButtons, allContentPieces, answeredPieces, unanswered;
                actionButtons = '';
                allContentPieces = _this.model.get('content_pieces');
                answeredPieces = _this.questionResponseCollection.pluck('content_piece_id');
                unanswered = _.difference(allContentPieces, answeredPieces);
                if (_.size(unanswered) > 0 && _this.mode !== 'training') {
                  actionButtons = '<button type="button" id="start-module" class="btn btn-white btn-small action pull-right m-t-10"> <i class="fa fa-play"></i> Start </button> <button type="button" class="btn btn-white btn-small pull-right m-t-10 m-r-10" data-toggle="modal" data-target="#schedule"> <i class="fa fa-calendar"></i> Schedule </button>';
                }
                return actionButtons;
              };
            })(this)
          }
        });
      };

      ViewCollecionDetailsController.prototype.trainingModuleStarted = function() {
        this.startTime = moment().format();
        return this.view.triggerMethod("display:time");
      };

      ViewCollecionDetailsController.prototype.trainingModuleStopped = function() {
        this.endTime = moment().format();
        return this.view.triggerMethod("stop:training:module");
      };

      return ViewCollecionDetailsController;

    })(RegionController);
    CollectionDetailsView = (function(_super) {
      __extends(CollectionDetailsView, _super);

      function CollectionDetailsView() {
        this.updateTime = __bind(this.updateTime, this);
        this.stopModule = __bind(this.stopModule, this);
        this.startModule = __bind(this.startModule, this);
        return CollectionDetailsView.__super__.constructor.apply(this, arguments);
      }

      CollectionDetailsView.prototype.template = collectionDetailsTpl;

      CollectionDetailsView.prototype.className = 'tiles white grid simple vertical green';

      CollectionDetailsView.prototype.events = {
        'click #start-module': 'startModule',
        'click #stop-module': 'stopModule'
      };

      CollectionDetailsView.prototype.onShow = function() {
        if (_.size($('#timekeeper')) > 0) {
          return this.onDisplayTime();
        }
      };

      CollectionDetailsView.prototype.serializeData = function() {
        var data;
        data = CollectionDetailsView.__super__.serializeData.call(this);
        data.takeClassModule = Marionette.getOption(this, 'mode');
        return data;
      };

      CollectionDetailsView.prototype.startModule = function() {
        var currentRoute;
        currentRoute = App.getCurrentRoute();
        App.navigate(currentRoute + "/question");
        this.model.trigger("start:module");
        return this.trigger("start:teaching:module");
      };

      CollectionDetailsView.prototype.stopModule = function() {
        $('#timekeeper').timer('pause');
        this.$el.find('#stop-module').attr('id', 'start-module').html('<i class="fa fa-play"></i> Resume ');
        return this.model.trigger("stop:module");
      };

      CollectionDetailsView.prototype.onDisplayTime = function() {
        var clock;
        this.$el.find('#start-module').attr('id', 'stop-module').html('<i class="fa fa-pause"></i> Pause ');
        if (!_.size($('#timekeeper')) > 0) {
          $("#header-left").after("<div id='timekeeper' style='display:none'></div>");
          $('#timekeeper').timer('start');
        } else {
          $('#timekeeper').timer('resume');
        }
        return clock = setInterval(this.updateTime, 500);
      };

      CollectionDetailsView.prototype.updateTime = function() {
        return this.$el.find('.timedisplay').html('Elapsed Time: ' + $('#timekeeper').html());
      };

      return CollectionDetailsView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:viewgroup:content:group:detailsapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.ViewCollecionDetailsController(opt);
    });
  });
});
