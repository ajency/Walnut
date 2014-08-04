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
        var answerWreqrObject;
        answerWreqrObject = options.answerWreqrObject, this.answerModel = options.answerModel;
        if (!this.answerModel) {
          this.answerModel = App.request("create:new:answer");
        }
        if (answerWreqrObject) {
          this.displayAnswer = answerWreqrObject.options.displayAnswer;
          answerWreqrObject.setHandler("get:question:answer", (function(_this) {
            return function() {
              var data;
              console.log("@answerModel.get 'answer'");
              console.log(_this.answerModel.get('answer'));
              return data = {
                'answerModel': _this.answerModel,
                'totalMarks': _this.layout.model.get('marks')
              };
            };
          })(this));
          answerWreqrObject.setHandler("submit:answer", (function(_this) {
            return function() {
              return _this._submitAnswer(_this.displayAnswer);
            };
          })(this));
        }
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.renderElement = function() {
        var optionCollection, optionsObj, shuffleFlag;
        optionsObj = this.layout.model.get('options');
        if (optionsObj instanceof Backbone.Collection) {
          optionsObj = optionsObj.models;
        }
        this._parseOptions(optionsObj);
        shuffleFlag = true;
        _.each(optionsObj, (function(_this) {
          return function(option) {
            if (parseInt(option["class"]) !== 12 / _this.layout.model.get('columncount')) {
              return shuffleFlag = false;
            }
          };
        })(this));
        if (shuffleFlag) {
          optionsObj = _.shuffle(optionsObj);
        }
        optionCollection = App.request("create:new:option:collection", optionsObj);
        this.layout.model.set('options', optionCollection);
        this.view = this._getMcqView();
        this.listenTo(this.view, "create:row:structure", this.createRowStructure);
        this.listenTo(this.view, "submit:answer", this._submitAnswer);
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype._getMcqView = function() {
        return new Mcq.Views.McqView({
          model: this.layout.model,
          answerModel: this.answerModel,
          displayAnswer: this.displayAnswer
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

      Controller.prototype._submitAnswer = function(displayAnswer) {
        var answersNotMarked, totalMarks;
        if (displayAnswer == null) {
          displayAnswer = true;
        }
        this.answerModel.set('marks', 0);
        if (!this.answerModel.get('answer').length) {
          console.log('you havent selected any thing');
        } else {
          if (!this.layout.model.get('multiple')) {
            console.log(_.difference(this.answerModel.get('answer'), this.layout.model.get('correct_answer')));
            if (!_.difference(this.answerModel.get('answer'), this.layout.model.get('correct_answer')).length) {
              this.answerModel.set('marks', this.layout.model.get('marks'));
            }
          } else {
            if (!_.difference(this.answerModel.get('answer'), this.layout.model.get('correct_answer')).length) {
              if (!_.difference(this.layout.model.get('correct_answer'), this.answerModel.get('answer')).length) {
                this.answerModel.set('marks', this.layout.model.get('marks'));
              } else {
                answersNotMarked = _.difference(this.layout.model.get('correct_answer'), this.answerModel.get('answer'));
                totalMarks = this.layout.model.get('marks');
                _.each(answersNotMarked, (function(_this) {
                  return function(notMarked) {
                    return totalMarks -= _this.layout.model.get('options').get(notMarked).get('marks');
                  };
                })(this));
                this.answerModel.set('marks', totalMarks);
              }
            }
          }
        }
        if (displayAnswer) {
          App.execute("show:response", this.answerModel.get('marks'), this.layout.model.get('marks'));
        }
        if (displayAnswer) {
          return this.view.triggerMethod("add:option:classes", this.answerModel.get('answer'));
        }
      };

      Controller.prototype.createRowStructure = function(options) {
        var columnCount, columnElement, columnElements, controller, num, optionsInCurrentRow, rowElements, rowNumber, totalOptionsinMcq, _i, _results;
        columnCount = parseInt(this.layout.model.get('columncount')) + 1;
        columnElements = (function() {
          var _results;
          _results = [];
          while (columnCount -= 1) {
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
        totalOptionsinMcq = this.layout.model.get('optioncount');
        rowNumber = 1;
        _results = [];
        while (totalOptionsinMcq > 0) {
          optionsInCurrentRow = totalOptionsinMcq > this.layout.model.get('columncount') ? this.layout.model.get('columncount') : totalOptionsinMcq;
          this._setColumnClassForRow(rowElements, rowNumber, optionsInCurrentRow);
          controller = App.request("add:new:element", options.container, 'Row', rowElements);
          for (num = _i = 1; 1 <= optionsInCurrentRow ? _i <= optionsInCurrentRow : _i >= optionsInCurrentRow; num = 1 <= optionsInCurrentRow ? ++_i : --_i) {
            this._iterateThruOptions(controller, rowNumber, num);
          }
          totalOptionsinMcq -= this.layout.model.get('columncount');
          _results.push(rowNumber += 1);
        }
        return _results;
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
            if (_this.layout.model.get('options').at(optionNumber - 1)) {
              classRemaining -= _this.layout.model.get('options').at(optionNumber - 1).get('class');
              return rowElements.elements[index].className = _this.layout.model.get('options').at(optionNumber - 1).get('class');
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
        optionRowController = App.request("add:new:element", container, 'Row', optionElements);
        optionRowContainer = optionRowController.layout.elementRegion.currentView.$el.children().eq(0);
        return this._fillOptionRowWithElements(optionRowContainer, optionNumber);
      };

      Controller.prototype._fillOptionRowWithElements = function(optionRowContainer, optionNumber) {
        var thisOptionElementsArray;
        this._addMcqOption(optionRowContainer, this.layout.model.get('options').at(optionNumber - 1));
        optionNumber = this.layout.model.get('options').at(optionNumber - 1).get('optionNo');
        thisOptionElementsArray = this.layout.model.get('elements')[optionNumber - 1];
        return _.each(thisOptionElementsArray, function(ele) {
          return App.request("add:new:element", optionRowContainer, ele.element, ele);
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

      return Controller;

    })(Element.Controller);
  });
});
