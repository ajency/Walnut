var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/teacherquestion/view'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.TeacherQuestion', function(TeacherQuestion, App, Backbone, Marionette, $, _) {
    return TeacherQuestion.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'TeacherQuestion',
          elements: [],
          meta_id: 0
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.renderElement = function() {
        var view;
        view = this._getMainView();
        return this.layout.elementRegion.show(view);
      };

      Controller.prototype._getMainView = function() {
        console.log(this.layout);
        return new TeacherQuestion.Views.MainView({
          model: this.layout.model
        });
      };

      return Controller;

    })(Element.Controller);
  });
});
