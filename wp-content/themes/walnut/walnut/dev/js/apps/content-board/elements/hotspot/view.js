var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentPreview.ContentBoard.Element.Hotspot.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.HotspotView = (function(_super) {
      __extends(HotspotView, _super);

      function HotspotView() {
        this._iterateThruOptions = __bind(this._iterateThruOptions, this);
        this._onOutsideClick = __bind(this._onOutsideClick, this);
        this._autoPopulateAnswers = __bind(this._autoPopulateAnswers, this);
        return HotspotView.__super__.constructor.apply(this, arguments);
      }

      HotspotView.prototype.className = 'stage';

      HotspotView.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        this.answerModel = opt.answerModel;
        this.textCollection = this.model.get('textCollection');
        this.optionCollection = this.model.get('optionCollection');
        this.imageCollection = this.model.get('imageCollection');
        this.stageName = _.uniqueId('stage');
        this.imageLayer = new Kinetic.Layer({
          name: 'imageLayer'
        });
        this.optionLayer = new Kinetic.Layer({
          name: 'optionLayer'
        });
        this.textLayer = new Kinetic.Layer({
          name: 'textLayer'
        });
        this.answerLayer = new Kinetic.Layer({
          name: 'answerLayer'
        });
        return this.feedbackLayer = new Kinetic.Layer({
          name: 'feedbackLayer'
        });
      };

      HotspotView.prototype.onRender = function() {
        return this.$el.attr('id', this.stageName);
      };

      HotspotView.prototype.onShow = function() {
        this.stage = new Kinetic.Stage({
          container: this.stageName,
          width: this.$el.parent().width(),
          height: this.$el.parent().height() + 80
        });
        if (this.model.get('height') !== 0) {
          this.stage.height(this.model.get('height'));
        }
        this.stage.add(this.imageLayer);
        this.stage.add(this.textLayer);
        this.stage.add(this.optionLayer);
        this.stage.add(this.answerLayer);
        this.stage.add(this.feedbackLayer);
        this._addBorderBox();
        this._drawExistingElements();
        this._clickHandler();
        this.$el.closest('.preview').find('#submit-answer-button').on('click', (function(_this) {
          return function() {
            return _this.trigger("submit:answer");
          };
        })(this));
        return this._autoPopulateAnswers();
      };

      HotspotView.prototype._autoPopulateAnswers = function() {
        var answerArray, answerModel;
        answerModel = Marionette.getOption(this, 'answerModel');
        if (answerModel && answerModel.get('status') !== 'not_attempted') {
          answerArray = answerModel.get('answer');
          _.each(answerArray, (function(_this) {
            return function(ans, index) {
              var optionModel;
              if (_.str.include(ans.id, "option")) {
                optionModel = _.find(_this.optionLayer.getChildren(), function(option) {
                  if (option.attrs.id === ans.id) {
                    return true;
                  } else {
                    return false;
                  }
                });
                if (!_this.model.get('transparent')) {
                  return _this._setBlinker(optionModel);
                } else {
                  return _this._setBlinker(null, ans);
                }
              } else {
                return _this._setBlinker(null, ans);
              }
            };
          })(this));
          if (Marionette.getOption(this, 'displayAnswer')) {
            return this.trigger("submit:answer");
          }
        }
      };

      HotspotView.prototype._clickHandler = function() {
        _.each(this.optionLayer.getChildren(), this._iterateThruOptions);
        if (this.model.get('transparent')) {
          return this.stage.on('click', this._onOutsideClick);
        }
      };

      HotspotView.prototype._onOutsideClick = function() {
        var answerObject;
        answerObject = this.stage.getPointerPosition();
        answerObject.id = _.uniqueId('out');
        this.answerModel.get('answer').push(answerObject);
        return this._setBlinker(null, answerObject);
      };

      HotspotView.prototype._iterateThruOptions = function(option) {
        return option.on('click', _.bind(this._onOptionClick, this, option));
      };

      HotspotView.prototype._onOptionClick = function(option, evt) {
        var answerObject;
        evt.cancelBubble = true;
        answerObject = this.stage.getPointerPosition();
        answerObject.id = option.id();
        if (!_.contains(_.pluck(this.answerModel.get('answer'), 'id'), option.id())) {
          this.answerModel.get('answer').push(answerObject);
          if (!this.model.get('transparent')) {
            return this._setBlinker(option);
          } else {
            return this._setBlinker(null, answerObject);
          }
        }
      };

      HotspotView.prototype._setBlinker = function(option, answerObject) {
        var anim, blinker, period;
        blinker = null;
        if (option) {
          if (option.className === 'Circle') {
            blinker = new Kinetic.Circle({
              name: option.id(),
              x: option.x(),
              y: option.y(),
              opacity: 0.5,
              radius: option.radius(),
              fill: 'blue'
            });
          } else if (option.className === 'Rect') {
            blinker = new Kinetic.Rect({
              name: option.id(),
              x: option.x() + option.width() / 2,
              y: option.y() + option.height() / 2,
              height: option.height(),
              width: option.width(),
              offset: {
                x: option.width() / 2,
                y: option.height() / 2
              },
              opacity: 0.5,
              fill: 'blue',
              rotation: option.rotation()
            });
          }
        } else {
          blinker = new Kinetic.Circle({
            name: answerObject.id,
            x: answerObject.x,
            y: answerObject.y,
            radius: 20,
            opacity: 0.5,
            fill: 'blue'
          });
        }
        this.answerLayer.add(blinker);
        period = 3000;
        anim = new Kinetic.Animation(function(frame) {
          var scale;
          scale = Math.sin(frame.time * 2 * Math.PI / period) + 0.001;
          return blinker.scale({
            x: scale / 4 - 0.75,
            y: scale / 4 - 0.75
          });
        }, this.answerLayer);
        anim.start();
        this.listenTo(this, "show:feedback", function() {
          return anim.stop();
        });
        return blinker.on('click', (function(_this) {
          return function() {
            answerObject = _.findWhere(_this.answerModel.get('answer'), {
              id: blinker.name()
            });
            _this.answerModel.set('answer', _.without(_this.answerModel.get('answer'), answerObject));
            blinker.off('click');
            return blinker.destroy();
          };
        })(this));
      };

      HotspotView.prototype.onShowFeedback = function() {
        var answerId, answeredCorrectly, answeredWrongly, correctOptions, correctOptionsIds;
        this.answerLayer.remove();
        correctOptions = this.optionCollection.where({
          correct: true
        });
        correctOptionsIds = _.pluck(correctOptions, 'id');
        answerId = _.pluck(this.answerModel.get('answer'), 'id');
        answeredWrongly = _.difference(answerId, correctOptionsIds);
        answeredCorrectly = _.intersection(answerId, correctOptionsIds);
        return this._loadFeedbackImages({
          answers: correctOptionsIds,
          correct: answeredCorrectly,
          wrong: answeredWrongly
        });
      };

      HotspotView.prototype._loadFeedbackImages = function(options) {
        var correctImage, wrongImage;
        this._showCorrectAnswers(options.answers);
        correctImage = new Image();
        correctImage.onload = (function(_this) {
          return function() {
            _this._showMyAnswers(options.correct, correctImage);
            if (_.platform() === 'BROWSER') {
              return correctImage.src = THEMEURL + '/images/right-ans.gif';
            } else {
              return correctImage.src = '/images/right-ans.gif';
            }
          };
        })(this);
        wrongImage = new Image();
        wrongImage.onload = (function(_this) {
          return function() {
            return _this._showMyAnswers(options.wrong, wrongImage);
          };
        })(this);
        if (_.platform() === 'BROWSER') {
          return wrongImage.src = THEMEURL + '/images/wrong-ans.gif';
        } else {
          return wrongImage.src = '/images/wrong-ans.gif';
        }
      };

      HotspotView.prototype._showMyAnswers = function(answersId, image) {
        _.each(answersId, (function(_this) {
          return function(answerId) {
            var answerShape, feedback;
            answerShape = _.find(_this.answerLayer.getChildren(), function(answer) {
              return answer.name() === answerId;
            });
            console.log(answerShape);
            if (answerShape.className === 'Circle') {
              feedback = new Kinetic.Circle({
                x: answerShape.x(),
                y: answerShape.y(),
                radius: answerShape.radius(),
                fillPatternImage: image,
                fillPatternRepeat: 'no-repeat',
                fillPatternOffset: {
                  x: 20,
                  y: 20
                }
              });
            } else {
              feedback = new Kinetic.Rect({
                x: answerShape.x() - answerShape.width() / 2,
                y: answerShape.y() - answerShape.height() / 2,
                width: answerShape.width(),
                height: answerShape.height(),
                fillPatternImage: image,
                fillPatternX: answerShape.width() / 2 - 20,
                fillPatternY: answerShape.height() / 2 - 20,
                fillPatternRepeat: 'no-repeat'
              });
            }
            return _this.feedbackLayer.add(feedback);
          };
        })(this));
        return this.feedbackLayer.draw();
      };

      HotspotView.prototype._showCorrectAnswers = function(correctOptopns) {
        _.each(correctOptopns, (function(_this) {
          return function(correctId) {
            var correctAnswer, feedbackCorrect;
            correctAnswer = _.find(_this.optionLayer.getChildren(), function(answer) {
              return answer.id() === correctId;
            });
            if (correctAnswer.className === 'Circle') {
              feedbackCorrect = new Kinetic.Circle({
                x: correctAnswer.x(),
                y: correctAnswer.y(),
                radius: correctAnswer.radius(),
                stroke: 'green',
                strokeWidth: 6
              });
            } else {
              feedbackCorrect = new Kinetic.Rect({
                x: correctAnswer.x(),
                y: correctAnswer.y(),
                width: correctAnswer.width(),
                height: correctAnswer.height(),
                stroke: 'green',
                strokeWidth: 6
              });
            }
            return _this.feedbackLayer.add(feedbackCorrect);
          };
        })(this));
        return this.feedbackLayer.draw();
      };

      HotspotView.prototype._addBorderBox = function() {
        var borderBox;
        borderBox = new Kinetic.Rect({
          name: "border",
          x: 0,
          y: 0,
          width: this.$el.parent().width(),
          height: this.model.get('height'),
          stroke: 'black',
          strokeWidth: 1
        });
        this.imageLayer.add(borderBox);
        return this.imageLayer.draw();
      };

      HotspotView.prototype._drawExistingElements = function() {
        console.log(this.textCollection);
        this.textCollection.each((function(_this) {
          return function(model, i) {
            return _this._addEachElements('Hotspot-Text', model);
          };
        })(this));
        this.optionCollection.each((function(_this) {
          return function(model, i) {
            if (model.get('shape') === 'Rect') {
              _this._addEachElements('Hotspot-Rectangle', model);
            }
            if (model.get('shape') === 'Circle') {
              return _this._addEachElements('Hotspot-Circle', model);
            }
          };
        })(this));
        return this.imageCollection.each((function(_this) {
          return function(model, i) {
            return _this._addEachElements('Hotspot-Image', model);
          };
        })(this));
      };

      HotspotView.prototype._addEachElements = function(type, model) {
        return this.triggerMethod("add:hotspot:element", type, {
          left: model.get('x'),
          top: model.get('y')
        }, model);
      };

      HotspotView.prototype.onAddHotspotElement = function(type, elementPos, model) {
        if (type === "Hotspot-Circle") {
          return this._addCircle(elementPos, model);
        } else if (type === "Hotspot-Rectangle") {
          return this._addRectangle(elementPos, model);
        } else if (type === "Hotspot-Text") {
          return this._addTextElement(elementPos, model);
        } else if (type === "Hotspot-Image") {
          return this._addImageElement(elementPos, model.get('url'), model);
        }
      };

      HotspotView.prototype._addCircle = function(elementPos, model) {
        var circle, hotspotElement, self;
        hotspotElement = model;
        self = this;
        circle = new Kinetic.Circle({
          id: hotspotElement.get('id'),
          x: hotspotElement.get('x'),
          y: hotspotElement.get('y'),
          radius: hotspotElement.get('radius'),
          strokeWidth: 2
        });
        console.log(circle.getId());
        if (!this.model.get('transparent')) {
          circle.stroke(hotspotElement.get('color'));
        }
        this.optionLayer.add(circle);
        return this.optionLayer.draw();
      };

      HotspotView.prototype._addRectangle = function(elementPos, model) {
        var box, hotspotElement;
        hotspotElement = model;
        box = new Kinetic.Rect({
          id: hotspotElement.get('id'),
          x: hotspotElement.get('x'),
          y: hotspotElement.get('y'),
          width: hotspotElement.get('width'),
          height: hotspotElement.get('height'),
          strokeWidth: 2,
          rotation: hotspotElement.get('angle')
        });
        if (!this.model.get('transparent')) {
          box.stroke(hotspotElement.get('color'));
        }
        this.optionLayer.add(box);
        return this.optionLayer.draw();
      };

      HotspotView.prototype._addTextElement = function(elementPos, model) {
        var canvasText, hotspotElement;
        hotspotElement = model;
        canvasText = new Kinetic.Text({
          x: hotspotElement.get('x'),
          y: hotspotElement.get('y'),
          text: hotspotElement.get('text'),
          opacity: 1,
          fontFamily: hotspotElement.get('fontFamily'),
          fontSize: hotspotElement.get('fontSize'),
          fill: hotspotElement.get('fontColor'),
          fontStyle: hotspotElement.get('fontBold') + " " + hotspotElement.get('fontItalics'),
          padding: 5,
          rotation: hotspotElement.get('textAngle')
        });
        this.textLayer.add(canvasText);
        return this.textLayer.draw();
      };

      HotspotView.prototype._addImageElement = function(elementPos, url, model) {
        var hotspotElement, imageObject;
        hotspotElement = model;
        imageObject = new Image();
        imageObject.src = hotspotElement.get('url');
        return imageObject.onload = (function(_this) {
          return function() {
            var imageElement;
            imageElement = new Kinetic.Image({
              image: imageObject,
              x: hotspotElement.get('x'),
              y: hotspotElement.get('y'),
              width: hotspotElement.get('width'),
              height: hotspotElement.get('height'),
              rotation: hotspotElement.get('angle')
            });
            _this.imageLayer.add(imageElement);
            return _this.imageLayer.draw();
          };
        })(this);
      };

      return HotspotView;

    })(Marionette.ItemView);
  });
});
