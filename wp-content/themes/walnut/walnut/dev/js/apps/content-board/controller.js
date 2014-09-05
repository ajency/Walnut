var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-board/element/controller', 'apps/content-board/view', 'apps/content-board/elements-loader'], function(App, RegionController) {
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
        this.model = options.model, answerWreqrObject = options.answerWreqrObject, answerModel = options.answerModel, this.quizModel = options.quizModel;
        this.view = this._getContentBoardView();
        this.listenTo(this.view, "add:new:element", function(container, type) {
          return App.request("add:new:element", container, type);
        });
        this.listenTo(this.view, "close", (function(_this) {
          return function() {
            var audioEls;
            audioEls = _this.view.$el.find('.audio');
            return _.each(audioEls, function(el, ind) {
              return $(el).find('.pause').trigger('click');
            });
          };
        })(this));
        this.listenTo(this.view, 'dependencies:fetched', (function(_this) {
          return function() {
            var fillElements;
            fillElements = _this.startFillingElements();
            return fillElements.done(function() {
              return setTimeout(function() {
                $('#loading-content').hide();
                return $('#question-area').show();
              }, 2000);
            });
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
          model: this.model,
          quizModel: this.quizModel
        });
      };

      Controller.prototype.startFillingElements = function() {
        var allItemsDeferred, container, itemsDeferred, section;
        section = this.view.model.get('layout');
        allItemsDeferred = $.Deferred();
        itemsDeferred = [];
        container = $('#myCanvas #question-area');
        _.each(section, (function(_this) {
          return function(element, i) {
            var nestedItems;
            itemsDeferred[i] = $.Deferred();
            nestedItems = [];
            if (element.element === 'Row' || element.element === 'TeacherQuestion') {
              nestedItems[i] = _this.addNestedElements(container, element);
              nestedItems[i].done(function() {
                return itemsDeferred[i].resolve();
              });
            } else {
              App.request("add:new:element", container, element.element, element);
              itemsDeferred[i].resolve();
            }
            itemsDeferred[i].promise();
            return $.when(itemsDeferred[0], itemsDeferred[1], itemsDeferred[2]).done(function() {
              return allItemsDeferred.resolve();
            });
          };
        })(this));
        return allItemsDeferred.promise();
      };

      Controller.prototype.addNestedElements = function(container, element) {
        var controller, defer;
        defer = $.Deferred();
        controller = App.request("add:new:element", container, element.element, element);
        _.each(element.elements, (function(_this) {
          return function(column, index) {
            var nestedDef;
            if (!column.elements) {
              return;
            }
            container = controller.layout.elementRegion.currentView.$el.children().eq(index);
            nestedDef = [];
            _.each(column.elements, function(ele, i) {
              var addedElement;
              nestedDef[i] = $.Deferred();
              if (ele.element === 'Row') {
                addedElement = _this.addNestedElements($(container), ele);
                return addedElement.done(function() {
                  return nestedDef[i].resolve();
                });
              } else {
                App.request("add:new:element", container, ele.element, ele);
                return nestedDef[i].resolve();
              }
            });
            return $.when(nestedDef[0], nestedDef[1]).done(function() {
              return defer.resolve();
            });
          };
        })(this));
        return defer.promise();
      };

      API = {
        addNewElement: function(container, type, modelData) {
          console.log(type);
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
