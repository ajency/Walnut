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
        'blur p': function() {
          return this.model.set('text', this.$el.find('p').html());
        }
      };

      OptionView.prototype.onShow = function() {
        this.$el.attr('id', 'mcq-option-' + this.model.get('optionNo'));
        this.$el.find('p').attr('contenteditable', 'true').attr('id', _.uniqueId('text-'));
        this.editor = CKEDITOR.inline(document.getElementById(this.$el.find('p').attr('id')));
        this.editor.setData(_.stripslashes(this.model.get('text')));
        return _.delay(function() {
          $('div.cke').on('mouseenter', function() {
            return App.ContentCreator.closequestioneproperty = false;
          });
          return $('div.cke').on('mouseleave', function() {
            return App.ContentCreator.closequestioneproperty = true;
          });
        }, 3000);
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

      McqView.prototype.template = '<div class="options"></div> <div class="clearfix"></div>';

      McqView.prototype.itemView = OptionView;

      McqView.prototype.itemViewContainer = 'div.options';

      McqView.prototype.initialize = function(options) {
        mcqID = options.meta;
        return console.log(mcqID);
      };

      McqView.prototype.onAfterItemAdded = function() {
        this.$el.find('input').attr('name', 'mcq-' + mcqID);
        return this.trigger("change:radio:to:checkbox");
      };

      McqView.prototype.onShow = function() {
        this.$el.attr('id', 'mcq-' + mcqID);
        this.$el.find('input').attr('name', 'mcq-' + mcqID);
        this.trigger("change:radio:to:checkbox");
        return this._setActiveHandler();
      };

      McqView.prototype._setActiveHandler = function() {
        return this.$el.parent().parent().on('click', (function(_this) {
          return function(evt) {
            _this.trigger("show:this:mcq:properties");
            return evt.stopPropagation();
          };
        })(this));
      };

      return McqView;

    })(Marionette.CompositeView);
  });
});
