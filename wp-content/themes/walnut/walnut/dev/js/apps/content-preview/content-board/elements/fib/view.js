var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentPreview.ContentBoard.Element.Fib.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.FibView = (function(_super) {
      __extends(FibView, _super);

      function FibView() {
        return FibView.__super__.constructor.apply(this, arguments);
      }

      FibView.prototype.tagName = 'p';

      FibView.prototype.initialize = function(options) {
        return this.blanksCollection = this.model.get('blanksArray');
      };

      FibView.prototype.onShow = function() {
        this.$el.append(_.stripslashes(this.model.get('text')));
        return this.$el.closest('.preview').find('#submit-answer-button').on('click', (function(_this) {
          return function() {
            return _this.trigger("submit:answer");
          };
        })(this));
      };

      return FibView;

    })(Marionette.ItemView);
  });
});
