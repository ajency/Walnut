var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/mcq/views'], function(App, Element) {
  return App.module("ContentCreator.ContentBuilder.Element.Mcq", function(Mcq, App, Backbone, Marionette, $, _) {
    return Mcq.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._changeColumnCount = __bind(this._changeColumnCount, this);
        this._changeOptionCount = __bind(this._changeOptionCount, this);
        this._optionUnchecked = __bind(this._optionUnchecked, this);
        this._optionChecked = __bind(this._optionChecked, this);
        this.createRowStructure = __bind(this.createRowStructure, this);
        this.renderElement = __bind(this.renderElement, this);
        this._changeMultipleAnswers = __bind(this._changeMultipleAnswers, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.eventObj = options.eventObj;
        _.defaults(options.modelData, {
          element: 'Mcq',
          optioncount: 2,
          columncount: 2,
          elements: [
            {
              optionNo: 1,
              "class": 6
            }, {
              optionNo: 2,
              "class": 6
            }
          ],
          marks: 1,
          individual_marks: false,
          multiple: false,
          correct_answer: [2]
        });
        Controller.__super__.initialize.call(this, options);
        this.layout.model.on('change:optioncount', this._changeOptionCount);
        this.layout.model.on('change:columncount', this._changeColumnCount);
        return this.layout.model.on('change:multiple', this._changeMultipleAnswers);
      };

      Controller.prototype._changeMultipleAnswers = function(model, multiple) {
        if (!multiple) {
          model.set('correct_answer', []);
          return this.layout.elementRegion.show(this.view);
        }
      };

      Controller.prototype.renderElement = function() {
        var optionCollection, optionsObj;
        optionsObj = this.layout.model.get('elements');
        optionCollection = App.request("create:new:option:collection", optionsObj);
        this.layout.model.set('elements', optionCollection);
        this.view = this._getMcqView(optionCollection);
        this.listenTo(this.view, "show show:this:mcq:properties", (function(_this) {
          return function(options) {
            return App.execute("show:question:properties", {
              model: _this.layout.model
            });
          };
        })(this));
        this.listenTo(this.view, "create:row:structure", this.createRowStructure);
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype.createRowStructure = function(options) {
        var columnCounter, columnElement, columnElements, elements, numberOfColumns, numberOfOptions, numberOfRows, optionsInMcqCounter, remainingClass, remainingColumns;
        numberOfColumns = this.layout.model.get('columncount');
        numberOfOptions = this.layout.model.get('optioncount');
        optionsInMcqCounter = 1;
        numberOfRows = Math.ceil(numberOfOptions / numberOfColumns);
        while (!!numberOfRows) {
          columnCounter = 1;
          columnElements = new Array();
          remainingClass = 12;
          remainingColumns = numberOfColumns;
          while (!(columnCounter > numberOfColumns)) {
            if (optionsInMcqCounter <= numberOfOptions) {
              columnElement = {
                position: columnCounter,
                element: 'Column',
                className: this.layout.model.get('elements').get(optionsInMcqCounter).get('class'),
                elements: this.layout.model.get('elements').get(optionsInMcqCounter)
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
        return _.each(elements.elements, _.bind(this._iterateColumnElements, this, controller));
      };

      Controller.prototype._iterateColumnElements = function(controller, column, index) {
        var container;
        if (column.elements.length === 0) {
          return;
        }
        container = controller.layout.elementRegion.currentView.$el.children().eq(index);
        return this._addMcqOption(container, column.elements);
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
        var correctAnswerArray;
        correctAnswerArray = this.layout.model.get('correct_answer');
        if (!this.layout.model.get('multiple') && correctAnswerArray.length) {
          this.layout.model.set('correct_answer', [parseInt(model.get('optionNo'))]);
          console.log('in check');
          this.view.triggerMethod("update:tick");
        } else {
          correctAnswerArray.push(parseInt(model.get('optionNo')));
        }
        correctAnswerArray.sort();
        return console.log(this.layout.model.get('correct_answer'));
      };

      Controller.prototype._optionUnchecked = function(model) {
        var correctAnswerArray, indexToRemove;
        correctAnswerArray = this.layout.model.get('correct_answer');
        indexToRemove = $.inArray(model.get('optionNo'), correctAnswerArray);
        correctAnswerArray.splice(indexToRemove, 1);
        return console.log(this.layout.model.get('correct_answer'));
      };

      Controller.prototype._getMcqOptionView = function(model) {
        return new Mcq.Views.McqOptionView({
          model: model
        });
      };

      Controller.prototype.bindEvents = function() {
        return Controller.__super__.bindEvents.call(this);
      };

      Controller.prototype._getMcqView = function(optionCollection) {
        return new Mcq.Views.McqView({
          model: this.layout.model
        });
      };

      Controller.prototype._changeOptionCount = function(model, newOptionCount) {
        var numberOfColumns, oldOptionCount;
        numberOfColumns = model.get('columncount');
        model.get('elements').each(_.bind(this._changeColumnClass, this, numberOfColumns));
        oldOptionCount = model.previous('optioncount');
        if (oldOptionCount < newOptionCount) {
          while (oldOptionCount !== newOptionCount) {
            oldOptionCount++;
            model.get('elements').push({
              optionNo: oldOptionCount,
              "class": 12 / numberOfColumns
            });
          }
        }
        if (oldOptionCount > newOptionCount) {
          while (oldOptionCount !== newOptionCount) {
            model.get('elements').pop();
            oldOptionCount--;
          }
        }
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype._changeColumnCount = function(model, newColumnCount) {
        model.get('elements').each(_.bind(this._changeColumnClass, this, newColumnCount));
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype._changeColumnClass = function(numberOfColumns, element) {
        return element.set('class', 12 / numberOfColumns);
      };

      Controller.prototype.deleteElement = function(model) {
        model.set('elements', '');
        delete model.get('elements');
        model.destroy();
        return App.execute("close:question:properties");
      };

      return Controller;

    })(Element.Controller);
  });
});
