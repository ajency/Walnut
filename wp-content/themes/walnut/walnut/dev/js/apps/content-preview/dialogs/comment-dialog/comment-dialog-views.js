var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentPreview.Dialogs.CommentDialog.Views', function(Views, App) {
    return Views.CommentView = (function(_super) {
      __extends(CommentView, _super);

      function CommentView() {
        return CommentView.__super__.constructor.apply(this, arguments);
      }

      CommentView.prototype.template = '<div> <span id="commentText"></span> </div> <div class="clearfix"> <button class="btn btn-primary comment-close">Close</button> </div>';

      CommentView.prototype.dialogOptions = {
        modal_title: 'Comment'
      };

      CommentView.prototype.events = {
        'click .comment-close': '_closeComment'
      };

      CommentView.prototype.onShow = function() {
        var comment;
        comment = Marionette.getOption(this, 'comment');
        return this.$el.find('#commentText').text(comment);
      };

      CommentView.prototype._closeComment = function() {
        return this.trigger('close:comment:dialog');
      };

      return CommentView;

    })(Marionette.ItemView);
  });
});
