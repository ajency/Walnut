var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/hotspot/view'], function(App, Element) {
  return App.module("ContentPreview.ContentBoard.Element.Hotspot", function(Hotspot, App, Backbone, Marionette, $, _) {
    return Hotspot.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var answerWreqrObject;
        answerWreqrObject = options.answerWreqrObject, this.answerModel = options.answerModel;
        if (!this.answerModel) {
          this.answerModel = App.request("create:new:answer");
        }
        if (answerWreqrObject) {
          this.displayAnswer = answerWreqrObject.options.displayAnswer;
          answerWreqrObject.setHandler("get:question:answer", (function(_this) {
            return function() {
              var answer, data, emptyOrIncomplete;
              answer = _.compact(_this.answerModel.get('answer'));
              if (_.isEmpty(answer)) {
                emptyOrIncomplete = 'empty';
              } else if (_.size(answer) < _.size(_this.layout.model.get('correct_answer'))) {
                emptyOrIncomplete = 'incomplete';
              } else {
                emptyOrIncomplete = 'complete';
              }
              return data = {
                'emptyOrIncomplete': emptyOrIncomplete,
                'answerModel': _this.answerModel,
                'totalMarks': _this.layout.model.get('marks')
              };
            };
          })(this));
          answerWreqrObject.setHandler("submit:answer", (function(_this) {
            return function(displayAnswer) {
              return _this._submitAnswer(_this.displayAnswer);
            };
          })(this));
        }
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype._getHotspotView = function() {
        return new Hotspot.Views.HotspotView({
          model: this.layout.model,
          answerModel: this.answerModel,
          displayAnswer: this.displayAnswer
        });
      };

      Controller.prototype.renderElement = function() {
        var imageCollectionArray, optionCollectionArray, textCollectionArray;
        optionCollectionArray = this.layout.model.get('optionCollection');
        if (optionCollectionArray instanceof Backbone.Collection) {
          optionCollectionArray = optionCollectionArray.models;
        }
        textCollectionArray = this.layout.model.get('textCollection');
        if (textCollectionArray instanceof Backbone.Collection) {
          textCollectionArray = textCollectionArray.models;
        }
        imageCollectionArray = this.layout.model.get('imageCollection');
        if (imageCollectionArray instanceof Backbone.Collection) {
          imageCollectionArray = imageCollectionArray.models;
        }
        this._parseArray(optionCollectionArray, textCollectionArray, imageCollectionArray);
        this.optionCollection = App.request("create:new:hotspot:element:collection", optionCollectionArray);
        this.textCollection = App.request("create:new:hotspot:element:collection", textCollectionArray);
        this.imageCollection = App.request("create:new:hotspot:element:collection", imageCollectionArray);
        this.layout.model.set('optionCollection', this.optionCollection);
        this.layout.model.set('textCollection', this.textCollection);
        this.layout.model.set('imageCollection', this.imageCollection);
        App.execute("show:total:marks", this.layout.model.get('marks'));
        this.view = this._getHotspotView();
        this.listenTo(this.view, "submit:answer", this._submitAnswer);
        return this.layout.elementRegion.show(this.view, {
          loading: true
        });
      };

      Controller.prototype._parseArray = function(optionCollectionArray, textCollectionArray, imageCollectionArray) {
        _.each(optionCollectionArray, (function(_this) {
          return function(option) {
            return _this._parseObject(option);
          };
        })(this));
        _.each(textCollectionArray, (function(_this) {
          return function(text) {
            return _this._parseObject(text);
          };
        })(this));
        return _.each(imageCollectionArray, (function(_this) {
          return function(image) {
            return _this._parseObject(image);
          };
        })(this));
      };

      Controller.prototype._parseObject = function(object) {
        var Booleans, Floats, Integers;
        Integers = ['radius', 'marks', 'width', 'height', 'angle', 'textAngle', 'fontSize'];
        Floats = ['x', 'y'];
        Booleans = ['toDelete', 'correct'];
        return _.each(object, function(value, key) {
          if (__indexOf.call(Integers, key) >= 0) {
            object[key] = parseInt(value);
          }
          if (__indexOf.call(Floats, key) >= 0) {
            object[key] = parseFloat(value);
          }
          if (__indexOf.call(Booleans, key) >= 0) {
            return object[key] = _.toBoolean(value);
          }
        });
      };

      Controller.prototype._submitAnswer = function(displayAnswer) {
        var answerId, answersNotMarked, correctOptions, correctOptionsIds, totalMarks;
        if (displayAnswer == null) {
          displayAnswer = true;
        }
        console.log(this.optionCollection);
        correctOptions = this.optionCollection.where({
          correct: true
        });
        console.log(correctOptions);
        correctOptionsIds = _.pluck(correctOptions, 'id');
        console.log(correctOptionsIds);
        answerId = _.pluck(this.answerModel.get('answer'), 'id');
        if (this.layout.model.get('enableIndividualMarks')) {
          console.log(_.difference(answerId, correctOptionsIds));
          if (!_.difference(answerId, correctOptionsIds).length) {
            if (!_.difference(correctOptionsIds, answerId).length) {
              this.answerModel.set('marks', this.layout.model.get('marks'));
            } else {
              answersNotMarked = _.difference(correctOptionsIds, answerId);
              totalMarks = this.layout.model.get('marks');
              _.each(answersNotMarked, (function(_this) {
                return function(notMarked) {
                  console.log(_this.optionCollection.findWhere({
                    id: notMarked
                  }));
                  return totalMarks -= _this.optionCollection.findWhere({
                    id: notMarked
                  }).get('marks');
                };
              })(this));
              this.answerModel.set('marks', totalMarks);
            }
          }
        } else {
          if (!(_.difference(answerId, correctOptionsIds).length || _.difference(correctOptionsIds, answerId).length)) {
            this.answerModel.set('marks', this.layout.model.get('marks'));
          }
        }
        if (displayAnswer) {
          App.execute("show:response", this.answerModel.get('marks'), this.layout.model.get('marks'));
        }
        if (displayAnswer) {
          return this.view.triggerMethod('show:feedback');
        }
      };

      return Controller;

    })(Element.Controller);
  });
});
