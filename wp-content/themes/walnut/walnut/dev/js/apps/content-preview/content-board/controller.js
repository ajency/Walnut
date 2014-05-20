var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/view', 'apps/content-preview/content-board/elements-loader'], function(App, RegionController) {
  var container;
  App.module("ContentPreview.ContentBoard", function(ContentBoard, App, Backbone, Marionette, $, _) {
    return ContentBoard.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getContentBoardView = __bind(this._getContentBoardView, this);
        this.triggerShowResponse = __bind(this.triggerShowResponse, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var answerData, triggerOnce;
        this.model = options.model;
        answerData = {
          marks: 0,
          total: 0
        };
        this.view = this._getContentBoardView();
        this.listenTo(this.view, "add:new:element", function(container, type) {
          return App.request("add:new:element", container, type);
        });
        this.listenTo(this.view, 'dependencies:fetched', (function(_this) {
          return function() {
            return _this.startFillingElements();
          };
        })(this));
        triggerOnce = _.once(_.bind(this.triggerShowResponse, this, answerData));
        App.commands.setHandler("show:response", (function(_this) {
          return function(marks, total) {
            answerData.marks += parseInt(marks);
            answerData.total += parseInt(total);
            return triggerOnce();
          };
        })(this));
        return this.show(this.view, {
          loading: true,
          entities: [this.elements]
        });
      };

      Controller.prototype.triggerShowResponse = function(answerData) {
        return this.view.triggerMethod('show:response', answerData.marks, answerData.total);
      };

      Controller.prototype._getContentBoardView = function() {
        return new ContentBoard.Views.ContentBoardView({
          model: this.model
        });
      };

      Controller.prototype.startFillingElements = function() {
        var section;
        return section = this.view.model.get('layout');
      };

      return Controller;

    })(RegionController);
  });
  container = $('#myCanvas #question-area');
  return _.each(section, (function(_this) {
    return function(element, i) {
      var API;
      if (element.element === 'Row' || element.element === 'TeacherQuestion') {
        return _this.addNestedElements(container, element);
      } else {
        App.request("add:new:element", container, element.element, element({
          addNestedElements: function(container, element) {
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
          }
        }));
        API = {
          addNewElement: function(container, type, modelData) {
            console.log(type);
            return new ContentBoard.Element[type].Controller({
              container: container,
              modelData: modelData
            });
          }
        };
        App.commands.setHandler('show:content:board', function(options) {
          return new ContentBoard.Controller(options);
        });
        return App.reqres.setHandler("add:new:element", function(container, type, modelData) {
          if (modelData == null) {
            modelData = {};
          }
          return API.addNewElement(container, type, modelData);
        });
      }
    };
  })(this));
});
