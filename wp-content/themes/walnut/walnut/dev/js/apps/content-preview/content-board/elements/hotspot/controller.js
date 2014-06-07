var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/hotspot/view'], function(App, Element) {
  return App.module("ContentPreview.ContentBoard.Element.Hotspot", function(Hotspot, App, Backbone, Marionette, $, _) {
    return Hotspot.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var answerData;
        answerData = {
          answer: [],
          marks: 0,
          comment: 'Not Attempted'
        };
        this.answerModel = App.request("create:new:answer", answerData);
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype._getHotspotView = function() {
        return new Hotspot.Views.HotspotView({
          model: this.layout.model,
          answerModel: this.answerModel
        });
      };

      Controller.prototype.renderElement = function() {
        this.optionCollection = App.request("create:new:hotspot:element:collection", this.layout.model.get('optionCollection'));
        this.textCollection = App.request("create:new:hotspot:element:collection", this.layout.model.get('textCollection'));
        this.imageCollection = App.request("create:new:hotspot:element:collection", this.layout.model.get('imageCollection'));
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

      Controller.prototype._submitAnswer = function() {
        var answerId, answersNotMarked, correctOptions, correctOptionsIds, totalMarks;
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
        App.execute("show:response", this.answerModel.get('marks'), this.layout.model.get('marks'));
        return this.view.triggerMethod('show:feedback');
      };

      return Controller;

    })(Element.Controller);
  });
});
