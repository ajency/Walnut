var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/biganswer/views'], function(App, Element) {
  return App.module("ContentPreview.ContentBoard.Element.BigAnswer", function(BigAnswer, App, Backbone, Marionette, $, _) {
    return BigAnswer.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.renderElement = function() {
        var view;
        view = this._getBigAnswerView();
        return this.layout.elementRegion.show(view);
      };

      Controller.prototype._getBigAnswerView = function() {
        return new BigAnswer.Views.BigAnswerView({
          model: this.layout.model
        });
      };

      return Controller;

    })(Element.Controller);
  });
});
