var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/fib/view'], function(App, Element) {
  return App.module("ContentPreview.ContentBoard.Element.Fib", function(Fib, App, Backbone, Marionette, $, _) {
    return Fib.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var answerData;
        answerData = {
          answer: [],
          marks: 0
        };
        this.answerModel = App.request("create:new:answer", answerData);
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.renderElement = function() {
        var blanksArray;
        blanksArray = this.layout.model.get('blanksArray');
        this._parseOptions(blanksArray);
        this.blanksCollection = App.request("create:new:question:element:collection", blanksArray);
        App.execute("show:total:marks", this.layout.model.get('marks'));
        this.layout.model.set('blanksArray', this.blanksCollection);
        console.log(this.blanksCollection.pluck('marks'));
        this.view = this._getFibView(this.layout.model);
        this.listenTo(this.view, "submit:answer", this._submitAnswer);
        return this.layout.elementRegion.show(this.view, {
          loading: true
        });
      };

      Controller.prototype._getFibView = function(model) {
        return new Fib.Views.FibView({
          model: model
        });
      };

      Controller.prototype._parseOptions = function(blanksArray) {
        return _.each(blanksArray, function(blank) {
          if (blank.blank_index != null) {
            blank.blank_index = parseInt(blank.blank_index);
          }
          if (blank.blank_size != null) {
            blank.blank_size = parseInt(blank.blank_size);
          }
          if (blank.marks != null) {
            return blank.marks = parseInt(blank.marks);
          }
        });
      };

      Controller.prototype._submitAnswer = function() {
        var answerArray, enableIndividualMarks;
        enableIndividualMarks = this.layout.model.get('enableIndividualMarks');
        this.caseSensitive = this.layout.model.get('case_sensitive');
        answerArray = this.answerModel.get('answer');
        if (!enableIndividualMarks) {
          this.answerModel.set('marks', this.layout.model.get('marks'));
          _.each(this.view.$el.find('input'), (function(_this) {
            return function(blank, index) {
              var correctAnswersArray;
              _this.answerModel.get('answer').push($(blank).val());
              correctAnswersArray = _this.blanksCollection.get($(blank).attr('data-id')).get('correct_answers');
              if (_this._checkAnswer($(blank).val(), correctAnswersArray)) {
                return $(blank).addClass('ansRight');
              } else {
                _this.answerModel.set('marks', 0);
                return $(blank).addClass('ansWrong');
              }
            };
          })(this));
        } else {
          this.answerModel.set('marks', 0);
          _.each(this.view.$el.find('input'), (function(_this) {
            return function(blank, index) {
              var blankModel, correctAnswersArray;
              _this.answerModel.get('answer').push($(blank).val());
              blankModel = _this.blanksCollection.get($(blank).attr('data-id'));
              correctAnswersArray = blankModel.get('correct_answers');
              console.log(correctAnswersArray);
              if (_this._checkAnswer($(blank).val(), correctAnswersArray)) {
                _this.answerModel.set('marks', _this.answerModel.get('marks') + blankModel.get('marks'));
                return $(blank).addClass('ansRight');
              } else {
                return $(blank).addClass('ansWrong');
              }
            };
          })(this));
        }
        App.execute("show:response", this.answerModel.get('marks'), this.layout.model.get('marks'));
        if (this.answerModel.get('marks') < this.layout.model.get('marks')) {
          return this.view.triggerMethod('show:feedback');
        }
      };

      Controller.prototype._checkAnswer = function(answer, correctAnswersArray) {
        console.log(answer);
        console.log(correctAnswersArray);
        if (this.caseSensitive) {
          return _.contains(correctAnswersArray, answer);
        } else {
          return _.contains(_.map(correctAnswersArray, function(correctAnswer) {
            return _.slugify(correctAnswer);
          }), _.slugify(answer));
        }
      };

      return Controller;

    })(Element.Controller);
  });
});
