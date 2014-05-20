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
        this.view = view = this._getCollectionDetailsView(this.model);
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

      ViewCollecionDetailsController.prototype._getCollectionDetailsView = function(model) {
        var numOfQuestionsCompleted, terms, totalNumofQuestions;
        terms = model.get('term_ids');
        numOfQuestionsCompleted = _.size(this.questionResponseCollection.where({
          "status": "completed"
        }));
        totalNumofQuestions = _.size(model.get('content_pieces'));
        return new CollectionDetailsView({
          model: model,
          mode: this.mode,
          templateHelpers: {
            getProgressData: function() {
              return numOfQuestionsCompleted + '/' + totalNumofQuestions;
            },
            getProgressPercentage: function() {
              return parseInt((numOfQuestionsCompleted / totalNumofQuestions) * 100);
            },
            getTextbookName: (function(_this) {
              return function() {
                var texbookName, textbook;
                textbook = _this.textbookNames.get(terms.textbook);
                if (textbook != null) {
                  return texbookName = textbook.get('name');
                }
              };
            })(this),
            getChapterName: (function(_this) {
              return function() {
                var chapter, chapterName;
                chapter = _this.textbookNames.get(terms.chapter);
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
                answeredIDs = _.chain(answeredPieces).map(function(m) {
                  return m.toJSON();
                }).pluck('content_piece_id').value();
                answeredPieces = _this.questionResponseCollection.pluck('content_piece_id');
                unanswered = _.difference(allContentPieces, answeredIDs);
                if (_.size(unanswered) > 0 && _this.mode !== 'training') {
                  actionButtons = '<button type="button" id="start-module" class="btn btn-white btn-small action pull-right m-t-10"> <i class="fa fa-play"></i> Start </button>';
                }
                return actionButtons;
              };
            })(this)
          }
        });
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

      CollectionDetailsView.prototype.className = 'tiles white grid simple vertical green';

      CollectionDetailsView.prototype.events = {
        'click #start-module': 'startModule'
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
