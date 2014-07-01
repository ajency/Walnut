var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/mcq/views'], function(App, Element) {
  return App.module("ContentCreator.ContentBuilder.Element.Mcq", function(Mcq, App, Backbone, Marionette, $, _) {
    return Mcq.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._changeColumnCount = __bind(this._changeColumnCount, this);
        this._changeMultipleAnswers = __bind(this._changeMultipleAnswers, this);
        this._changeOptionCount = __bind(this._changeOptionCount, this);
        this._optionUnchecked = __bind(this._optionUnchecked, this);
        this._optionChecked = __bind(this._optionChecked, this);
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'Mcq',
          optioncount: 4,
          columncount: 3,
          options: [
            {
              optionNo: 1,
              "class": 4
            }, {
              optionNo: 2,
              "class": 4
            }, {
              optionNo: 3,
              "class": 4
            }, {
              optionNo: 4,
              "class": 4
            }
          ],
          elements: [],
          marks: 1,
          individual_marks: false,
          multiple: false,
          correct_answer: [3]
        });
        Controller.__super__.initialize.call(this, options);
        this.layout.model.on('change:columncount', this._changeColumnCount);
        this.layout.model.on('change:optioncount', this._changeOptionCount);
        return this.layout.model.on('change:multiple', this._changeMultipleAnswers);
      };

      Controller.prototype.renderElement = function() {
        var optionCollection, optionsObj;
        optionsObj = this.layout.model.get('options');
        this._parseOptions(optionsObj);
        optionCollection = App.request("create:new:option:collection", optionsObj);
        this.layout.model.set('options', optionCollection);
        console.log(this.layout.model);
        this.view = this._getMcqView();
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

      Controller.prototype._getMcqView = function() {
        return new Mcq.Views.McqView({
          model: this.layout.model
        });
      };

      Controller.prototype._parseOptions = function(optionsObj) {
        _.each(optionsObj, function(option) {
          if (option.marks != null) {
            option.marks = parseInt(option.marks);
          }
          if (option.optionNo != null) {
            option.optionNo = parseInt(option.optionNo);
          }
          if (option['class'] != null) {
            return option["class"] = parseInt(option['class']);
          }
        });
        return this.layout.model.set('correct_answer', _.map(this.layout.model.get('correct_answer'), function(ans) {
          return parseInt(ans);
        }));
      };

      Controller.prototype.createRowStructure = function(options) {
        var columnCount, columnElement, columnElements, controller, num, optionsInCurrentRow, rowElements, rowNumber, totalOptionsinMcq, _i;
        columnCount = parseInt(this.layout.model.get('columncount')) + 1;
        columnElements = (function() {
          var _results;
          _results = [];
          while (columnCount -= 1) {
            console.log(columnCount);
            columnElement = {
              position: this.layout.model.get('columncount') - columnCount + 1,
              element: 'Column',
              className: 12 / this.layout.model.get('columncount'),
              elements: []
            };
            _results.push(columnElement);
          }
          return _results;
        }).call(this);
        rowElements = {
          element: 'Row',
          columncount: this.layout.model.get('columncount'),
          elements: columnElements
        };
        console.log(rowElements);
        totalOptionsinMcq = this.layout.model.get('optioncount');
        rowNumber = 1;
        while (totalOptionsinMcq > 0) {
          optionsInCurrentRow = totalOptionsinMcq > this.layout.model.get('columncount') ? this.layout.model.get('columncount') : totalOptionsinMcq;
          this._setColumnClassForRow(rowElements, rowNumber, optionsInCurrentRow);
          console.log(rowElements);
          controller = App.request("add:new:element", options.container, 'Row', null, rowElements);
          for (num = _i = 1; 1 <= optionsInCurrentRow ? _i <= optionsInCurrentRow : _i >= optionsInCurrentRow; num = 1 <= optionsInCurrentRow ? ++_i : --_i) {
            this._iterateThruOptions(controller, rowNumber, num);
          }
          totalOptionsinMcq -= this.layout.model.get('columncount');
          rowNumber += 1;
        }
        return this.view.triggerMethod('pre:tick:answers');
      };

      Controller.prototype._setColumnClassForRow = function(rowElements, rowNumber, optionsInCurrentRow) {
        var classRemaining, num, optionNumbers;
        optionNumbers = (function() {
          var _i, _ref, _results;
          _results = [];
          for (num = _i = 1, _ref = this.layout.model.get('columncount'); 1 <= _ref ? _i <= _ref : _i >= _ref; num = 1 <= _ref ? ++_i : --_i) {
            _results.push((rowNumber - 1) * this.layout.model.get('columncount') + num);
          }
          return _results;
        }).call(this);
        classRemaining = 12;
        return _.each(optionNumbers, (function(_this) {
          return function(optionNumber, index) {
            if (_this.layout.model.get('options').get(optionNumber)) {
              classRemaining -= _this.layout.model.get('options').get(optionNumber).get('class');
              return rowElements.elements[index].className = _this.layout.model.get('options').get(optionNumber).get('class');
            } else {
              rowElements.elements[index].className = Math.floor(classRemaining / (_this.layout.model.get('columncount') - optionsInCurrentRow));
              classRemaining -= Math.floor(classRemaining / (_this.layout.model.get('columncount') - optionsInCurrentRow));
              return optionsInCurrentRow++;
            }
          };
        })(this));
      };

      Controller.prototype._iterateThruOptions = function(controller, rowNumber, index) {
        var columnCount, container, idx, optionElements, optionNumber, optionRowContainer, optionRowController;
        columnCount = this.layout.model.get('columncount');
        optionNumber = (rowNumber - 1) * this.layout.model.get('columncount') + index;
        idx = index - 1;
        container = controller.layout.elementRegion.currentView.$el.children().eq(idx);
        console.log(container);
        $(container).attr('data-option', optionNumber);
        optionElements = {
          element: 'Row',
          columncount: 1,
          elements: [
            {
              position: 1,
              element: 'Column',
              className: 12,
              elements: []
            }
          ]
        };
        optionRowController = App.request("add:new:element", container, 'Row', null, optionElements);
        optionRowContainer = optionRowController.layout.elementRegion.currentView.$el.children().eq(0);
        return this._fillOptionRowWithElements(optionRowContainer, optionNumber);
      };

      Controller.prototype._fillOptionRowWithElements = function(optionRowContainer, optionNumber) {
        var thisOptionElementsArray;
        this._addMcqOption(optionRowContainer, this.layout.model.get('options').get(optionNumber));
        if (this.layout.model.get('elements')[optionNumber - 1] == null) {
          this.layout.model.get('elements')[optionNumber - 1] = [
            {
              element: 'Text'
            }
          ];
        }
        thisOptionElementsArray = this.layout.model.get('elements')[optionNumber - 1];
        return _.each(thisOptionElementsArray, function(ele) {
          return App.request("add:new:element", optionRowContainer, ele.element, null, ele);
        });
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

      Controller.prototype._getMcqOptionView = function(model) {
        return new Mcq.Views.McqOptionView({
          model: model
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

      Controller.prototype._changeOptionCount = function(model, newOptionCount) {
        var numberOfColumns, oldOptionCount;
        numberOfColumns = model.get('columncount');
        oldOptionCount = model.previous('optioncount');
        this._getAllOptionElements();
        if (oldOptionCount < newOptionCount) {
          while (oldOptionCount !== newOptionCount) {
            oldOptionCount++;
            model.get('options').push({
              optionNo: oldOptionCount
            });
          }
        }
        if (oldOptionCount > newOptionCount) {
          while (oldOptionCount !== newOptionCount) {
            model.get('elements').pop();
            model.get('options').pop();
            oldOptionCount--;
          }
        }
        model.get('options').each(_.bind(this._changeColumnClass, this, numberOfColumns));
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype._changeMultipleAnswers = function(model, multiple) {
        if (!multiple) {
          model.set('correct_answer', []);
          this._getAllOptionElements();
          return this.layout.elementRegion.show(this.view);
        }
      };

      Controller.prototype._changeColumnCount = function(model, numberOfColumns) {
        model.get('options').each(_.bind(this._changeColumnClass, this, numberOfColumns));
        this._getAllOptionElements();
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype._changeColumnClass = function(numberOfColumns, element) {
        return element.set('class', 12 / numberOfColumns);
      };

      Controller.prototype._getAllOptionElements = function() {
        return this.view.triggerMethod('get:all:option:elements');
      };

      Controller.prototype.deleteElement = function(model) {
        console.log('destroying');
        model.set('options', '');
        delete model.get('options');
        model.destroy();
        return App.execute("close:question:properties");
      };

      return Controller;

    })(Element.Controller);
  });
});
