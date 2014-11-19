var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-board/element/controller', 'apps/content-board/view', 'apps/content-board/elements-loader'], function(App, RegionController) {
  return App.module("ContentPreview.ContentBoard", function(ContentBoard, App, Backbone, Marionette, $, _) {
    return ContentBoard.Controller = (function(_super) {
      var API, answerModel, answerWreqrObject, quizModel;

      __extends(Controller, _super);

      function Controller() {
        this._getContentBoardView = __bind(this._getContentBoardView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      answerWreqrObject = null;

      answerModel = null;

      quizModel = null;

      Controller.prototype.initialize = function(options) {
        var allVideoIds, getDecryptedVideoIdsAndUrl;
        this.model = options.model, answerWreqrObject = options.answerWreqrObject, answerModel = options.answerModel, this.quizModel = options.quizModel;
        quizModel = this.quizModel;
        if (quizModel.get('videoIDs')) {
          navigator.notification.activityStart("Please wait", "loading content...");
          $('body').addClass('disableTouchForView');
          allVideoIds = quizModel.get('videoIDs');
          getDecryptedVideoIdsAndUrl = _.decryptVideos(allVideoIds);
          return getDecryptedVideoIdsAndUrl.done((function(_this) {
            return function(decryptedVideoPathandId) {
              console.log(decryptedVideoPathandId);
              $('body').removeClass('disableTouchForView');
              navigator.notification.activityStop();
              _this.view = _this._getContentBoardView();
              _this.listenTo(_this.view, "add:new:element", function(container, type) {
                return App.request("add:new:element", container, type);
              });
              _this.listenTo(_this.view, "close", function() {
                var audioEls;
                audioEls = _this.view.$el.find('.audio');
                return _.each(audioEls, function(el, ind) {
                  return $(el).find('.pause').trigger('click');
                });
              });
              _this.listenTo(_this.view, 'dependencies:fetched', function() {
                var fillElements;
                fillElements = _this.startFillingElements();
                return fillElements.done(function() {
                  return setTimeout(function() {
                    $('#loading-content-board').remove();
                    return $('#question-area').removeClass('vHidden');
                  }, 500);
                });
              });
              App.commands.setHandler("show:response", function(marks, total) {
                return _this.view.triggerMethod('show:response', parseFloat(marks).toFixed(1), parseFloat(total).toFixed(1));
              });
              return _this.show(_this.view, {
                loading: true,
                entities: [_this.elements]
              });
            };
          })(this));
        } else {
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
                  $('#loading-content-board').remove();
                  return $('#question-area').removeClass('vHidden');
                }, 500);
              });
            };
          })(this));
          App.commands.setHandler("show:response", (function(_this) {
            return function(marks, total) {
              return _this.view.triggerMethod('show:response', parseFloat(marks).toFixed(1), parseFloat(total).toFixed(1));
            };
          })(this));
          return this.show(this.view, {
            loading: true,
            entities: [this.elements]
          });
        }
      };

      Controller.prototype._getContentBoardView = function() {
        return new ContentBoard.Views.ContentBoardView({
          model: this.model,
          quizModel: this.quizModel,
          answerModel: answerModel
        });
      };

      Controller.prototype.startFillingElements = function() {
        var allItemsDeferred, container, section;
        section = this.view.model.get('layout');
        allItemsDeferred = $.Deferred();
        container = $('#myCanvas #question-area');
        _.each(section, (function(_this) {
          return function(element, i) {
            var itemsDeferred, nestedItems;
            itemsDeferred = $.Deferred();
            if (element.element === 'Row' || element.element === 'TeacherQuestion') {
              nestedItems = _this.addNestedElements(container, element);
              nestedItems.done(function() {
                return itemsDeferred.resolve();
              });
            } else {
              App.request("add:new:element", container, element.element, element);
              itemsDeferred.resolve();
            }
            itemsDeferred.promise();
            if (i === _.size(section) - 1) {
              return allItemsDeferred.resolve();
            }
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
            nestedDef = $.Deferred();
            if (!column.elements) {
              return nestedDef.resolve();
            }
            container = controller.layout.elementRegion.currentView.$el.children().eq(index);
            _.each(column.elements, function(ele, i) {
              var addedElement;
              if (ele.element === 'Row') {
                addedElement = _this.addNestedElements($(container), ele);
                return addedElement.done(function() {
                  return nestedDef.resolve();
                });
              } else {
                App.request("add:new:element", container, ele.element, ele);
                return nestedDef.resolve();
              }
            });
            nestedDef.promise();
            if (index === _.size(element.elements) - 1) {
              return nestedDef.done(function() {
                return defer.resolve();
              });
            }
          };
        })(this));
        return defer.promise();
      };

      API = {
        addNewElement: function(container, type, modelData) {
          var decryptedMedia;
          console.log(type);
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
