var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/teachers-dashboard/take-class/templates/textbooks-list.html', 'text!apps/teachers-dashboard/take-class/templates/list-item.html'], function(App, textbooksListTpl, listitemTpl) {
  return App.module("TeachersDashboardApp.View.TakeClass", function(TakeClass, App) {
    var EmptyView, TextbooksItemView;
    TextbooksItemView = (function(superClass) {
      extend(TextbooksItemView, superClass);

      function TextbooksItemView() {
        return TextbooksItemView.__super__.constructor.apply(this, arguments);
      }

      TextbooksItemView.prototype.tagName = 'li';

      TextbooksItemView.prototype.className = 'txtbook mix mix_all';

      TextbooksItemView.prototype.template = listitemTpl;

      TextbooksItemView.prototype.onShow = function() {
        this.$el.attr('data-name', this.model.get('name'));
        this.$el.attr('data-modules', this.model.get('modules_count'));
        return this.$el.attr('data-subjects', this.model.get('subjects'));
      };

      TextbooksItemView.prototype.serializeData = function() {
        var data, mode, route;
        data = TextbooksItemView.__super__.serializeData.call(this);
        route = App.getCurrentRoute();
        data.url = '#' + route + '/textbook/' + this.model.get('term_id');
        mode = Marionette.getOption(this, 'mode');
        if (mode === 'take-quiz') {
          data.take_quiz = true;
        }
        if (mode === 'training') {
          data.training_mode = true;
        }
        return data;
      };

      return TextbooksItemView;

    })(Marionette.ItemView);
    EmptyView = (function(superClass) {
      extend(EmptyView, superClass);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = '<div class="fail_element anim250">Sorry &mdash; we could not find any Textbooks matching matching these criteria</div>';

      return EmptyView;

    })(Marionette.ItemView);
    return TakeClass.TextbooksListView = (function(superClass) {
      extend(TextbooksListView, superClass);

      function TextbooksListView() {
        return TextbooksListView.__super__.constructor.apply(this, arguments);
      }

      TextbooksListView.prototype.template = textbooksListTpl;

      TextbooksListView.prototype.itemView = TextbooksItemView;

      TextbooksListView.prototype.emptyView = EmptyView;

      TextbooksListView.prototype.itemViewContainer = 'ul.textbooks_list';

      TextbooksListView.prototype.itemViewOptions = function() {
        var data;
        return data = {
          mode: Marionette.getOption(this, 'mode')
        };
      };

      TextbooksListView.prototype.serializeData = function() {
        var data, mode;
        data = TextbooksListView.__super__.serializeData.call(this);
        mode = Marionette.getOption(this, 'mode');
        if (mode === 'take-quiz') {
          data.take_quiz = true;
        }
        if (mode === 'training') {
          data.training_mode = true;
        }
        return data;
      };

      TextbooksListView.prototype.onShow = function() {
        if (Marionette.getOption(this, 'mode') === 'take-quiz') {
          this.$el.find("#textbooks").addClass('myClass');
        } else {
          this.$el.find("#textbooks").addClass('takeClass');
        }
        this.$el.find('#textbooks').mixitup({
          layoutMode: 'list',
          listClass: 'list',
          gridClass: 'grid',
          effects: ['fade', 'blur'],
          listEffects: ['fade', 'rotateX']
        });
        this.dimensions = {
          status: 'all'
        };
        return $("li.txtbook").click(function() {
          window.location = $(this).find("a").attr("href");
          return false;
        });
      };

      return TextbooksListView;

    })(Marionette.CompositeView);
  });
});
