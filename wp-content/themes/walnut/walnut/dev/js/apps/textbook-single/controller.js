var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/textbook-single/templates/textbook-full.html'], function(App, RegionController, textbookSingleTpl) {
  return App.module("TextbookSingleApp.Controller", function(Controller, App) {
    var TextbookSingleView;
    Controller.SingleTextbook = (function(_super) {
      __extends(SingleTextbook, _super);

      function SingleTextbook() {
        return SingleTextbook.__super__.constructor.apply(this, arguments);
      }

      SingleTextbook.prototype.initialize = function() {
        var view;
        this.view = view = this._getTextbookSingleView();
        return this.show(view);
      };

      SingleTextbook.prototype._getTextbookSingleView = function() {
        return new TextbookSingleView;
      };

      return SingleTextbook;

    })(RegionController);
    return TextbookSingleView = (function(_super) {
      __extends(TextbookSingleView, _super);

      function TextbookSingleView() {
        return TextbookSingleView.__super__.constructor.apply(this, arguments);
      }

      TextbookSingleView.prototype.template = textbookSingleTpl;

      TextbookSingleView.prototype.className = 'page-content';

      return TextbookSingleView;

    })(Marionette.Layout);
  });
});
