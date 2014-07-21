var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('SingleEditPopup.Views', function(Views, App) {
    return Views.SingleEditView = (function(_super) {
      __extends(SingleEditView, _super);

      function SingleEditView() {
        return SingleEditView.__super__.constructor.apply(this, arguments);
      }

      SingleEditView.prototype.template = '<div class="row form-row"> <div class="col-md-12"> <input id="hintText" type="text" class="form-control" placeholder="Enter your message for {{title}}"> </div> </div> <div class="clearfix"> <button type="button" class="btn btn-success hint-close">Save changes</button> </div>';

      SingleEditView.prototype.mixinTemplateHelpers = function(data) {
        data = SingleEditView.__super__.mixinTemplateHelpers.call(this, data);
        data.title = Marionette.getOption(this, 'title');
        return data;
      };

      SingleEditView.prototype.events = {
        'click .hint-close': '_closeHint',
        'blur #hintText': '_saveText'
      };

      SingleEditView.prototype.initialize = function(options) {
        this.text = options.text;
        return this.dialogOptions = {
          modal_title: Marionette.getOption(this, 'title')
        };
      };

      SingleEditView.prototype.onShow = function() {
        return this.$el.find('#hintText').val(this.text);
      };

      SingleEditView.prototype._saveText = function(e) {
        this.text = $(e.target).val();
        return console.log(this.text);
      };

      SingleEditView.prototype._closeHint = function() {
        return this.trigger('close:popup', {
          text: this.text
        });
      };

      return SingleEditView;

    })(Marionette.ItemView);
  });
});
