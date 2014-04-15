var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/teachers-dashboard/list-textbooks/templates/textbooks-list.html', 'text!apps/teachers-dashboard/list-textbooks/templates/list-item.html'], function(App, textbooksListTpl, listitemTpl) {
  return App.module("TeachersDashboardApp.View.List", function(List, App) {
    var EmptyView, TextbooksItemView;
    TextbooksItemView = (function(_super) {
      __extends(TextbooksItemView, _super);

      function TextbooksItemView() {
        return TextbooksItemView.__super__.constructor.apply(this, arguments);
      }

      TextbooksItemView.prototype.tagName = 'li';

      TextbooksItemView.prototype.className = 'mix mix_all';

      TextbooksItemView.prototype.template = listitemTpl;

      TextbooksItemView.prototype.onShow = function() {
        this.$el.attr('data-name', this.model.get('name'));
        this.$el.attr('data-modules', this.model.get('modules_count'));
        return $('#textbooks').mixitup({
          layoutMode: 'list',
          listClass: 'list',
          gridClass: 'grid',
          effects: ['fade', 'blur'],
          listEffects: ['fade', 'rotateX']
        });
      };

      return TextbooksItemView;

    })(Marionette.ItemView);
    EmptyView = (function(_super) {
      __extends(EmptyView, _super);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = '<div class="fail_element anim250">Sorry &mdash; we could not find any Textbooks matching matching these criteria</div>';

      return EmptyView;

    })(Marionette.ItemView);
    return List.TextbooksListView = (function(_super) {
      __extends(TextbooksListView, _super);

      function TextbooksListView() {
        return TextbooksListView.__super__.constructor.apply(this, arguments);
      }

      TextbooksListView.prototype.template = textbooksListTpl;

      TextbooksListView.prototype.className = '';

      TextbooksListView.prototype.itemView = TextbooksItemView;

      TextbooksListView.prototype.emptyView = EmptyView;

      TextbooksListView.prototype.itemViewContainer = 'ul.textbooks_list';

      TextbooksListView.prototype.onShow = function() {
        return this.dimensions = {
          status: 'all'
        };
      };

      return TextbooksListView;

    })(Marionette.CompositeView);
  });
});
