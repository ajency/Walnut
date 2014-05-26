var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentPreview.ContentBoard.Element.Fib.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.FibView = (function(_super) {
      __extends(FibView, _super);

      function FibView() {
        return FibView.__super__.constructor.apply(this, arguments);
      }

      FibView.prototype.tagName = 'div';

      FibView.prototype.template = '<p class="fib-text"></p> </br> <div class="alert alert-success text-center fibRightAns" style="display: none;"> <h5>The correct answer is:</h5> <h4 class="semi-bold"> </h4> </div>';

      FibView.prototype.className = 'fib';

      FibView.prototype.initialize = function(options) {
        return this.blanksCollection = this.model.get('blanksArray');
      };

      FibView.prototype.onShow = function() {
        this.$el.find('p').append(_.stripslashes(this.model.get('text')));
        return this.$el.closest('.preview').find('#submit-answer-button').on('click', (function(_this) {
          return function() {
            return _this.trigger("submit:answer");
          };
        })(this));
      };

      FibView.prototype.onShowFeedback = function() {
        var htmlText, originalText, self;
        this.$el.find('.fibRightAns').show();
        originalText = _.stripslashes(this.model.get('text'));
        htmlText = $.parseHTML(originalText);
        this.$el.find('h4').html(htmlText);
        self = this;
        return this.$el.find('h4').find('input').each(function(index) {
          var correctAnswerArray;
          console.log($(this));
          correctAnswerArray = self.blanksCollection.get($(this).attr('data-id')).get('correct_answers');
          if (correctAnswerArray[0] !== "") {
            return $(this).replaceWith("<span class='fibAns'>" + correctAnswerArray[0] + "</span>");
          } else {
            return $(this).replaceWith("<span class='fibAns'>(no correct)</span>");
          }
        });
      };

      return FibView;

    })(Marionette.ItemView);
  });
});