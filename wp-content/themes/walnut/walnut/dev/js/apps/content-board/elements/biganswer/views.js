var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module("ContentPreview.ContentBoard.Element.BigAnswer.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.BigAnswerView = (function(superClass) {
      extend(BigAnswerView, superClass);

      function BigAnswerView() {
        return BigAnswerView.__super__.constructor.apply(this, arguments);
      }

      BigAnswerView.prototype.template = '<textarea class="autogrow" type="text" maxlength="{{maxlength}}" contenteditable="false" style=" font-family: {{font}}; font-size: {{font_size}}px; color: {{color}}; max-width:100%; width :100%; height: 100%; line-height : inherit;" ></textarea>';

      BigAnswerView.prototype.onShow = function() {
        this._setBGColor();
        this._autoPopulateAnswers();
        return this._setBigAnswerStyle(this.model.get('style'));
      };

      BigAnswerView.prototype._autoPopulateAnswers = function() {
        var answerModel;
        answerModel = Marionette.getOption(this, 'answerModel');
        if (answerModel && answerModel.get('status') !== 'not_attempted') {
          return this.$el.find('textarea').val(answerModel.get('answer'));
        }
      };

      BigAnswerView.prototype._setBGColor = function() {
        return this.$el.find('textarea').css('background-color', _.convertHex(this.model.get('bg_color'), this.model.get('bg_opacity')));
      };

      BigAnswerView.prototype._setBigAnswerStyle = function(style) {
        if (style === 'uline') {
          this.$el.find('textarea').removeClass("border").addClass("underline");
        } else if (style === 'box') {
          this.$el.find('textarea').removeClass("underline").addClass("border");
        } else {
          this.$el.find('textarea').removeClass("underline border");
        }
        this.$el.find('textarea').css({
          'height': this.$el.find('textarea').prop('scrollHeight') + "px"
        });
        return console.log('test');
      };

      return BigAnswerView;

    })(Marionette.ItemView);
  });
});
