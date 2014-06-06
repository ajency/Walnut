var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentPreview.ContentBoard.Element.Mcq.Views", function(Views, App, Backbone, Marionette, $, _) {
    Views.McqView = (function(_super) {
      __extends(McqView, _super);

      function McqView() {
        return McqView.__super__.constructor.apply(this, arguments);
      }

      McqView.prototype.className = 'mcq';

      McqView.prototype.onShow = function() {
        this.$el.attr('id', 'mcq-container');
        this.trigger("create:row:structure", {
          container: this.$el
        });
        return this.$el.closest('.preview').find('#submit-answer-button').on('click', (function(_this) {
          return function() {
            return _this.trigger("submit:answer");
          };
        })(this));
      };

      McqView.prototype.onAddOptionClasses = function(answer) {
        var correctOption, remainingOption, totalOptions, wrongOption;
        totalOptions = this.model.get('optioncount');
        correctOption = this.model.get('correct_answer');
        wrongOption = _.difference(answer, correctOption);
        remainingOption = _.difference(_.range(1, totalOptions + 1), correctOption, wrongOption);
        _.each(correctOption, (function(_this) {
          return function(option) {
            return _this._addClass(option, 'ansRight');
          };
        })(this));
        _.each(wrongOption, (function(_this) {
          return function(option) {
            return _this._addClass(option, 'ansWrong');
          };
        })(this));
        return _.each(remainingOption, (function(_this) {
          return function(option) {
            return _this._addClass(option, 'ansFalse');
          };
        })(this));
      };

      McqView.prototype._addClass = function(option, className) {
        return this.$el.find("#mcq-option-" + option).addClass(className);
      };

      return McqView;

    })(Marionette.ItemView);
    return Views.McqOptionView = (function(_super) {
      __extends(McqOptionView, _super);

      function McqOptionView() {
        return McqOptionView.__super__.constructor.apply(this, arguments);
      }

      McqOptionView.prototype.className = 'mcq-option';

      McqOptionView.prototype.tagName = 'div';

      McqOptionView.prototype.template = '<input class="mcq-option-select" id="option-{{optionNo}}" type="checkbox"  value="no"> <p class="mcq-option-text"></p>';

      McqOptionView.prototype.events = {
        'change input:checkbox': '_onClickOfCheckbox'
      };

      McqOptionView.prototype.onShow = function() {
        this.$el.attr('id', 'mcq-option-' + this.model.get('optionNo'));
        this.$el.find('p').append(_.stripslashes(this.model.get('text')));
        return this.$el.find('input:checkbox').screwDefaultButtons({
          image: 'url("../wp-content/themes/walnut/images/csscheckbox.png")',
          width: 32,
          height: 26
        });
      };

      McqOptionView.prototype._onClickOfCheckbox = function(evt) {
        if ($(evt.target).prop('checked')) {
          console.log('checked');
          return this.trigger('option:checked', this.model);
        } else {
          console.log('unchecked');
          return this.trigger('option:unchecked', this.model);
        }
      };

      return McqOptionView;

    })(Marionette.ItemView);
  });
});
