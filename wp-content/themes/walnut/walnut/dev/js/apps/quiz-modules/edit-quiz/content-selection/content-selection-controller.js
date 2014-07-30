var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/edit-quiz/content-selection/content-selection-views'], function(App, RegionController) {
  return App.module('QuizModuleApp.EditQuiz.QuizContentSelection', function(QuizContentSelection, App) {
    QuizContentSelection.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.quizContentRemoved = __bind(this.quizContentRemoved, this);
        this._addNewSet = __bind(this._addNewSet, this);
        this._addContentPieces = __bind(this._addContentPieces, this);
        this._getContentSelectionView = __bind(this._getContentSelectionView, this);
        this._fetchSectionOrSubsection = __bind(this._fetchSectionOrSubsection, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.contentPiecesCollection = App.request("get:content:pieces", {
          post_status: 'publish',
          content_type: ['student_question']
        });
        this.model = options.model, this.quizContentCollection = options.quizContentCollection, this.textbooksCollection = options.textbooksCollection;
        return App.execute("when:fetched", [this.contentPiecesCollection, this.quizContentCollection, this.textbooksCollection], (function(_this) {
          return function() {
            var model, _i, _len, _ref;
            _ref = _this.quizContentCollection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              _this.contentPiecesCollection.remove(model);
            }
            _this.view = _this._getContentSelectionView();
            _this.listenTo(_this.view, "fetch:chapters:or:sections", _this._fetchSectionOrSubsection);
            _this.listenTo(_this.view, "add:content:pieces", _this._addContentPieces);
            _this.listenTo(_this.view, 'add:new:set', _this._addNewSet);
            _this.listenTo(_this.quizContentCollection, 'remove', _this.quizContentRemoved);
            return _this.show(_this.view, {
              loading: true
            });
          };
        })(this));
      };

      Controller.prototype._fetchSectionOrSubsection = function(parentID, filterType, currItem) {
        var chaptersOrSections;
        chaptersOrSections = App.request("get:chapters", {
          'parent': parentID
        });
        console.log(chaptersOrSections);
        return App.execute("when:fetched", chaptersOrSections, (function(_this) {
          return function() {
            return _this.view.triggerMethod("fetch:chapters:or:sections:completed", chaptersOrSections, filterType, currItem);
          };
        })(this));
      };

      Controller.prototype._getContentSelectionView = function(collection) {
        return new QuizContentSelection.Views.DataContentTableView({
          collection: this.contentPiecesCollection,
          fullCollection: this.contentPiecesCollection.clone(),
          quizModel: this.model,
          textbooksCollection: this.textbooksCollection
        });
      };

      Controller.prototype._addContentPieces = function(contentIDs) {
        var id, _i, _len;
        _.each(contentIDs, (function(_this) {
          return function(ele, index) {
            return _this.quizContentCollection.add(_this.contentPiecesCollection.get(ele));
          };
        })(this));
        for (_i = 0, _len = contentIDs.length; _i < _len; _i++) {
          id = contentIDs[_i];
          this.contentPiecesCollection.remove(id);
        }
        return console.log(this.quizContentCollection);
      };

      Controller.prototype._addNewSet = function(data) {
        var newSetModel;
        data.id = this._getNewSetId();
        newSetModel = new Backbone.Model(data);
        this.quizContentCollection.add(newSetModel);
        return console.log(this.quizContentCollection);
      };

      Controller.prototype._getNewSetId = function() {
        var id, idArray, modelsArray;
        modelsArray = this.quizContentCollection.where({
          post_type: 'content_set'
        });
        idArray = _.map(_.pluck(modelsArray, 'id'), function(id) {
          return parseInt(_.ltrim(id, 'set '));
        });
        if (_.isEmpty(idArray)) {
          id = 1;
        } else {
          id = _.max(idArray) + 1;
        }
        return "set " + id;
      };

      Controller.prototype.quizContentRemoved = function(model) {
        if (model.get('post_type') === 'content-piece') {
          console.log(model);
          return this.contentPiecesCollection.add(model);
        }
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:quiz:content:selection:app", function(options) {
      if (options == null) {
        options = {};
      }
      return new QuizContentSelection.Controller(options);
    });
  });
});
