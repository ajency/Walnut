var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/sort/views'], function(App, Element) {
  return App.module("ContentCreator.ContentBuilder.Element.Sort", function(Sort, App, Backbone, Marionette, $, _) {
    return Sort.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._changeOptionCount = __bind(this._changeOptionCount, this);
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
          bg_opacity: 1,
          height: 40
        });
        Controller.__super__.initialize.call(this, options);
        return this.layout.model.on('change:optioncount', this._changeOptionCount);
      };

      Controller.prototype.renderElement = function() {
        var optionCollection, optionsObj, view;
        optionsObj = this.layout.model.get('elements');
        if (optionsObj instanceof Backbone.Collection) {
          optionCollection = optionsObj;
        } else {
          optionCollection = App.request("create:new:option:collection", optionsObj);
          this.layout.model.set('elements', optionCollection);
        }
        this.view = view = this._getSortView(optionCollection);
        this.listenTo(view, 'show show:this:sort:properties', (function(_this) {
          return function() {
            return App.execute("show:question:properties", {
              model: _this.layout.model
            });
          };
        })(this));
        return this.layout.elementRegion.show(view);
      };

      Controller.prototype._getSortView = function(collection) {
        return new Sort.Views.SortView({
          collection: collection,
          sort_model: this.layout.model
        });
      };

      Controller.prototype.deleteElement = function(model) {
        model.set('elements', '');
        delete model.get('elements');
        model.destroy();
        return App.execute("close:question:properties");
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

      return Controller;

    })(Element.Controller);
  });
});
