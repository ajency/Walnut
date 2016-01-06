var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/student-app-training-modules/templates/training-list.html'], function(App, listTrainingTpl) {
  return App.module("StudentsAppTrainingModule.View.TakeClassTextbookModules", function(TextbookModules, App) {
    var ContentGroupsItemView, EmptyView;
    ContentGroupsItemView = (function(superClass) {
      extend(ContentGroupsItemView, superClass);

      function ContentGroupsItemView() {
        return ContentGroupsItemView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsItemView.prototype.template = '<td class="v-align-middle">{{name}}</td> <td class="v-align-middle">{{textbookName}}</td> <td class="v-align-middle">{{chapterName}}</td> <td class="v-align-middle"><span style="display: none;">{{total_minutes}}</span> <span class="muted">{{duration}} {{minshours}}</span></td> <td> <button data-id="{{id}}" type="button" class="btn btn-success btn-small pull-right action start-training"> View {{moduleType}} </button> </td>';

      ContentGroupsItemView.prototype.tagName = 'tr';

      ContentGroupsItemView.prototype.onShow = function() {
        this.$el.attr('id', 'row-' + this.model.get('id'));
        this.$el.attr('data-id', this.model.get('id'));
        if (this.model.get('quiz_type') === 'class_test') {
          if (this.model.get('schedule')) {
            if (this.model.get('schedule')['is_expired'] || !this.model.get('schedule')['is_active']) {
              this.$el.find('.start-training').hide();
            }
            if (!IS_STANDALONE_SITE) {
              this.$el.find('.start-training').hide();
            }
            if (this.model.get('schedule')['is_expired']) {
              this.$el.find('.schedule_dates').removeClass('alert-info').addClass('alert-error');
            }
          } else {
            this.$el.find('.start-training').hide();
          }
          if (this.model.get('status') === 'completed') {
            return this.$el.find('.start-training').show();
          }
        }
      };

      ContentGroupsItemView.prototype.serializeData = function() {
        var data;
        data = ContentGroupsItemView.__super__.serializeData.call(this);
        this.textbooks = Marionette.getOption(this, 'textbookNames');
        data.textbookName = (function(_this) {
          return function() {
            var textbook;
            textbook = _this.textbooks.findWhere({
              "id": data.term_ids.textbook
            });
            if (textbook != null) {
              return textbook.get('name');
            }
          };
        })(this);
        data.chapterName = (function(_this) {
          return function() {
            var chapter;
            chapter = _this.textbooks.findWhere({
              "id": data.term_ids.chapter
            });
            if (chapter != null) {
              return chapter.get('name');
            }
          };
        })(this);
        return data;
      };

      ContentGroupsItemView.prototype.initialize = function(options) {
        return this.chapters = options.chaptersCollection;
      };

      return ContentGroupsItemView;

    })(Marionette.ItemView);
    EmptyView = (function(superClass) {
      extend(EmptyView, superClass);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = 'No Modules Available';

      EmptyView.prototype.tagName = 'td';

      EmptyView.prototype.onShow = function() {
        if (Marionette.getOption(this, 'mode') === 'take-quiz') {
          return this.$el.attr('colspan', 5);
        } else {
          return this.$el.attr('colspan', 4);
        }
      };

      return EmptyView;

    })(Marionette.ItemView);
    return TextbookModules.ContentGroupsView = (function(superClass) {
      extend(ContentGroupsView, superClass);

      function ContentGroupsView() {
        this.onShow = bind(this.onShow, this);
        this.startTraining = bind(this.startTraining, this);
        return ContentGroupsView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsView.prototype.template = listTrainingTpl;

      ContentGroupsView.prototype.itemView = ContentGroupsItemView;

      ContentGroupsView.prototype.itemViewContainer = 'tbody';

      ContentGroupsView.prototype.itemViewOptions = function() {
        return {
          textbookNames: Marionette.getOption(this, 'textbookNames'),
          chaptersCollection: Marionette.getOption(this, 'chaptersCollection'),
          mode: Marionette.getOption(this, 'mode')
        };
      };

      ContentGroupsView.prototype.emptyView = EmptyView;

      ContentGroupsView.prototype.className = 'teacher-app moduleList';

      ContentGroupsView.prototype.events = {
        'change .textbook-filter': function(e) {
          return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
        },
        'change #content-status-filter': 'setFilteredContent',
        'change #quiz-type-filter': 'setFilteredContent',
        'click .start-training': 'startTraining',
        'click .training-date': 'scheduleTraining'
      };

      ContentGroupsView.prototype.serializeData = function() {
        var data;
        data = ContentGroupsView.__super__.serializeData.call(this);
        if (Marionette.getOption(this, 'mode') === 'take-quiz') {
          data.take_quiz = true;
        }
        return data;
      };

      ContentGroupsView.prototype.startTraining = function(e) {
        var currentRoute, dataID;
        dataID = $(e.currentTarget).attr('data-id');
        currentRoute = App.getCurrentRoute();
        return App.navigate("students/training-module/" + dataID, true);
      };

      ContentGroupsView.prototype.onScheduledModule = function(id, date) {
        return this.$el.find('tr#row-' + id + ' .training-date').html('<i class="fa fa-calendar"></i> ' + moment(date).format("Do MMM YYYY"));
      };

      ContentGroupsView.prototype.scheduleTraining = function(e) {
        var dataID;
        dataID = $(e.target).closest('tr').attr('data-id');
        return this.trigger("schedule:training", dataID);
      };

      ContentGroupsView.prototype.onShow = function() {
        var pagerOptions, textbookFiltersHTML;
        if (Marionette.getOption(this, 'mode') === 'training') {
          this.$el.find('.status_label, .training-date, #status_header, .dateInfo').remove();
        }
        textbookFiltersHTML = $.showTextbookFilters({
          textbooks: Marionette.getOption(this, 'chaptersCollection')
        });
        this.fullCollection = Marionette.getOption(this, 'fullCollection');
        console.log(this.fullCollection);
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        this.$el.find(".select2-filters").select2();
        $('#take-class-modules').tablesorter();
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#take-class-modules').tablesorterPager(pagerOptions);
      };

      ContentGroupsView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType) {
        switch (filterType) {
          case 'textbooks-filter':
            $.populateChapters(filteredCollection, this.$el);
            break;
          case 'chapters-filter':
            $.populateSections(filteredCollection, this.$el);
            break;
          case 'sections-filter':
            $.populateSubSections(filteredCollection, this.$el);
        }
        return this.setFilteredContent();
      };

      ContentGroupsView.prototype.setFilteredContent = function() {
        var dataType, filtered_data, pagerOptions;
        dataType = 'student-training';
        filtered_data = $.filterTableByTextbooks(this, dataType);
        this.collection.set(filtered_data);
        $("#take-class-modules").trigger("updateCache");
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#take-class-modules').tablesorterPager(pagerOptions);
      };

      return ContentGroupsView;

    })(Marionette.CompositeView);
  });
});
