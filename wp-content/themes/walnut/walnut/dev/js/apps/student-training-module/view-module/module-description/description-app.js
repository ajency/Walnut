var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'controllers/region-controller', 'text!apps/student-training-module/view-module/module-description/templates/module-description.html'], function(App, RegionController, collectionDetailsTpl) {
  return App.module("StudentTrainingApp.Controller", function(Controller, App) {
    var CollectionDetailsView;
    Controller.ViewCollecionDetailsController = (function(superClass) {
      extend(ViewCollecionDetailsController, superClass);

      function ViewCollecionDetailsController() {
        return ViewCollecionDetailsController.__super__.constructor.apply(this, arguments);
      }

      ViewCollecionDetailsController.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model, this.mode = opts.mode, this.questionResponseCollection = opts.questionResponseCollection, this.textbookNames = opts.textbookNames;
        this.view = view = this._getCollectionDetailsView();
        this.listenTo(view, 'start:training:module', (function(_this) {
          return function() {
            return _this.region.trigger("start:training:module");
          };
        })(this));
        this.listenTo(view, 'goto:previous:route', this._gotoPreviousRoute);
        return this.show(view, {
          loading: true,
          entities: [this.textbookNames]
        });
      };

      ViewCollecionDetailsController.prototype._gotoPreviousRoute = function() {
        var currRoute, newRoute;
        currRoute = App.getCurrentRoute();
        newRoute = _(currRoute).strLeft('/module');
        return App.navigate(newRoute, true);
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
              var display_time, timeTakenArray, totalTimeTakenForModule;
              timeTakenArray = _this.questionResponseCollection.pluck('time_taken');
              totalTimeTakenForModule = 0;
              if (_.size(timeTakenArray) > 0) {
                totalTimeTakenForModule = _.reduce(timeTakenArray, function(memo, num) {
                  return parseInt(memo + parseInt(num));
                });
              }
              return display_time = $.timeMinSecs(totalTimeTakenForModule);
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
                chapterName = chapter.get('name');
              }
              return $("#lect_name").html(chapterName);
            };
          })(this)
        };
      };

      return ViewCollecionDetailsController;

    })(RegionController);
    CollectionDetailsView = (function(superClass) {
      extend(CollectionDetailsView, superClass);

      function CollectionDetailsView() {
        this.startModule = bind(this.startModule, this);
        return CollectionDetailsView.__super__.constructor.apply(this, arguments);
      }

      CollectionDetailsView.prototype.template = collectionDetailsTpl;

      CollectionDetailsView.prototype.events = {
        'click #start-module': 'startModule',
        'click #go-back-button': function() {
          return this.trigger("goto:previous:route");
        }
      };

      CollectionDetailsView.prototype.mixinTemplateHelpers = function(data) {
        data = CollectionDetailsView.__super__.mixinTemplateHelpers.call(this, data);
        data.takeClassModule = this.mode;
        data.isTraining = this.mode === 'training' ? true : false;
        return data;
      };

      CollectionDetailsView.prototype.initialize = function() {
        return this.mode = Marionette.getOption(this, 'mode');
      };

      CollectionDetailsView.prototype.startModule = function() {
        var currentRoute;
        currentRoute = App.getCurrentRoute();
        return this.trigger("start:training:module");
      };

      return CollectionDetailsView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:student:training:content:group:detailsapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.ViewCollecionDetailsController(opt);
    });
  });
});
