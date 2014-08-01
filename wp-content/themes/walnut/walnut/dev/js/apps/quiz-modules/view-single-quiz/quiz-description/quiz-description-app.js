var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/view-single-quiz/quiz-description/templates/quiz-description.html'], function(App, RegionController, quizDetailsTpl) {
  return App.module("QuizModuleApp.Controller", function(Controller, App) {
    var QuizDetailsView;
    Controller.ViewCollecionDetailsController = (function(_super) {
      __extends(ViewCollecionDetailsController, _super);

      function ViewCollecionDetailsController() {
        return ViewCollecionDetailsController.__super__.constructor.apply(this, arguments);
      }

      ViewCollecionDetailsController.prototype.initialize = function(opts) {
        var view;
        this.model = opts.model, this.textbookNames = opts.textbookNames;
        this.view = view = this._getQuizDescriptionView();
        this.listenTo(view, 'start:quiz:module', (function(_this) {
          return function() {
            return _this.region.trigger("start:quiz:module");
          };
        })(this));
        this.listenTo(view, 'goto:previous:route', this._gotoPreviousRoute);
        return this.show(view);
      };

      ViewCollecionDetailsController.prototype._getQuizDescriptionView = function() {
        var terms;
        terms = this.model.get('term_ids');
        return new QuizDetailsView({
          model: this.model,
          templateHelpers: {
            getTextbookName: (function(_this) {
              return function() {
                return _this.textbookNames.getTextbookName(terms);
              };
            })(this),
            getChapterName: (function(_this) {
              return function() {
                return _this.textbookNames.getChapterName(terms);
              };
            })(this),
            getQuestionsCount: (function(_this) {
              return function() {
                return _.size(_this.model.get('content_pieces'));
              };
            })(this)
          }
        });
      };

      return ViewCollecionDetailsController;

    })(RegionController);
    QuizDetailsView = (function(_super) {
      __extends(QuizDetailsView, _super);

      function QuizDetailsView() {
        return QuizDetailsView.__super__.constructor.apply(this, arguments);
      }

      QuizDetailsView.prototype.template = quizDetailsTpl;

      QuizDetailsView.prototype.events = {
        'click #take-quiz': function() {
          return this.trigger("start:quiz:module");
        },
        'click #go-back-button': function() {
          return this.trigger("goto:previous:route");
        }
      };

      return QuizDetailsView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:view:quiz:detailsapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.ViewCollecionDetailsController(opt);
    });
  });
});
