var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/content-builder/view', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements-loader', 'apps/content-creator/content-builder/autosave/controller'], function(App, RegionController) {
  return App.module("ContentCreator.ContentBuilder", function(ContentBuilder, App, Backbone, Marionette, $, _) {
    var API, ContentBuilderController;
    ContentBuilderController = (function(_super) {
      __extends(ContentBuilderController, _super);

      function ContentBuilderController() {
        return ContentBuilderController.__super__.constructor.apply(this, arguments);
      }

      ContentBuilderController.prototype.initialize = function(options) {
        var elements, eventObj;
        eventObj = options.eventObj;
        elements = App.request("get:page:json");
        this.view = this._getContentBuilderView(elements);
        this.listenTo(this.view, "add:new:element", function(container, type) {
          return App.request("add:new:element", container, type, eventObj);
        });
        this.listenTo(this.view, "dependencies:fetched", (function(_this) {
          return function() {
            return _.delay(function() {
              return _this.startFillingElements(eventObj);
            }, 400);
          };
        })(this));
        return this.show(this.view, {
          loading: true
        });
      };

      ContentBuilderController.prototype._getContentBuilderView = function(elements) {
        return new ContentBuilder.Views.ContentBuilderView({
          model: elements
        });
      };

      ContentBuilderController.prototype._getContainer = function(section) {
        return $('#myCanvas');
      };

      ContentBuilderController.prototype.startFillingElements = function(eventObj) {
        var container, section;
        section = this.view.model.toJSON();
        container = $('#myCanvas');
        return _.each(section, (function(_this) {
          return function(element, i) {
            if (element.element === 'Row') {
              return _this.addNestedElements(container, element, eventObj);
            } else {
              return App.request("add:new:element", container, element.element, eventObj, element);
            }
          };
        })(this));
      };

      ContentBuilderController.prototype.addNestedElements = function(container, element, eventObj) {
        var controller;
        controller = App.request("add:new:element", container, element.element, element);
        console.log(element.elements);
        return _.each(element.elements, (function(_this) {
          return function(column, index) {
            if (column.elements.length === 0) {
              return;
            }
            container = controller.layout.elementRegion.currentView.$el.children().eq(index);
            return _.each(column.elements, function(ele, i) {
              if (ele.element === 'Row') {
                return _this.addNestedElements($(container), ele);
              } else {
                return App.request("add:new:element", container, ele.element, eventObj, ele);
              }
            });
          };
        })(this));
      };

      return ContentBuilderController;

    })(RegionController);
    API = {
      addNewElement: function(container, type, modelData, eventObj) {
        console.log(type);
        return new ContentBuilder.Element[type].Controller({
          container: container,
          modelData: modelData,
          eventObj: eventObj
        });
      },
      saveQuestion: function() {
        var autoSave;
        autoSave = App.request("autosave:question:layout");
        return autoSave.autoSave();
      }
    };
    App.commands.setHandler("show:content:builder", function(options) {
      return new ContentBuilderController(options);
    });
    App.reqres.setHandler("add:new:element", function(container, type, eventObj, modelData) {
      if (modelData == null) {
        modelData = {};
      }
      return API.addNewElement(container, type, modelData, eventObj);
    });
    return App.commands.setHandler("save:question", function() {
      return API.saveQuestion();
    });
  });
});
