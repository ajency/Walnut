var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module("ContentCreator.ContentBuilder.Element.Mcq.Views", function(Views, App, Backbone, Marionette, $, _) {
    var OptionView;
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
          return $('div.cke').on('click', function(evt) {
            return evt.stopPropagation();
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
        this._changeMultipleAnswers = __bind(this._changeMultipleAnswers, this);
        return McqView.__super__.constructor.apply(this, arguments);
      }

      McqView.prototype.className = 'mcq';

      McqView.prototype.template = '<div class="options"></div> <div class="clearfix"></div>';

      McqView.prototype.itemView = OptionView;

      McqView.prototype.itemViewContainer = 'div.options';

      McqView.prototype.initialize = function(options) {
        return this.mcq_model = options.mcq_model;
      };

      McqView.prototype.onAfterItemAdded = function() {
        if (this.mcq_model.get('multiple')) {
          return this.$el.find('.mcq-option input.mcq-option-select').attr('type', 'checkbox');
        }
      };

      McqView.prototype.onShow = function() {
        if (this.mcq_model.get('multiple')) {
          this.$el.find('.mcq-option input.mcq-option-select').attr('type', 'checkbox');
        }
        this.$el.parent().parent().on('click', (function(_this) {
          return function(evt) {
            _this.trigger("show:this:mcq:properties");
            return evt.stopPropagation();
          };
        })(this));
        this.mcq_model.on('change:optioncount', this._changeOptionCount);
        return this.mcq_model.on('change:multiple', this._changeMultipleAnswers);
      };

      McqView.prototype._changeMultipleAnswers = function(model, multiple) {
        if (multiple) {
          return this.$el.find('.mcq-option input.mcq-option-select').attr('type', 'checkbox');
        } else {
          return this.$el.find('.mcq-option input.mcq-option-select').attr('type', 'radio');
        }
      };

      McqView.prototype._changeOptionCount = function(model, num) {
        var newval, oldval, _results;
        oldval = model.previous('optioncount');
        newval = num;
        if (oldval < newval) {
          while (oldval !== newval) {
            oldval++;
            model.get('elements').push({
              optionNo: oldval
            });
          }
        }
        if (oldval > newval) {
          _results = [];
          while (oldval !== newval) {
            model.get('elements').pop();
            _results.push(oldval--);
          }
          return _results;
        }
      };

      return McqView;

    })(Marionette.CompositeView);
  });
});
