var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/content-builder/view', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements-loader', 'apps/content-creator/content-builder/autosave/controller'], function(App, RegionController) {
  return App.module("ContentCreator.ContentBuilder", function(ContentBuilder, App, Backbone, Marionette, $, _) {
    var API, ContentBuilderController, contentPieceModel;
    contentPieceModel = null;
    ContentBuilderController = (function(superClass) {
      extend(ContentBuilderController, superClass);

      function ContentBuilderController() {
        return ContentBuilderController.__super__.constructor.apply(this, arguments);
      }

      ContentBuilderController.prototype.initialize = function(options) {
        contentPieceModel = options.contentPieceModel, this.eventObj = options.eventObj;
        console.log(this.eventObj);
        this.view = this._getContentBuilderView(contentPieceModel);
        this.listenTo(this.view, "add:new:element", function(container, type) {
          return App.request("add:new:element", container, type, this.eventObj);
        });
        this.listenTo(this.view, "dependencies:fetched", (function(_this) {
          return function() {
            return _.delay(function() {
              return _this.startFillingElements();
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

      ContentBuilderController.prototype._getContainer = function() {
        return this.view.$el.find('#myCanvas');
      };

      ContentBuilderController.prototype.startFillingElements = function() {
        var container, section;
        section = this.view.model.get('layout');
        container = this._getContainer();
        return _.each(section, (function(_this) {
          return function(element, i) {
            if (element.element === 'Row' || element.element === 'TeacherQuestion') {
              return _this.addNestedElements(container, element);
            } else {
              return App.request("add:new:element", container, element.element, _this.eventObj, element);
            }
          };
        })(this));
      };

      ContentBuilderController.prototype.addNestedElements = function(container, element) {
        var controller;
        controller = App.request("add:new:element", container, element.element, null, element);
        return _.each(element.elements, (function(_this) {
          return function(column, index) {
            if (!column.elements) {
              return;
            }
            container = controller.layout.elementRegion.currentView.$el.children().eq(index);
            return _.each(column.elements, function(ele, i) {
              if (ele.element === 'Row' || element.element === 'TeacherQuestion') {
                return _this.addNestedElements($(container), ele);
              } else {
                return App.request("add:new:element", container, ele.element, _this.eventObj, ele);
              }
            });
          };
        })(this));
      };

      return ContentBuilderController;

    })(RegionController);
    API = {
      addNewElement: function(container, type, eventObj, modelData) {
        console.log(type);
        return new ContentBuilder.Element[type].Controller({
          container: container,
          modelData: modelData,
          eventObj: eventObj
        });
      },
      saveQuestion: (function(_this) {
        return function() {
          var autoSave;
          autoSave = App.request("autosave:question:layout");
          return autoSave.autoSave(contentPieceModel);
        };
      })(this)
    };
    App.commands.setHandler("show:content:builder", function(options) {
      return new ContentBuilderController(options);
    });
    App.reqres.setHandler("add:new:element", function(container, type, eventObj, modelData) {
      if (modelData == null) {
        modelData = {};
      }
      return API.addNewElement(container, type, eventObj, modelData);
    });
    return App.commands.setHandler("save:question", function(contentPieceModel) {
      return API.saveQuestion(contentPieceModel);
    });
  });
});
