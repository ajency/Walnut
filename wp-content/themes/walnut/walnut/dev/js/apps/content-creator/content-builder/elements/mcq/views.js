var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.ContentBuilder.Element.Mcq.Views", function(Views, App, Backbone, Marionette, $, _) {
    Views.McqView = (function(_super) {
      __extends(McqView, _super);

      function McqView() {
        this._showProperties = __bind(this._showProperties, this);
        return McqView.__super__.constructor.apply(this, arguments);
      }

      McqView.prototype.className = 'mcq';

      McqView.prototype.onShow = function() {
        this.$el.attr('id', 'mcq-container');
        this.$el.parent().parent().off('click', this._showProperties);
        this.$el.parent().parent().on('click', this._showProperties);
        this.trigger("create:row:structure", {
          container: this.$el
        });
        this.$el.find('.aj-imp-drag-handle').remove();
        this.$el.find('.aj-imp-delete-btn').remove();
        return this.$el.find('.aj-imp-settings-btn').remove();
      };

      McqView.prototype._showProperties = function(evt) {
        this.trigger("show:this:mcq:properties");
        return evt.stopPropagation();
      };

      McqView.prototype.onPreTickAnswers = function() {
        console.log(this.model.get('correct_answer'));
        return _.each(this.model.get('correct_answer'), _.bind(this._tickToggleOption, this, true));
      };

      McqView.prototype._tickToggleOption = function(checked, optionNo) {
        this.$el.find('input:checkbox[id=option-' + optionNo + ']').attr('checked', checked);
        if (checked) {
          return this.$el.find('input:checkbox[id=option-' + optionNo + ']').parent().css('background-position', '0px -26px');
        } else {
          return this.$el.find('input:checkbox[id=option-' + optionNo + ']').parent().css('background-position', '0px 0px');
        }
      };

      McqView.prototype.onUpdateTick = function() {
        var correctOption, totalOptions, unselectedOptions;
        correctOption = this.model.get('correct_answer');
        totalOptions = this.model.get('optioncount');
        unselectedOptions = _.difference(_.range(1, totalOptions + 1), correctOption);
        return _.each(unselectedOptions, _.bind(this._tickToggleOption, this, false));
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

      McqOptionView.prototype.template = '<span class="optionNo">{{optionNo}}</span><input class="mcq-option-select" id="option-{{optionNo}}" type="checkbox"  value="no"> <div class="mcq-option-text"></div>';

      McqOptionView.prototype.events = {
        'click a': function(e) {
          return e.preventDefault();
        },
        'blur .mcq-option-text': '_onBlur',
        'change input:checkbox': '_onClickOfCheckbox'
      };

      McqOptionView.prototype.onShow = function() {
        this.$el.attr('id', 'mcq-option-' + this.model.get('optionNo'));
        this.$el.find('.mcq-option-text').attr('contenteditable', 'true').attr('id', _.uniqueId('text-'));
        this.editor = CKEDITOR.inline(document.getElementById(this.$el.find('.mcq-option-text').attr('id')));
        this.editor.setData(_.stripslashes(this.model.get('text')));
        _.delay((function(_this) {
          return function() {
            return $('#cke_' + _this.editor.name).on('click', function(evt) {
              return evt.stopPropagation();
            });
          };
        })(this), 500);
        this.$el.find('input:checkbox').screwDefaultButtons({
          image: 'url("../wp-content/themes/walnut/images/csscheckbox-correct.png")',
          width: 32,
          height: 26
        });
        this.$el.parent().on("class:changed", (function(_this) {
          return function() {
            return _this.model.set('class', parseInt(_this.$el.parent().attr('data-class')));
          };
        })(this));
        return this.$el.parent().sortable('disable');
      };

      McqOptionView.prototype._onBlur = function() {
        return this.model.set('text', this.$el.find('.mcq-option-text').html());
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

      McqOptionView.prototype.onClickCheckbox = function() {
        this.$el.find('input:checkbox').attr('checked', true);
        return this.$el.find('input:checkbox').parent().css('background-position', '0px -26px');
      };

      McqOptionView.prototype.onClose = function() {
        return this.editor.destroy();
      };

      return McqOptionView;

    })(Marionette.ItemView);
  });
});
