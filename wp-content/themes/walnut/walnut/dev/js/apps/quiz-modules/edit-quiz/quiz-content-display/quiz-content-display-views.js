var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/quiz-modules/edit-quiz/quiz-content-display/templates/quiz-content-display.html'], function(App, contentDisplayItemTpl) {
  return App.module('QuizModuleApp.EditQuiz.QuizContentDisplay.Views', function(Views, App) {
    var ContentItemView;
    ContentItemView = (function(_super) {
      __extends(ContentItemView, _super);

      function ContentItemView() {
        return ContentItemView.__super__.constructor.apply(this, arguments);
      }

      ContentItemView.prototype.template = contentDisplayItemTpl;

      ContentItemView.prototype.tagName = 'li';

      ContentItemView.prototype.className = 'sortable';

      ContentItemView.prototype.mixinTemplateHelpers = function(data) {
        var i, lvl, _i;
        data = ContentItemView.__super__.mixinTemplateHelpers.call(this, data);
        if (data.post_type === 'content-piece') {
          data.isContentPiece = true;
        }
        if (data.post_type === 'content_set') {
          data.isSet = true;
          data.contentLevels = new Array();
          for (i = _i = 1; _i <= 3; i = ++_i) {
            lvl = parseInt(data["lvl" + i]);
            while (lvl > 0) {
              data.contentLevels.push("Level " + i);
              lvl--;
            }
          }
        }
        return data;
      };

      ContentItemView.prototype.onShow = function() {
        if (this.model.get('post_type') === 'content_set') {
          return this.$el.attr('id', this.model.get('id'));
        } else {
          return this.$el.attr('id', this.model.get('ID'));
        }
      };

      return ContentItemView;

    })(Marionette.ItemView);
    return Views.ContentDisplayView = (function(_super) {
      __extends(ContentDisplayView, _super);

      function ContentDisplayView() {
        this.removeItem = __bind(this.removeItem, this);
        return ContentDisplayView.__super__.constructor.apply(this, arguments);
      }

      ContentDisplayView.prototype.template = '<ul class="cbp_tmtimeline"></ul>';

      ContentDisplayView.prototype.itemView = ContentItemView;

      ContentDisplayView.prototype.itemViewContainer = 'ul.cbp_tmtimeline';

      ContentDisplayView.prototype.className = 'col-md-10';

      ContentDisplayView.prototype.id = 'myCanvas-miki';

      ContentDisplayView.prototype.events = {
        'click .remove': 'removeItem'
      };

      ContentDisplayView.prototype.statusChanged = function(model, post_status) {
        if (post_status === 'publish' || post_status === 'archive') {
          this.$el.find('.remove').hide();
          return this.$el.find(".cbp_tmtimeline").sortable('disable');
        } else {
          return this.$el.find('.remove').show();
        }
      };

      ContentDisplayView.prototype.onShow = function() {
        this.$el.find(".cbp_tmtimeline").sortable({
          stop: (function(_this) {
            return function(event, ui) {
              var sorted_order;
              sorted_order = _this.$el.find(".cbp_tmtimeline").sortable("toArray");
              console.log(sorted_order);
              return _this.trigger("changed:order", sorted_order);
            };
          })(this)
        });
        return this.statusChanged(this.model, this.model.get('post_status'));
      };

      ContentDisplayView.prototype.removeItem = function(e) {
        var id;
        id = $(e.target).closest('.contentPiece').attr('data-id');
        return this.trigger('remove:model:from:quiz', id);
      };

      return ContentDisplayView;

    })(Marionette.CompositeView);
  });
});
