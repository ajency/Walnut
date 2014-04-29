var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.ContentBoardView = (function(_super) {
      __extends(ContentBoardView, _super);

      function ContentBoardView() {
        return ContentBoardView.__super__.constructor.apply(this, arguments);
      }

      ContentBoardView.prototype.onRender = function() {
        return this.$el.attr('id', 'myCanvas');
      };

      return ContentBoardView;

    })(Marionette.ItemView);
  });
});
