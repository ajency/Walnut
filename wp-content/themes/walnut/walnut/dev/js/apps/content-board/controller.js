var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-board/element/controller', 'apps/content-board/view', 'apps/content-board/elements-loader'], function(App, RegionController) {
  return App.module("ContentPreview.ContentBoard", function(ContentBoard, App, Backbone, Marionette, $, _) {
    return ContentBoard.Controller = (function(_super) {
      var API, answerModel, answerWreqrObject, quizModel;

      __extends(Controller, _super);

      function Controller() {
        this.addNestedElements = __bind(this.addNestedElements, this);
        this.startFillingElements = __bind(this.startFillingElements, this);
        this._getContentBoardView = __bind(this._getContentBoardView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      answerWreqrObject = null;

      answerModel = null;

      quizModel = null;

      Controller.prototype.initialize = function(options) {
        this.model = options.model, answerWreqrObject = options.answerWreqrObject, answerModel = options.answerModel, this.quizModel = options.quizModel;
        quizModel = this.quizModel;
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
            _this.startFillingElements();
            return setTimeout(function() {
              $('#question-area').removeClass('vHidden');
              return $('#loading-content-board').remove();
            }, 300);
          };
        })(this));
        App.commands.setHandler("show:response", (function(_this) {
          return function(marks, total) {
            return _this.view.triggerMethod('show:response', parseFloat(marks).toFixed(1), parseFloat(total).toFixed(1));
          };
        })(this));
        return setTimeout((function(_this) {
          return function() {
            return _this.show(_this.view, {
              loading: true,
              entities: [_this.elements]
            });
          };
        })(this), 800);
      };

      Controller.prototype._getContentBoardView = function() {
        return new ContentBoard.Views.ContentBoardView({
          model: this.model,
          quizModel: this.quizModel,
          answerModel: answerModel
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
          var decryptedMedia;
          if (type === 'Video') {
            decryptedMedia = quizModel.get('videoIDs');
          }
          return new ContentBoard.Element[type].Controller({
            container: container,
            modelData: modelData,
            answerWreqrObject: answerWreqrObject,
            answerModel: answerModel,
            decryptedMedia: decryptedMedia
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
