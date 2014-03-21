var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("TextbooksApp.Controller", function(Controller, App) {
    var TextbooksView;
    Controller.TextbooksController = (function(_super) {
      __extends(TextbooksController, _super);

      function TextbooksController() {
        return TextbooksController.__super__.constructor.apply(this, arguments);
      }

      TextbooksController.prototype.initialize = function() {
        var view;
        this.view = view = this._getTextbooksView();
        return this.show(view);
      };

      TextbooksController.prototype._getTextbooksView = function() {
        return new TextbooksView;
      };

      return TextbooksController;

    })(RegionController);
    return TextbooksView = (function(_super) {
      __extends(TextbooksView, _super);

      function TextbooksView() {
        return TextbooksView.__super__.constructor.apply(this, arguments);
      }

      TextbooksView.prototype.template = textbooksTpl;

      TextbooksView.prototype.className = '';

      return TextbooksView;

    })(Marionette.Layout);
  });
});
