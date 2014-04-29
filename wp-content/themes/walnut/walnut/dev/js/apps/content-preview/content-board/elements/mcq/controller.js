var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/mcq/views'], function(App, Element) {
  return App.module("ContentPreview.ContentBoard.Element.Mcq", function(Mcq, App, Backbone, Marionette, $, _) {
    return Mcq.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._optionUnchecked = __bind(this._optionUnchecked, this);
        this._optionChecked = __bind(this._optionChecked, this);
        this.createRowStructure = __bind(this.createRowStructure, this);
        this._submitAnswer = __bind(this._submitAnswer, this);
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var answerData;
        answerData = {
          answer: [],
          marks: 0,
          comment: 'Not Attempted'
        };
        this.answerModel = App.request("create:new:answer", answerData);
        return _.defaults(options.modelData, Controller.__super__.initialize.call(this, options));
      };

      Controller.prototype.renderElement = function() {
        var optionCollection, optionsObj;
        optionsObj = this.layout.model.get('elements');
        if (!optionsObj.length) {
          optionsObj.push[1];
        }
        optionCollection = App.request("create:new:option:collection", _.shuffle(optionsObj));
        this.layout.model.set('elements', optionCollection);
        App.execute("show:total:marks", this.layout.model.get('marks'));
        this.view = this._getMcqView(optionCollection);
        this.listenTo(this.view, "show show:this:mcq:properties", (function(_this) {
          return function(options) {
            return App.execute("show:question:properties", {
              model: _this.layout.model
            });
          };
        })(this));
        this.listenTo(this.view, "create:row:structure", this.createRowStructure);
        this.listenTo(this.view, "submit:answer", this._submitAnswer);
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype._submitAnswer = function() {
        if (!this.answerModel.get('answer').length) {
          console.log('you havent selected any thing');
          return App.execute("show:response", this.answerModel.get('marks'), this.layout.model.get('marks'));
        } else {
          if (!this.layout.model.get('multiple')) {
            console.log(_.difference(this.answerModel.get('answer'), this.layout.model.get('correct_answer')));
            if (!_.difference(this.answerModel.get('answer'), this.layout.model.get('correct_answer')).length) {
              this.answerModel.set('marks', this.layout.model.get('marks'));
            }
            return App.execute("show:response", this.answerModel.get('marks'), this.layout.model.get('marks'));
          }
        }
      };

      Controller.prototype.createRowStructure = function(options) {
        var columnCounter, columnElement, columnElements, elements, numberOfColumns, numberOfOptions, numberOfRows, optionsInMcqCounter, remainingClass, remainingColumns;
        numberOfColumns = this.layout.model.get('columncount');
        numberOfOptions = this.layout.model.get('optioncount');
        optionsInMcqCounter = 0;
        numberOfRows = Math.ceil(numberOfOptions / numberOfColumns);
        while (!!numberOfRows) {
          columnCounter = 1;
          columnElements = new Array();
          remainingClass = 12;
          remainingColumns = numberOfColumns;
          while (!(columnCounter > numberOfColumns)) {
            if (optionsInMcqCounter < numberOfOptions) {
              columnElement = {
                position: columnCounter,
                element: 'Column',
                className: this.layout.model.get('elements').at(optionsInMcqCounter).get('class'),
                elements: this.layout.model.get('elements').at(optionsInMcqCounter)
              };
              columnElements.push(columnElement);
              remainingClass = remainingClass - columnElement.className;
              remainingColumns = numberOfColumns - columnCounter;
              optionsInMcqCounter++;
            } else {
              columnElement = {
                position: columnCounter,
                element: 'Column',
                className: remainingClass / remainingColumns,
                elements: []
              };
              columnElements.push(columnElement);
            }
            columnCounter++;
          }
          elements = {
            element: 'Row',
            elements: columnElements
          };
          this._createMcqRow(elements, options.container);
          numberOfRows--;
        }
        return this.view.triggerMethod('preTickAnswers');
      };

      Controller.prototype._createMcqRow = function(elements, container) {
        var controller;
        controller = App.request("add:new:element", container, 'Row', elements);
        return _.each(elements.elements, (function(_this) {
          return function(column, index) {
            if (column.elements.length === 0) {
              return;
            }
            container = controller.layout.elementRegion.currentView.$el.children().eq(index);
            return _this._addMcqOption(container, column.elements);
          };
        })(this));
      };

      Controller.prototype._addMcqOption = function(container, model) {
        var view;
        view = this._getMcqOptionView(model);
        view.render();
        $(container).removeClass('empty-column');
        $(container).append(view.$el);
        this.listenTo(view, 'option:checked', this._optionChecked);
        this.listenTo(view, 'option:unchecked', this._optionUnchecked);
        view.triggerMethod('show');
        return $(container).on('remove', function() {
          return view.triggerMethod('close');
        });
      };

      Controller.prototype._optionChecked = function(model) {
        var answerArray;
        answerArray = this.answerModel.get('answer');
        if (!this.layout.model.get('multiple') && answerArray.length) {
          this.answerModel.set('answer', [model.get('optionNo')]);
          console.log('in check');
          this.view.$el.find('input:checkbox').prop('checked', false);
          this.view.$el.find('input:checkbox').parent().css('background-position', '0px 0px');
          this.view.$el.find("input#option-" + (model.get('optionNo'))).prop('checked', true);
          this.view.$el.find("input#option-" + (model.get('optionNo'))).parent().css('background-position', '0px -26px');
        } else {
          answerArray.push(model.get('optionNo'));
        }
        answerArray.sort();
        return console.log(this.answerModel.get('answer'));
      };

      Controller.prototype._optionUnchecked = function(model) {
        var answerArray, indexToRemove;
        answerArray = this.answerModel.get('answer');
        indexToRemove = $.inArray(model.get('optionNo'), answerArray);
        answerArray.splice(indexToRemove, 1);
        return console.log(this.answerModel.get('answer'));
      };

      Controller.prototype._getMcqOptionView = function(model) {
        return new Mcq.Views.McqOptionView({
          model: model
        });
      };

      Controller.prototype._getMcqView = function(optionCollection) {
        return new Mcq.Views.McqView({
          model: this.layout.model
        });
      };

      return Controller;

    })(Element.Controller);
  });
});
