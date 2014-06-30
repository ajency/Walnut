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
        this.$el.closest('.element-wrapper').off('click', this._showProperties);
        this.$el.closest('.element-wrapper').on('click', this._showProperties);
        this.trigger("create:row:structure", {
          container: this.$el
        });
        this.$el.find('.row').closest('.element-wrapper').children('.element-controls').find('.aj-imp-drag-handle, .aj-imp-delete-btn, .aj-imp-delete-btn').remove();
        return this.$el.children('.element-wrapper').children('.element-markup').children('.row').children('.column').sortable('disable');
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

      McqView.prototype.onGetAllOptionElements = function() {
        var elements, elementsArray;
        elements = this.$el.children('.element-wrapper').children('.element-markup').children('.row').children('.column').find('.row').find('.element-wrapper');
        elementsArray = new Array();
        console.log(elementsArray);
        _.each(elements, function(element, index) {
          var optionNo;
          optionNo = parseInt($(element).closest('.column[data-option]').attr('data-option'));
          console.log(elementsArray[optionNo - 1]);
          elementsArray[optionNo - 1] = elementsArray[optionNo - 1] != null ? elementsArray[optionNo - 1] : new Array();
          console.log(elementsArray[optionNo - 1]);
          return elementsArray[optionNo - 1].push({
            element: $(element).find('form input[name="element"]').val(),
            meta_id: parseInt($(element).find('form input[name="meta_id"]').val())
          });
        });
        this.model.set('elements', elementsArray);
        return console.log(JSON.stringify(this.model.get('elements')));
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

      McqOptionView.prototype.template = '<span class="optionNo">{{optionNo}}</span> <input class="mcq-option-select" id="option-{{optionNo}}" type="checkbox"  value="no">';

      McqOptionView.prototype.events = {
        'change input:checkbox': '_onClickOfCheckbox'
      };

      McqOptionView.prototype.onShow = function() {
        this.$el.find('input:checkbox').screwDefaultButtons({
          image: 'url("../wp-content/themes/walnut/images/csscheckbox-correct.png")',
          width: 32,
          height: 26
        });
        return this.$el.closest('.row').closest('.column').on("class:changed", (function(_this) {
          return function() {
            _this.model.set('class', parseInt(_this.$el.closest('.row').closest('.column').attr('data-class')));
            return console.log(_this.model.get('class'));
          };
        })(this));
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
