var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/dialogs/comment-dialog/comment-dialog-views'], function(App, RegionController) {
  return App.module('ContentPreview.Dialogs.CommentDialog', function(CommentDialog, App) {
    CommentDialog.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var comment;
        comment = options.comment;
        this.view = this._getCommentView(comment);
        this.listenTo(this.view, 'close:comment:dialog', function() {
          return this.region.closeDialog();
        });
        return this.show(this.view);
      };

      Controller.prototype._getCommentView = function(comment) {
        return new CommentDialog.Views.CommentView({
          comment: comment
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:comment:dialog', function(options) {
      return new CommentDialog.Controller({
        region: App.dialogRegion,
        comment: options.comment
      });
    });
  });
});
