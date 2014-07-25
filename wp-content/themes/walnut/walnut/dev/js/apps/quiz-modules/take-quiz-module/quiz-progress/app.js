var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/take-quiz-module/quiz-progress/templates/quiz-progress-tpl.html'], function(App, RegionController, quizProgressTemplate) {
  return App.module("TakeQuizApp.QuizProgress", function(QuizProgress, App) {
    var QuestionProgressView, QuizProgressView;
    QuizProgress.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showQuizProgressView = __bind(this._showQuizProgressView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var view;
        this.questionsCollection = opts.questionsCollection;
        this.view = view = this._showQuizProgressView(this.questionsCollection);
        this.show(view, {
          loading: true
        });
        return this.listenTo(view, "change:question", function(id) {
          return this.region.trigger("change:question", id);
        });
      };

      Controller.prototype._showQuizProgressView = function(collection) {
        return new QuizProgressView({
          collection: collection
        });
      };

      return Controller;

    })(RegionController);
    QuestionProgressView = (function(_super) {
      __extends(QuestionProgressView, _super);

      function QuestionProgressView() {
        return QuestionProgressView.__super__.constructor.apply(this, arguments);
      }

      QuestionProgressView.prototype.template = '<a data-id="{{ID}}">{{itemNumber}}</a>';

      QuestionProgressView.prototype.tagName = 'li';

      QuestionProgressView.prototype.mixinTemplateHelpers = function(data) {
        data.itemNumber = Marionette.getOption(this, 'itemNumber');
        return data;
      };

      return QuestionProgressView;

    })(Marionette.ItemView);
    return QuizProgressView = (function(_super) {
      __extends(QuizProgressView, _super);

      function QuizProgressView() {
        return QuizProgressView.__super__.constructor.apply(this, arguments);
      }

      QuizProgressView.prototype.className = 'quizProgress';

      QuizProgressView.prototype.template = quizProgressTemplate;

      QuizProgressView.prototype.itemView = QuestionProgressView;

      QuizProgressView.prototype.itemViewContainer = '#quiz-items';

      QuizProgressView.prototype.itemViewOptions = function(model, index) {
        return {
          itemNumber: index + 1
        };
      };

      QuizProgressView.prototype.events = {
        'click #quiz-items a': function(e) {
          return this.trigger("change:question", $(e.target).attr('data-id'));
        }
      };

      QuizProgressView.prototype.onShow = function() {
        return $("div.holder").jPages({
          containerID: "quiz-items",
          perPage: 9,
          keyBrowse: true,
          animation: "fadeIn",
          previous: ".fa-chevron-left",
          next: ".fa-chevron-right",
          midRange: 15,
          links: "blank"
        });
      };

      return QuizProgressView;

    })(Marionette.CompositeView);
  });
});
