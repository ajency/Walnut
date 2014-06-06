var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/view-group/group-details/templates/group-details.html'], function(App, RegionController, collectionDetailsTpl) {
  return App.module("CollecionDetailsApp.Controller", function(Controller, App) {
    var CollectionDetailsView;
    Controller.ViewCollecionDetailsController = (function(_super) {
      __extends(ViewCollecionDetailsController, _super);

      function ViewCollecionDetailsController() {
        return ViewCollecionDetailsController.__super__.constructor.apply(this, arguments);
      }

      ViewCollecionDetailsController.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model, this.mode = opts.mode, this.questionResponseCollection = opts.questionResponseCollection, this.textbookNames = opts.textbookNames;
        this.view = view = this._getCollectionDetailsView();
        this.show(view, {
          loading: true,
          entities: [this.textbookNames]
        });
        return this.listenTo(view, 'start:teaching:module', (function(_this) {
          return function() {
            return _this.region.trigger("start:teaching:module");
          };
        })(this));
      };

      ViewCollecionDetailsController.prototype._getCollectionDetailsView = function() {
        var numOfQuestionsCompleted, terms, totalNumofQuestions;
        terms = this.model.get('term_ids');
        numOfQuestionsCompleted = _.size(this.questionResponseCollection.where({
          "status": "completed"
        }));
        totalNumofQuestions = _.size(this.model.get('content_pieces'));
        return new CollectionDetailsView({
          model: this.model,
          mode: this.mode,
          templateHelpers: this._getTemplateHelpers({
            terms: terms,
            numOfQuestionsCompleted: numOfQuestionsCompleted,
            totalNumofQuestions: totalNumofQuestions
          })
        });
      };

      ViewCollecionDetailsController.prototype._getTemplateHelpers = function(options) {
        return {
          showElapsedTime: (function(_this) {
            return function() {
              var display_time, hours, mins, seconds, time, timeTakenArray, totalTimeTakenForModule;
              timeTakenArray = _this.questionResponseCollection.pluck('time_taken');
              totalTimeTakenForModule = 0;
              if (_.size(timeTakenArray) > 0) {
                totalTimeTakenForModule = _.reduce(timeTakenArray, function(memo, num) {
                  return parseInt(memo + parseInt(num));
                });
              }
              hours = 0;
              time = totalTimeTakenForModule;
              mins = parseInt(totalTimeTakenForModule / 60);
              if (mins > 59) {
                hours = parseInt(mins / 60);
                mins = parseInt(mins % 60);
              }
              seconds = parseInt(time % 60);
              display_time = '';
              if (hours > 0) {
                display_time = hours + 'h ';
              }
              display_time += mins + 'm ' + seconds + 's';
              return display_time;
            };
          })(this),
          getProgressData: function() {
            return options.numOfQuestionsCompleted + '/' + options.totalNumofQuestions;
          },
          getProgressPercentage: function() {
            return parseInt((options.numOfQuestionsCompleted / options.totalNumofQuestions) * 100);
          },
          getTextbookName: (function(_this) {
            return function() {
              var texbookName, textbook;
              textbook = _this.textbookNames.get(options.terms.textbook);
              if (textbook != null) {
                return texbookName = textbook.get('name');
              }
            };
          })(this),
          getChapterName: (function(_this) {
            return function() {
              var chapter, chapterName;
              chapter = _this.textbookNames.get(options.terms.chapter);
              if (chapter != null) {
                return chapterName = chapter.get('name');
              }
            };
          })(this),
          startScheduleButton: (function(_this) {
            return function() {
              var actionButtons, allContentPieces, answeredIDs, answeredPieces, unanswered;
              actionButtons = '';
              allContentPieces = _this.model.get('content_pieces');
              allContentPieces = _.map(allContentPieces, function(m) {
                return parseInt(m);
              });
              answeredPieces = _this.questionResponseCollection.where({
                "status": "completed"
              });
              if (answeredPieces) {
                answeredIDs = _.chain(answeredPieces).map(function(m) {
                  return m.toJSON();
                }).pluck('content_piece_id').value();
              }
              answeredPieces = _this.questionResponseCollection.pluck('content_piece_id');
              unanswered = _.difference(allContentPieces, answeredIDs);
              if (_.size(unanswered) > 0 && _this.mode !== 'training') {
                actionButtons = '<button type="button" id="start-module" class="btn btn-success action pull-right m-t-10"> <i class="fa fa-play"></i> Start </button>';
              }
              return actionButtons;
            };
          })(this)
        };
      };

      return ViewCollecionDetailsController;

    })(RegionController);
    CollectionDetailsView = (function(_super) {
      __extends(CollectionDetailsView, _super);

      function CollectionDetailsView() {
        this.startModule = __bind(this.startModule, this);
        return CollectionDetailsView.__super__.constructor.apply(this, arguments);
      }

      CollectionDetailsView.prototype.template = collectionDetailsTpl;

      CollectionDetailsView.prototype.events = {
        'click #start-module': 'startModule'
      };

      CollectionDetailsView.prototype.serializeData = function() {
        var data;
        data = CollectionDetailsView.__super__.serializeData.call(this);
        data.takeClassModule = this.mode;
        data.isTraining = this.mode === 'training' ? true : false;
        data.isClass = this.mode === 'take-class' ? true : false;
        return data;
      };

      CollectionDetailsView.prototype.initialize = function() {
        return this.mode = Marionette.getOption(this, 'mode');
      };

      CollectionDetailsView.prototype.startModule = function() {
        var currentRoute;
        currentRoute = App.getCurrentRoute();
        App.navigate(currentRoute + "/question");
        return this.trigger("start:teaching:module");
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
