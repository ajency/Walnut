var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/element-controller', 'apps/content-creator/content-builder/element/views'], function(App, ElementController) {
  return App.module('ContentCreator.ContentBuilder.Element', function(Element, App, Backbone, Marionette, $, _) {
    return Element.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this.setMargin = bind(this.setMargin, this);
        this.setDraggable = bind(this.setDraggable, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var container, element, modelData, options, ref;
        container = opts.container, modelData = opts.modelData, this.eventObj = opts.eventObj;
        options = {
          draggable: true,
          style: '',
          bottom_margin: '',
          top_margin: '',
          left_margin: '',
          right_margin: ''
        };
        _.defaults(modelData, options);
        if ((ref = modelData.element) === 'Mcq' || ref === 'Fib' || ref === 'Sort' || ref === 'Hotspot' || ref === 'BigAnswer') {
          this.eventObj.vent.trigger("question:element:added");
        }
        element = App.request("create:new:element", modelData);
        this.layout = this._getView(element);
        this.listenTo(this.layout, "show:setting:popup", function(model) {
          var ele;
          ele = _.slugify(model.get('element'));
          return App.vent.trigger("show:" + ele + ":settings:popup", model);
        });
        this.listenTo(this.layout, "delete:element", (function(_this) {
          return function(model) {
            if (confirm("Are you sure?")) {
              return _this.deleteElement(model);
            }
          };
        })(this));
        this.listenTo(this.layout, "bind:element:events", this.bindEvents);
        this.listenTo(element, "destroy", (function(_this) {
          return function() {
            if (_this.layout.$el.parent().hasClass('column') && _this.layout.$el.parent().children('.element-wrapper').length === 1) {
              _this.layout.$el.parent().addClass('empty-column');
            }
            return _this.layout.close();
          };
        })(this));
        this.layout.elementRegion.on("show", (function(_this) {
          return function(view) {
            var i, len, margin, model, ref1, results;
            model = Marionette.getOption(_this.layout, 'model');
            ref1 = ['top_margin', 'left_margin', 'right_margin', 'bottom_margin'];
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              margin = ref1[i];
              results.push(_this.layout.setMargin(model.get(margin)));
            }
            return results;
          };
        })(this));
        if (element.isNew()) {
          App.execute("when:fetched", element, (function(_this) {
            return function() {
              _this.layout.triggerMethod("before:render:element");
              return _this.renderElement();
            };
          })(this));
        }
        return this.add(this.layout, $(container));
      };

      Controller.prototype.bindEvents = function() {
        this.listenTo(this.layout.model, "change:draggable", this.setDraggable);
        this.listenTo(this.layout.model, "change:top_margin", this.setMargin);
        this.listenTo(this.layout.model, "change:bottom_margin", this.setMargin);
        this.listenTo(this.layout.model, "change:left_margin", this.setMargin);
        return this.listenTo(this.layout.model, "change:right_margin", this.setMargin);
      };

      Controller.prototype.setDraggable = function(model) {
        return this.layout.setDraggable(model.get('draggable'));
      };

      Controller.prototype.setMargin = function(model) {
        var prevMargin, prop;
        prop = _.chain(_.keys(model.changed)).first().value();
        prevMargin = model.previous(prop);
        return this.layout.setMargin(model.get(prop), prevMargin);
      };

      Controller.prototype._getView = function(elementModel) {
        return new Element.Views.ElementView({
          model: elementModel
        });
      };

      Controller.prototype._getElementTemplate = function(eleModel) {
        var model, ref, style, styles;
        model = App.request("get:element:settings:options", eleModel.get('element'));
        styles = model.get('styles');
        style = _.findWhere(styles, {
          name: eleModel.get('style')
        });
        return (ref = style['template']) != null ? ref : '';
      };

      Controller.prototype.removeSpinner = function() {};

      Controller.prototype.deleteElement = function(model) {
        var ref;
        if ((ref = model.get('element')) === 'Mcq' || ref === 'Fib' || ref === 'Sort' || ref === 'Hotspot' || ref === 'BigAnswer' || ref === 'TeacherQuestion') {
          this.eventObj.vent.trigger("question:element:removed");
        }
        return model.destroy({
          wait: true
        });
      };

      return Controller;

    })(ElementController);
  });
});
