var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/mcq/views'], function(App, Element) {
  return App.module("ContentCreator.ContentBuilder.Element.Mcq", function(Mcq, App, Backbone, Marionette, $, _) {
    return Mcq.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._changeOptionCount = __bind(this._changeOptionCount, this);
        this.createRowStructure = __bind(this.createRowStructure, this);
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.eventObj = options.eventObj;
        _.defaults(options.modelData, {
          element: 'Mcq',
          optioncount: 2,
          columncount: 2,
          elements: App.request("create:new:option:collection", [
            {
              optionNo: 1,
              "class": 6
            }, {
              optionNo: 2,
              "class": 6
            }
          ]),
          marks: 1,
          individual_marks: false,
          multiple: false
        });
        Controller.__super__.initialize.call(this, options);
        this.layout.model.on('change:optioncount', this._changeOptionCount);
        return this.layout.model.on('change:columncount', this._changeColumnCount);
      };

      Controller.prototype.renderElement = function() {
        var optionCollection, optionsObj;
        optionsObj = this.layout.model.get('elements');
        if (optionsObj instanceof Backbone.Collection) {
          optionCollection = optionsObj;
        } else {
          optionCollection = App.request("create:new:option:collection", optionsObj);
          this.layout.model.set('elements', optionCollection);
        }
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
        var columnCounter, columnElement, columnElements, controller, elements, numberOfColumns, numberOfOptions, numberOfRows, optionsInMcqCounter, remainingClass, remainingColumns, _results;
        numberOfColumns = this.layout.model.get('columncount');
        numberOfOptions = this.layout.model.get('optioncount');
        optionsInMcqCounter = 1;
        numberOfRows = Math.ceil(numberOfOptions / numberOfColumns);
        _results = [];
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
          controller = App.request("add:new:element", options.container, 'Row', elements);
          _.each(elements.elements, (function(_this) {
            return function(column, index) {
              var container;
              if (column.elements.length === 0) {
                return;
              }
              container = controller.layout.elementRegion.currentView.$el.children().eq(index);
              return _this._addMcqOption(container, column.elements);
            };
          })(this));
          _results.push(numberOfRows--);
        }
        return _results;
      };

      Controller.prototype._addMcqOption = function(container, model) {
        var view;
        view = this._getMcqOptionView(model);
        view.render();
        $(container).removeClass('empty-column');
        $(container).append(view.$el);
        return view.triggerMethod('show');
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

      Controller.prototype._changeOptionCount = function(model, num) {
        var newval, oldval;
        oldval = model.previous('optioncount');
        newval = num;
        if (oldval < newval) {
          while (oldval !== newval) {
            oldval++;
            model.get('elements').push({
              optionNo: oldval,
              "class": 6
            });
          }
        }
        if (oldval > newval) {
          while (oldval !== newval) {
            model.get('elements').pop();
            oldval--;
          }
        }
        return this.renderElement();
      };

      Controller.prototype._changeColumnCount = function() {
        this.layout.model.get('elements').each(function(element) {
          return element.set('class', 12 / numberOfColumns);
        });
        return this.renderElement();
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
