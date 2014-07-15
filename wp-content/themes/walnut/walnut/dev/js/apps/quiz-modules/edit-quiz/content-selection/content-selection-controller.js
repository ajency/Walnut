var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/edit-quiz/content-selection/content-selection-views'], function(App, RegionController) {
  return App.module('QuizModuleApp.EditQuiz.ContentSelection', function(ContentSelection, App) {
    ContentSelection.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getContentSelectionView = __bind(this._getContentSelectionView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.textbooksCollection = App.request("get:textbooks");
        this.contentPiecesCollection = App.request("get:content:pieces", {
          post_status: 'publish',
          content_type: ['student_question']
        });
        this.model = options.model, this.quizContentCollection = options.quizContentCollection;
        return App.execute("when:fetched", [this.contentPiecesCollection, this.quizContentCollection, this.textbooksCollection], (function(_this) {
          return function() {
            var model, _i, _len, _ref;
            _ref = _this.quizContentCollection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              _this.contentPiecesCollection.remove(model);
            }
            _this.view = _this._getContentSelectionView();
            _this.listenTo(_this.view, "fetch:chapters:or:sections", function(parentID, filterType) {
              var chaptersOrSections;
              chaptersOrSections = App.request("get:chapters", {
                'parent': parentID
              });
              return App.execute("when:fetched", chaptersOrSections, function() {
                return _this.view.triggerMethod("fetch:chapters:or:sections:completed", chaptersOrSections, filterType);
              });
            });
            return _this.show(_this.view, {
              loading: true
            });
          };
        })(this));
      };

      Controller.prototype._getContentSelectionView = function(collection) {
        return new ContentSelection.Views.DataContentTableView({
          collection: this.contentPiecesCollection,
          fullCollection: this.contentPiecesCollection.clone(),
          quizModel: this.model,
          textbooksCollection: this.textbooksCollection
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:content:selectionapp", function(options) {
      if (options == null) {
        options = {};
      }
      return new ContentSelection.Controller(options);
    });
  });
});
