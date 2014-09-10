var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-board/element/controller', 'apps/content-board/elements/sort/view'], function(App, Element) {
  return App.module("ContentPreview.ContentBoard.Element.Sort", function(Sort, App, Backbone, Marionette, $, _) {
    return Sort.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._submitAnswer = __bind(this._submitAnswer, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var answerWreqrObject;
        answerWreqrObject = options.answerWreqrObject, this.answerModel = options.answerModel;
        if (!this.answerModel) {
          this.answerModel = App.request("create:new:answer");
        }
        this.displayAnswer = true;
        if (answerWreqrObject) {
          this.displayAnswer = answerWreqrObject.options.displayAnswer;
          answerWreqrObject.setHandler("get:question:answer", (function(_this) {
            return function() {
              var data;
              return data = {
                'answerModel': _this.answerModel,
                'totalMarks': _this.layout.model.get('marks'),
                'questionType': 'sort'
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

      Controller.prototype.renderElement = function() {
        var answeredCollection, correctAnswers, optionsObj;
        optionsObj = this.layout.model.get('elements');
        if (optionsObj instanceof Backbone.Collection) {
          optionsObj = optionsObj.models;
        }
        this._parseOptions(optionsObj);
        if (this.answerModel.get('status') !== 'skipped') {
          optionsObj = _.shuffle(optionsObj);
        }
        this.optionCollection = App.request("create:new:option:collection", optionsObj);
        this.layout.model.set('elements', this.optionCollection);
        if (this.answerModel.get('status') === 'skipped') {
          correctAnswers = this.optionCollection.sortBy('index');
          this.optionCollection = App.request("create:new:option:collection", correctAnswers);
        } else if (_.size(this.answerModel.get('answer')) > 0) {
          answeredCollection = _.map(this.answerModel.get('answer'), (function(_this) {
            return function(el) {
              return _this.optionCollection.findWhere({
                'index': parseInt(el)
              });
            };
          })(this));
          this.optionCollection = App.request("create:new:option:collection", answeredCollection);
        }
        this.view = this._getSortView(this.optionCollection);
        App.execute("show:total:marks", this.layout.model.get('marks'));
        this.listenTo(this.view, "submit:answer", this._submitAnswer);
        this.listenTo(this.view, "show", (function(_this) {
          return function() {
            if (_this.answerModel.get('status') !== 'not_attempted') {
              return _this._submitAnswer();
            }
          };
        })(this));
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype._getSortView = function(collection) {
        return new Sort.Views.SortView({
          collection: collection,
          sort_model: this.layout.model
        });
      };

      Controller.prototype._parseOptions = function(optionsObj) {
        return _.each(optionsObj, function(option) {
          if (option.optionNo != null) {
            option.optionNo = parseInt(option.optionNo);
          }
          if (option.marks != null) {
            option.marks = parseInt(option.marks);
          }
          if (option.index != null) {
            return option.index = parseInt(option.index);
          }
        });
      };

      Controller.prototype._submitAnswer = function(displayAnswer) {
        if (displayAnswer == null) {
          displayAnswer = true;
        }
        this.answerModel.set('marks', this.layout.model.get('marks'));
        displayAnswer = Marionette.getOption(this, 'displayAnswer');
        this.answerModel.set({
          'answer': []
        });
        this.view.$el.find('input#optionNo').each((function(_this) {
          return function(index, element) {
            var answerOptionIndex;
            answerOptionIndex = _this.optionCollection.get($(element).val()).get('index');
            _this.answerModel.get('answer').push(answerOptionIndex);
            if (answerOptionIndex !== index + 1) {
              _this.answerModel.set('marks', 0);
              if (displayAnswer) {
                return $(element).parent().addClass('ansWrong');
              }
            } else {
              if (displayAnswer) {
                return $(element).parent().addClass('ansRight');
              }
            }
          };
        })(this));
        if (displayAnswer) {
          App.execute("show:response", this.answerModel.get('marks'), this.layout.model.get('marks'));
        }
        console.log(this.answerModel.get('answer').toString());
        if (this.answerModel.get('marks') === 0) {
          if (displayAnswer) {
            return this.view.triggerMethod('show:feedback');
          }
        } else {
          return this.view.triggerMethod('destroy:sortable');
        }
      };

      return Controller;

    })(Element.Controller);
  });
});
