var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/view-single-quiz/content-display/composite-view'], function(App, RegionController) {
  return App.module("QuizItemsDisplayApp", function(QuizItemsDisplayApp, App) {
    QuizItemsDisplayApp.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getCollectionContentDisplayView = __bind(this._getCollectionContentDisplayView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var groupContentCollection, model, questionResponseCollection, view;
        model = opts.model, this.mode = opts.mode, questionResponseCollection = opts.questionResponseCollection, groupContentCollection = opts.groupContentCollection, this.studentCollection = opts.studentCollection;
        console.log('test quiz items display');
        this.view = view = this._getCollectionContentDisplayView(model, groupContentCollection, questionResponseCollection);
        this.show(view, {
          loading: true,
          entities: [groupContentCollection]
        });
        return this.listenTo(this.view, 'view:question:readonly', (function(_this) {
          return function(questionID) {
            return _this.region.trigger('goto:question:readonly', questionID);
          };
        })(this));
      };

      Controller.prototype._getCollectionContentDisplayView = function(model, collection, responseCollection) {
        return new QuizItemsDisplayApp.ContentCompositeView.View({
          model: model,
          collection: collection,
          responseCollection: responseCollection,
          studentCollection: this.studentCollection,
          mode: this.mode
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:quiz:items:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new QuizItemsDisplayApp.Controller(opt);
    });
  });
});
