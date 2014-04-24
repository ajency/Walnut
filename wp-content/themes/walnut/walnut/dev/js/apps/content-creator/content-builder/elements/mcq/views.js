var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.ContentBuilder.Element.Mcq.Views", function(Views, App, Backbone, Marionette, $, _) {
    Views.McqView = (function(_super) {
      __extends(McqView, _super);

      function McqView() {
        return McqView.__super__.constructor.apply(this, arguments);
      }

      McqView.prototype.className = 'mcq';

      McqView.prototype.onShow = function() {
        this.$el.attr('id', 'mcq-container');
        this.$el.parent().parent().on('click', (function(_this) {
          return function(evt) {
            _this.trigger("show:this:mcq:properties");
            return evt.stopPropagation();
          };
        })(this));
        this.trigger("create:row:structure", {
          container: this.$el
        });
        this.$el.find('.aj-imp-drag-handle').remove();
        this.$el.find('.aj-imp-delete-btn').remove();
        return this.$el.find('.aj-imp-settings-btn').remove();
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
        'click a': function(e) {
          return e.preventDefault();
        },
        'blur p': '_onBlur'
      };

      McqOptionView.prototype.onShow = function() {
        this.$el.attr('id', 'mcq-option-' + this.model.get('optionNo'));
        this.$el.find('p').attr('contenteditable', 'true').attr('id', _.uniqueId('text-'));
        this.editor = CKEDITOR.inline(document.getElementById(this.$el.find('p').attr('id')));
        this.editor.setData(_.stripslashes(this.model.get('text')));
        _.delay((function(_this) {
          return function() {
            return $('#cke_' + _this.editor.name).on('click', function(evt) {
              return evt.stopPropagation();
            });
          };
        })(this), 500);
        this.$el.find('input:checkbox').screwDefaultButtons({
          image: 'url("../wp-content/themes/walnut/images/csscheckbox.png")',
          width: 32,
          height: 26
        });
        return this.$el.parent().on("class:changed", (function(_this) {
          return function() {
            return _this.model.set('class', _this.$el.parent().attr('data-class'));
          };
        })(this));
      };

      McqOptionView.prototype._onBlur = function() {
        return this.model.set('text', this.$el.find('p').html());
      };

      McqOptionView.prototype.onClose = function() {
        return this.editor.destroy();
      };

      return McqOptionView;

    })(Marionette.ItemView);
  });
});
