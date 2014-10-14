var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ClassQuizReportListing.Views", function(Views, App, Backbone, Marionette, $, _) {
    Views.ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}"> <label for="checkbox{{id}}"></label> </div> </td> <td>{{name}}</td> <td>{{&textbookName}}</td> <td>{{&chapterName}}</td> <td>{{duration}} mins</td> <td>{{quiz_type}}</td> <td>{{taken_by}}</td> <td><button class="btn btn-small btn-success view-report">view report</button></td>';

      ListItemView.prototype.serializeData = function() {
        var data, term_ids, textbooks;
        data = ListItemView.__super__.serializeData.call(this);
        textbooks = Marionette.getOption(this, 'textbookNamesCollection');
        term_ids = data.term_ids;
        data.textbookName = textbooks.getTextbookName(term_ids);
        data.chapterName = textbooks.getChapterName(term_ids);
        data.quiz_type = data.quiz_type === 'practice' ? 'Practice' : 'Class Test';
        data.taken_by = (function() {
          switch (data.taken_by) {
            case 0:
              return 'None';
            case 1:
              return '1 Student';
            default:
              if (parseInt(data.taken_by) === parseInt(data.totalStudents)) {
                return 'All';
              } else {
                return data.taken_by + ' Students';
              }
          }
        })();
        return data;
      };

      ListItemView.prototype.events = {
        'click .view-report': function() {
          return this.trigger('view:quiz:report', this.model.id);
        }
      };

      return ListItemView;

    })(Marionette.ItemView);
    return Views.EmptyView = (function(_super) {
      __extends(EmptyView, _super);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = 'No Content Available';

      EmptyView.prototype.tagName = 'td';

      EmptyView.prototype.onShow = function() {
        return this.$el.attr('colspan', 7);
      };

      return EmptyView;

    })(Marionette.ItemView);
  });
});
