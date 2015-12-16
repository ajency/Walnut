var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/sort/views'], function(App, Element) {
  return App.module("ContentCreator.ContentBuilder.Element.Sort", function(Sort, App, Backbone, Marionette, $, _) {
    return Sort.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._changeOptionCount = bind(this._changeOptionCount, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.eventObj = options.eventObj;
        _.defaults(options.modelData, {
          marks: 1,
          element: 'Sort',
          optioncount: 2,
          elements: [
            {
              optionNo: _.uniqueId(),
              index: 1
            }, {
              optionNo: _.uniqueId(),
              index: 2
            }
          ],
          bg_color: '#ffffff',
          bg_opacity: 0.5,
          height: 40,
          complete: false
        });
        Controller.__super__.initialize.call(this, options);
        return this.layout.model.on('change:optioncount', this._changeOptionCount);
      };

      Controller.prototype.renderElement = function() {
        var optionCollection, optionsObj;
        optionsObj = this.layout.model.get('elements');
        if (this.layout.model.get('elements') instanceof Backbone.Collection) {
          optionsObj = this.layout.model.get('elements').toJSON();
        }
        console.log(optionsObj);
        this._parseOptions(optionsObj);
        if (!(optionsObj instanceof Backbone.Collection)) {
          optionCollection = App.request("create:new:option:collection", optionsObj);
          optionCollection.comparator = 'index';
          optionCollection.sort();
          this.layout.model.set('elements', optionCollection);
        }
        this.view = this._getSortView();
        this.listenTo(this.view, 'show show:this:sort:properties', (function(_this) {
          return function() {
            return App.execute("show:question:properties", {
              model: _this.layout.model
            });
          };
        })(this));
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype._getSortView = function() {
        return new Sort.Views.SortView({
          collection: this.layout.model.get('elements'),
          sort_model: this.layout.model
        });
      };

      Controller.prototype._parseOptions = function(optionsObj) {
        return _.each(optionsObj, function(option) {
          if (option.optionNo != null) {
            option.optionNo = parseInt(option.optionNo);
          }
          if (option.marks != null) {
            option.marks = parseInt(option.marks);
          }
          if (option.index != null) {
            return option.index = parseInt(option.index);
          }
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
              optionNo: _.uniqueId(),
              index: oldval
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

      Controller.prototype.deleteElement = function(model) {
        model.set('elements', '');
        delete model.get('elements');
        console.log(model.get('elements'));
        Controller.__super__.deleteElement.call(this, model);
        return App.execute("close:question:properties");
      };

      return Controller;

    })(Element.Controller);
  });
});
