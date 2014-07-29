var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/view', 'apps/content-preview/content-board/elements-loader'], function(App, RegionController) {
  return App.module("ContentPreview.ContentBoard", function(ContentBoard, App, Backbone, Marionette, $, _) {
    return ContentBoard.Controller = (function(_super) {
      var API, answerModel, answerWreqrObject;

      __extends(Controller, _super);

      function Controller() {
        this._getContentBoardView = __bind(this._getContentBoardView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      answerWreqrObject = null;

      answerModel = null;

      Controller.prototype.initialize = function(options) {
        this.model = options.model, answerWreqrObject = options.answerWreqrObject, answerModel = options.answerModel;
        this.view = this._getContentBoardView();
        this.listenTo(this.view, "add:new:element", function(container, type) {
          return App.request("add:new:element", container, type);
        });
        this.listenTo(this.view, 'dependencies:fetched', (function(_this) {
          return function() {
            return _this.startFillingElements();
          };
        })(this));
        App.commands.setHandler("show:response", (function(_this) {
          return function(marks, total) {
            return _this.view.triggerMethod('show:response', parseInt(marks), parseInt(total));
          };
        })(this));
        return this.show(this.view, {
          loading: true,
          entities: [this.elements]
        });
      };

      Controller.prototype._getContentBoardView = function() {
        return new ContentBoard.Views.ContentBoardView({
          model: this.model
        });
      };

      Controller.prototype.startFillingElements = function() {
        var container, section;
        section = this.view.model.get('layout');
        container = $('#myCanvas #question-area');
        return _.each(section, (function(_this) {
          return function(element, i) {
            if (element.element === 'Row' || element.element === 'TeacherQuestion') {
              return _this.addNestedElements(container, element);
            } else {
              return App.request("add:new:element", container, element.element, element);
            }
          };
        })(this));
      };

      Controller.prototype.addNestedElements = function(container, element) {
        var controller;
        controller = App.request("add:new:element", container, element.element, element);
        return _.each(element.elements, (function(_this) {
          return function(column, index) {
            if (!column.elements) {
              return;
            }
            container = controller.layout.elementRegion.currentView.$el.children().eq(index);
            return _.each(column.elements, function(ele, i) {
              if (ele.element === 'Row') {
                return _this.addNestedElements($(container), ele);
              } else {
                return App.request("add:new:element", container, ele.element, ele);
              }
            });
          };
        })(this));
      };

      API = {
        addNewElement: function(container, type, modelData) {
          return new ContentBoard.Element[type].Controller({
            container: container,
            modelData: modelData,
            answerWreqrObject: answerWreqrObject,
            answerModel: answerModel
          });
        }
      };

      App.commands.setHandler('show:content:board', function(options) {
        return new ContentBoard.Controller(options);
      });

      App.reqres.setHandler("add:new:element", function(container, type, modelData) {
        if (modelData == null) {
          modelData = {};
        }
        return API.addNewElement(container, type, modelData);
      });

      return Controller;

    })(RegionController);
  });
});
