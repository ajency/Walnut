var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/quiz-reports/class-report/templates/outer-template.html'], function(App, contentListTpl) {
  return App.module("ClassQuizReportListing.Views", function(Views, App, Backbone, Marionette, $, _) {
    var EmptyView, ListItemView;
    ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td>{{name}}</td> <td>{{chapterName}}</td> <td>{{duration}} mins</td> <td>{{quiz_type}}</td> <td>{{taken_by}}</td> <td><button class="btn btn-small btn-success view-report">view report</button></td>';

      ListItemView.prototype.serializeData = function() {
        var data;
        data = ListItemView.__super__.serializeData.call(this);
        this.textbooks = Marionette.getOption(this, 'textbooksCollection');
        this.chapters = Marionette.getOption(this, 'chaptersCollection');
        data.textbookName = (function(_this) {
          return function() {
            var textbook;
            textbook = _.findWhere(_this.textbooks, {
              "id": data.term_ids.textbook
            });
            if (textbook != null) {
              return textbook.name;
            }
          };
        })(this);
        data.chapterName = (function(_this) {
          return function() {
            var chapter;
            if (data.term_ids.chapter) {
              chapter = _.chain(_this.chapters.findWhere({
                "id": data.term_ids.chapter
              })).pluck('name').compact().value();
              return chapter;
            }
          };
        })(this);
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
    EmptyView = (function(_super) {
      __extends(EmptyView, _super);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = 'No Content Available';

      EmptyView.prototype.tagName = 'td';

      EmptyView.prototype.onShow = function() {
        return this.$el.attr('colspan', 6);
      };

      return EmptyView;

    })(Marionette.ItemView);
    return Views.ModulesListingView = (function(_super) {
      __extends(ModulesListingView, _super);

      function ModulesListingView() {
        return ModulesListingView.__super__.constructor.apply(this, arguments);
      }

      ModulesListingView.prototype.template = contentListTpl;

      ModulesListingView.prototype.className = 'row';

      ModulesListingView.prototype.itemView = ListItemView;

      ModulesListingView.prototype.emptyView = EmptyView;

      ModulesListingView.prototype.itemViewContainer = '#list-content-pieces';

      ModulesListingView.prototype.itemViewOptions = function() {
        return {
          textbooksCollection: this.textbooks,
          chaptersCollection: Marionette.getOption(this, 'chaptersCollection')
        };
      };

      ModulesListingView.prototype.initialize = function() {
        this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        this.textbooks = new Array();
        return this.textbooksCollection.each((function(_this) {
          return function(textbookModel, ind) {
            return _this.textbooks.push({
              'name': textbookModel.get('name'),
              'id': textbookModel.get('term_id')
            });
          };
        })(this));
      };

      ModulesListingView.prototype.onShow = function() {
        this.$el.find('#content-pieces-table').tablesorter();
        return this.onUpdatePager();
      };

      ModulesListingView.prototype.onUpdatePager = function() {
        var pagerOptions;
        this.$el.find("#content-pieces-table").trigger("updateCache");
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find("#content-pieces-table").tablesorterPager(pagerOptions);
      };

      return ModulesListingView;

    })(Marionette.CompositeView);
  });
});
