var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/students-dashboard/textbooks/templates/textbooks-list.html', 'text!apps/students-dashboard/textbooks/templates/list-item.html'], function(App, textbooksListTpl, listitemTpl) {
  return App.module("TeachersDashboardApp.View.TakeClass", function(TakeClass, App) {
    var EmptyView, TextbooksItemView;
    TextbooksItemView = (function(_super) {
      __extends(TextbooksItemView, _super);

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
        return data;
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
    return TakeClass.TextbooksListView = (function(_super) {
      __extends(TextbooksListView, _super);

      function TextbooksListView() {
        return TextbooksListView.__super__.constructor.apply(this, arguments);
      }

      TextbooksListView.prototype.template = textbooksListTpl;

      TextbooksListView.prototype.itemView = TextbooksItemView;

      TextbooksListView.prototype.emptyView = EmptyView;

      TextbooksListView.prototype.itemViewContainer = 'ul.textbooks_list';

      TextbooksListView.prototype.events = {
        'click #tableEntry': '_chkQuizQuestionResponse'
      };

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
        return data;
      };

      TextbooksListView.prototype.onShow = function() {
        if (Marionette.getOption(this, 'mode') === 'take-quiz') {
          this.$el.addClass('myClass');
        } else {
          this.$el.addClass('takeClass');
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
        $("li.txtbook").click(function() {
          window.location = $(this).find("a").attr("href");
          return false;
        });
        if (_.platform() === 'DEVICE') {
          _.cordovaHideSplashscreen();
          _.removeCordovaBackbuttonEventListener();
          return _.enableCordovaBackbuttonNavigation();
        }
      };

      return TextbooksListView;

    })(Marionette.CompositeView);
  });
});
