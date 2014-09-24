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

      TextbooksListView.prototype._chkQuizQuestionResponse = function() {
        var onSuccess, runQuery;
        console.log("data");
        alert("data");
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT COUNT(distinct(qr.collection_id)) AS completed_quiz_count FROM " + _.getTblPrefix() + "quiz_response_summary qr, wp_content_collection cc , wp_collection_meta m WHERE qr.collection_id = cc.id AND qr.student_id = ? AND cc.post_status in ('publish','archive') AND qr.quiz_meta LIKE '%completed%' AND cc.term_ids LIKE '%3%' AND m.meta_value=? ", [_.getUserID(), 'test'], onSuccess(d), _.deferredErrorHandler(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, result, _i, _ref;
            alert("length");
            console.log(data.rows.length);
            for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
              result = data.rows.item(i);
              console.log(JSON.stringify(result));
            }
            return d.resolve(result);
          };
        };
        return $.when(runQuery()).done(function() {
          return console.log('chkQuizQuestionResponse transaction completed');
        }).fail(_.failureHandler);
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
          _.removeCordovaBackbuttonEventListener();
          return _.disableCordovaBackbuttonNavigation();
        }
      };

      return TextbooksListView;

    })(Marionette.CompositeView);
  });
});
