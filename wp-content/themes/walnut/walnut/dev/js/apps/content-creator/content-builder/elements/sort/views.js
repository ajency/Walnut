var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module("ContentCreator.ContentBuilder.Element.Sort.Views", function(Views, App, Backbone, Marionette, $, _) {
    var OptionView;
    OptionView = (function(_super) {
      __extends(OptionView, _super);

      function OptionView() {
        return OptionView.__super__.constructor.apply(this, arguments);
      }

      OptionView.prototype.className = 'sort-option';

      OptionView.prototype.template = '<span>{{optionNo}}</span> <p class="sort-option-text"></p>';

      OptionView.prototype.events = {
        'click a': function(e) {
          return e.preventDefault();
        },
        'blur p': function() {
          return this.model.set('text', this.$el.find('p').html());
        }
      };

      OptionView.prototype.onShow = function() {
        this.$el.attr('id', 'sort-option-' + this.model.get('optionNo'));
        this.$el.find('p').attr('contenteditable', 'true').attr('id', _.uniqueId('text-'));
        this.editor = CKEDITOR.inline(document.getElementById(this.$el.find('p').attr('id')));
        this.editor.setData(_.stripslashes(this.model.get('text')));
        return _.delay(function() {
          return $('div.cke').on('click', function(evt) {
            return evt.stopPropagation();
          });
        }, 500);
      };

      OptionView.prototype.onClose = function() {
        return this.editor.destroy();
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

      SortView.prototype.className = 'sort';

      SortView.prototype.itemView = OptionView;

      SortView.prototype.initialize = function(options) {
        return this.sort_model = options.sort_model;
      };

      SortView.prototype.onShow = function() {
        this.$el.parent().parent().on('click', (function(_this) {
          return function(evt) {
            _this.trigger("show:this:sort:properties");
            return evt.stopPropagation();
          };
        })(this));
        this._changeBGColor();
        this.sort_model.on('change:bg_color', this._changeBGColor);
        this.sort_model.on('change:height', this._changeHeight);
        this._enableSorting();
        return this._changeHeight(this.sort_model, this.sort_model.get('height'));
      };

      SortView.prototype.onAfterItemAdded = function() {
        this._changeBGColor();
        this._enableSorting();
        return this._changeHeight(this.sort_model, this.sort_model.get('height'));
      };

      SortView.prototype._changeBGColor = function(model, bgColor) {
        return this.$el.find('.sort-option').css('background-color', this._convertHex(this.sort_model.get('bg_color'), this.sort_model.get('bg_opacity')));
      };

      SortView.prototype._changeHeight = function(model, height) {
        return this.$el.find('.sort-option').css('min-height', height + 'px');
      };

      SortView.prototype._enableSorting = function() {
        this.$el.find('p').on('mousedown', (function(_this) {
          return function(evt) {
            evt.stopPropagation();
            if (_this.$el.hasClass('ui-sortable')) {
              return _this.$el.sortable('destroy');
            }
          };
        })(this));
        return this.$el.find('.sort-option').on('mousedown', (function(_this) {
          return function() {
            _this.trigger("show:this:sort:properties");
            if (!_this.$el.hasClass('ui-sortable')) {
              return _this.$el.sortable({
                cursor: "move"
              });
            }
          };
        })(this));
      };

      SortView.prototype._convertHex = function(hex, opacity) {
        var b, g, r, result;
        hex = hex.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
        return result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
      };

      SortView.prototype.onClose = function() {
        if (this.$el.hasClass('ui-sortable')) {
          return this.$el.sortable('destroy');
        }
      };

      return SortView;

    })(Marionette.CollectionView);
  });
});
