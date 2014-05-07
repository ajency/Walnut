var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module("ContentPreview.ContentBoard.Element.Sort.Views", function(Views, App, Backbone, Marionette, $, _) {
    var OptionView;
    OptionView = (function(_super) {
      __extends(OptionView, _super);

      function OptionView() {
        return OptionView.__super__.constructor.apply(this, arguments);
      }

      OptionView.prototype.className = 'sort-option';

      OptionView.prototype.template = '<input type="hidden" id="optionNo" value="{{optionNo}}"> <p class="sort-option-text"></p>';

      OptionView.prototype.onShow = function() {
        return this.$el.find('p').html(_.stripslashes(this.model.get('text')));
      };

      return OptionView;

    })(Marionette.ItemView);
    return Views.SortView = (function(_super) {
      __extends(SortView, _super);

      function SortView() {
        this._changeHeight = __bind(this._changeHeight, this);
        this._changeBGColor = __bind(this._changeBGColor, this);
        return SortView.__super__.constructor.apply(this, arguments);
      }

      SortView.prototype.template = '<div class="sort"></div> <div class="alert alert-success text-center fibRightAns" style="display: none;"> <div class="btn-group " data-toggle="buttons"> <label class="btn btn-default"> <input type="radio" name="sort" id="myAnswer" data-sort-value="myAnswer"> My Answer </label> <label class="btn btn-primary"> <input type="radio" name="sort" id="rightAnswer" data-sort-value="correctAnswer"> Correct Answer </label> </div> </div>';

      SortView.prototype.itemView = OptionView;

      SortView.prototype.itemViewContainer = 'div.sort';

      SortView.prototype.initialize = function(options) {
        return this.sort_model = options.sort_model;
      };

      SortView.prototype.onShow = function() {
        this._changeBGColor();
        this._enableSorting();
        this._changeHeight(this.sort_model, this.sort_model.get('height'));
        return this.$el.closest('.preview').find('#submit-answer-button').on('click', (function(_this) {
          return function() {
            return _this.trigger("submit:answer");
          };
        })(this));
      };

      SortView.prototype._changeBGColor = function(model, bgColor) {
        return this.$el.find('.sort-option').css('background-color', _.convertHex(this.sort_model.get('bg_color'), this.sort_model.get('bg_opacity')));
      };

      SortView.prototype._changeHeight = function(model, height) {
        return this.$el.find('.sort-option').css('min-height', height + 'px');
      };

      SortView.prototype._enableSorting = function() {
        if (!this.$el.find('.sort').hasClass('ui-sortable')) {
          return this.$el.find('.sort').sortable({
            cursor: "move"
          });
        }
      };

      SortView.prototype.onShowFeedback = function() {
        this.$el.find('.fibRightAns').show();
        this.$el.find('input#optionNo').each((function(_this) {
          return function(index, element) {
            $(element).before("<span class='myAnswer'>" + (index + 1) + "</span>");
            return $(element).before("<span class='correctAnswer'>" + (_this.collection.get($(element).val()).get('index')) + "</span>");
          };
        })(this));
        if (this.$el.find('.sort').hasClass('ui-sortable')) {
          this.$el.find('.sort').sortable('destroy');
        }
        this.$el.find('.sort').isotope({
          itemSelector: '.sort-option',
          layoutMode: 'vertical',
          getSortData: {
            correctAnswer: '.correctAnswer parseInt',
            myAnswer: '.myAnswer parseInt'
          }
        });
        return this.$el.find('input[name="sort"]').on('click', (function(_this) {
          return function(evt) {
            var sortValue;
            sortValue = $(evt.target).attr('data-sort-value');
            return _this.$el.find('.sort').isotope({
              sortBy: sortValue
            });
          };
        })(this));
      };

      SortView.prototype.onClose = function() {
        if (this.$el.find('.sort').hasClass('ui-sortable')) {
          return this.$el.find('.sort').sortable('destroy');
        }
      };

      return SortView;

    })(Marionette.CompositeView);
  });
});
