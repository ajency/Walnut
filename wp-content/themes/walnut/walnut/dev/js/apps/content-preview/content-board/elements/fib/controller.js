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
        this.blanksCollection = App.request("create:new:question:element:collection", this.layout.model.get('blanksArray'));
        this.layout.model.set('blanksArray', this.blanksCollection);
        this.view = this._getFibView(this.layout.model);
        return this.layout.elementRegion.show(this.view, {
          loading: true
        });
      };

      Controller.prototype._getFibView = function(model) {
        return new Fib.Views.FibView({
          model: model
        });
      };

      Controller.prototype._submitAnswer = function() {
        var caseSensitive, enableIndividualMarks, fullCorrect;
        enableIndividualMarks = this.layout.model.get('enableIndividualMarks');
        caseSensitive = this.layout.model.get('case_sensitive');
        _each(this.view.$el.find('input'), function(blank, index) {
          return this.answerModel.get('answer').push($(blank).val());
        });
        if (!enableIndividualMarks) {
          fullCorrect = false;
          _each(this.view.$el.find('input'), function(blank, index) {
            var correctAnswers;
            fullCorrect = false;
            return correctAnswers = this.blanksCollection.get($(blanks).attr('data-id')).get('correct_answers');
          });
        }
        return App.execute("show:response", this.answerModel.get('marks'), this.layout.model.get('marks'));
      };

      return Controller;

    })(Element.Controller);
  });
});
