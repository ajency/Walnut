var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.ContentBuilder.Element.Mcq.Views", function(Views, App, Backbone, Marionette, $, _) {
    var OptionView, mcqID;
    mcqID = 0;
    OptionView = (function(_super) {
      __extends(OptionView, _super);

      function OptionView() {
        return OptionView.__super__.constructor.apply(this, arguments);
      }

      OptionView.prototype.className = 'mcq-option';

      OptionView.prototype.tagName = 'div';

      OptionView.prototype.template = '<span>{{optionNo}}</span> <input class="mcq-option-select" id="option-{{optionNo}}" type="radio"  value="no"> <p class="mcq-option-text"></p>';

      OptionView.prototype.events = {
        'click a': function(e) {
          return e.preventDefault();
        },
        'blur': function() {
          return this.trigger("text:element:blur", this.model, this.$el.find('p').html());
        }
      };

      OptionView.prototype.onShow = function() {
        this.$el.attr('id', 'mcq-option-' + this.model.get('optionNo'));
        this.$el.find('p').attr('contenteditable', 'true').attr('id', _.uniqueId('text-'));
        this.editor = CKEDITOR.inline(document.getElementById(this.$el.find('p').attr('id')));
        return this.editor.setData(_.stripslashes(this.model.get('text')));
      };

      OptionView.prototype.onClose = function() {
        return this.editor.destroy();
      };

      return OptionView;

    })(Marionette.ItemView);
    return Views.McqView = (function(_super) {
      __extends(McqView, _super);

      function McqView() {
        return McqView.__super__.constructor.apply(this, arguments);
      }

      McqView.prototype.className = 'mcq';

      McqView.prototype.itemView = OptionView;

      McqView.prototype.initialize = function(options) {
        mcqID = options.meta;
        return console.log(mcqID);
      };

      McqView.prototype.onShow = function() {
        this.$el.attr('id', 'mcq-' + mcqID);
        this.$el.find('input').attr('name', 'mcq-' + mcqID);
        return this.on("after:item:added", (function(_this) {
          return function() {
            return _this.$el.find('input').attr('name', 'mcq-' + mcqID);
          };
        })(this));
      };

      return McqView;

    })(Marionette.CollectionView);
  });
});
