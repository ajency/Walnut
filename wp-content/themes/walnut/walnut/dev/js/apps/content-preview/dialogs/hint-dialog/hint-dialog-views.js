var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentPreview.Dialogs.HintDialog.Views', function(Views, App) {
    return Views.HintView = (function(_super) {
      __extends(HintView, _super);

      function HintView() {
        return HintView.__super__.constructor.apply(this, arguments);
      }

      HintView.prototype.template = '<div> <span id="hintText"></span> </div> <div class="clearfix"> <button class="btn btn-primary hint-close">Close</button> </div>';

      HintView.prototype.dialogOptions = {
        modal_title: 'Hint'
      };

      HintView.prototype.events = {
        'click .hint-close': '_closeHint'
      };

      HintView.prototype.onShow = function() {
        var hint;
        hint = Marionette.getOption(this, 'hint');
        return this.$el.find('#hintText').text(hint);
      };

      HintView.prototype._closeHint = function() {
        return this.trigger('close:hint:dialog');
      };

      return HintView;

    })(Marionette.ItemView);
  });
});
