var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/sort/view'], function(App, Element) {
  return App.module("ContentPreview.ContentBoard.Element.Sort", function(Sort, App, Backbone, Marionette, $, _) {
    return Sort.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._submitAnswer = __bind(this._submitAnswer, this);
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
        var optionsObj;
        optionsObj = this.layout.model.get('elements');
        optionsObj = _.shuffle(optionsObj);
        this.optionCollection = App.request("create:new:option:collection", optionsObj);
        this.layout.model.set('elements', this.optionCollection);
        this.view = this._getSortView(this.optionCollection);
        App.execute("show:total:marks", this.layout.model.get('marks'));
        this.listenTo(this.view, "submit:answer", this._submitAnswer);
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype._getSortView = function(collection) {
        return new Sort.Views.SortView({
          collection: collection,
          sort_model: this.layout.model
        });
      };

      Controller.prototype._submitAnswer = function() {
        this.answerModel.set('marks', this.layout.model.get('marks'));
        this.view.$el.find('input#optionNo').each((function(_this) {
          return function(index, element) {
            var answerOptionIndex;
            answerOptionIndex = _this.optionCollection.get($(element).val()).get('index');
            _this.answerModel.get('answer').push(answerOptionIndex);
            if (answerOptionIndex !== index + 1) {
              _this.answerModel.set('marks', 0);
              return $(element).parent().addClass('ansWrong');
            } else {
              return $(element).parent().addClass('ansRight');
            }
          };
        })(this));
        App.execute("show:response", this.answerModel.get('marks'), this.layout.model.get('marks'));
        console.log(this.answerModel.get('answer').toString());
        if (this.answerModel.get('marks') === 0) {
          return this.view.triggerMethod('show:feedback');
        }
      };

      return Controller;

    })(Element.Controller);
  });
});