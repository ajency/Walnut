var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/admin-content-modules/templates/outer-template.html'], function(App, adminContentModulesTpl) {
  return App.module("AdminContentModulesApp.View.AdminModulesView", function(AdminModulesView, App) {
    var ModulesEmptyView, ModulesItemView;
    ModulesItemView = (function(_super) {
      __extends(ModulesItemView, _super);

      function ModulesItemView() {
        return ModulesItemView.__super__.constructor.apply(this, arguments);
      }

      ModulesItemView.prototype.template = '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}"> <label for="checkbox{{id}}"></label> </div> </td> <td class="v-align-middle"><a href="#"></a>{{name}}</td> <td>{{textbookName}}</td> <td>{{chapterName}}</td> <td class="v-align-middle"><span style="display: none;">{{total_minutes}}</span> <span class="muted">{{duration}} {{minshours}}</span></td> <td> <span class="muted status_label">{{&status_str}}</span> </td>';

      ModulesItemView.prototype.tagName = 'tr';

      ModulesItemView.prototype.onShow = function() {
        this.$el.attr('id', 'row-' + this.model.get('id'));
        this.$el.attr('data-id', this.model.get('id'));
        if (this.model.get('status') !== 'completed') {
          return this.$el.find('.tab_checkbox').attr('disabled', true);
        }
      };

      ModulesItemView.prototype.serializeData = function() {
        var data, status, training_date;
        data = ModulesItemView.__super__.serializeData.call(this);
        data.textbookName = (function(_this) {
          return function() {
            var textbook;
            textbook = _this.textbooks.get(data.term_ids.textbook).get('name');
            return textbook;
          };
        })(this);
        data.chapterName = (function(_this) {
          return function() {
            var chapter;
            chapter = _.chain(_this.chapters.findWhere({
              "id": data.term_ids.chapter
            })).pluck('name').compact().value();
            return chapter;
          };
        })(this);
        training_date = this.model.get('training_date');
        if (training_date === '') {
          training_date = 'Schedule';
        } else {
          training_date = moment(training_date).format("Do MMM YYYY");
        }
        status = this.model.get('status');
        if ((this.model.get('post_status') != null) && this.model.get('post_status') === 'archive') {
          console.log('im here');
          data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>';
          data.status_str = '<span class="label label-success">Archived</span>';
          data.action_str = '<i class="fa fa-repeat"></i> Replay';
        } else {
          if (status === 'started' || status === 'resumed') {
            data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>';
            data.status_str = '<span class="label label-info">In Progress</span>';
            data.action_str = '<i class="fa fa-pause"></i> Resume';
          } else if (status === 'completed') {
            data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>';
            data.status_str = '<span class="label label-success">Completed</span>';
            data.action_str = '<i class="fa fa-repeat"></i> Replay';
          } else {
            data.status_str = '<span class="label label-important">Not Started</span>';
            data.action_str = '<i class="fa fa-play"></i> Start';
            data.training_date = '<button type="button" data-target="#schedule" data-toggle="modal" class="btn btn-white btn-small pull-right m-r-10 training-date"> <i class="fa fa-calendar"></i> ' + training_date + '</button>';
          }
        }
        return data;
      };

      ModulesItemView.prototype.initialize = function(options) {
        this.textbooks = options.textbooksCollection;
        return this.chapters = options.chaptersCollection;
      };

      return ModulesItemView;

    })(Marionette.ItemView);
    ModulesEmptyView = (function(_super) {
      __extends(ModulesEmptyView, _super);

      function ModulesEmptyView() {
        return ModulesEmptyView.__super__.constructor.apply(this, arguments);
      }

      ModulesEmptyView.prototype.template = 'No items to display';

      ModulesEmptyView.prototype.tagName = 'td';

      ModulesEmptyView.prototype.onShow = function() {
        return this.$el.attr('colspan', 6);
      };

      return ModulesEmptyView;

    })(Marionette.ItemView);
    return AdminModulesView.ModulesView = (function(_super) {
      __extends(ModulesView, _super);

      function ModulesView() {
        this.onNewCollectionFetched = __bind(this.onNewCollectionFetched, this);
        this.onShow = __bind(this.onShow, this);
        this.startTraining = __bind(this.startTraining, this);
        return ModulesView.__super__.constructor.apply(this, arguments);
      }

      ModulesView.prototype.template = adminContentModulesTpl;

      ModulesView.prototype.itemView = ModulesItemView;

      ModulesView.prototype.itemViewContainer = 'tbody';

      ModulesView.prototype.emptyView = ModulesEmptyView;

      ModulesView.prototype.itemViewOptions = function() {
        return {
          textbooksCollection: Marionette.getOption(this, 'textbooksCollection'),
          chaptersCollection: Marionette.getOption(this, 'chaptersCollection')
        };
      };

      ModulesView.prototype.className = 'teacher-app moduleList';

      ModulesView.prototype.events = {
        'click .start-training': 'startTraining',
        'click .training-date': 'scheduleTraining',
        'change #check_all_div': 'checkAll',
        'change .tab_checkbox,#check_all_div ': 'showSubmitButton',
        'click #send-email, #send-sms': 'saveCommunications',
        'change #divisions-filter': function(e) {
          return this.trigger("division:changed", $(e.target).val());
        },
        'change #content-status-filter': 'setFilteredContent',
        'change .textbook-filter': function(e) {
          return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
        }
      };

      ModulesView.prototype.mixinTemplateHelpers = function(data) {
        var divisionOptions, divisionsCollection;
        data = ModulesView.__super__.mixinTemplateHelpers.call(this, data);
        divisionsCollection = Marionette.getOption(this, 'divisionsCollection');
        divisionOptions = [];
        divisionsCollection.each(function(model) {
          var d;
          d = [];
          d.id = model.get('id');
          d.division = model.get('division');
          return divisionOptions.push(d);
        });
        data.divisionsFilter = divisionOptions;
        return data;
      };

      ModulesView.prototype.initialize = function() {
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

      ModulesView.prototype.startTraining = function(e) {
        var currentRoute, dataID;
        dataID = $(e.currentTarget).attr('data-id');
        currentRoute = App.getCurrentRoute();
        return App.navigate(currentRoute + "/module/" + dataID, true);
      };

      ModulesView.prototype.onScheduledModule = function(id, date) {
        return this.$el.find('tr#row-' + id + ' .training-date').html('<i class="fa fa-calendar"></i> ' + moment(date).format("Do MMM YYYY"));
      };

      ModulesView.prototype.scheduleTraining = function(e) {
        var dataID;
        dataID = $(e.target).closest('tr').attr('data-id');
        return this.trigger("schedule:training", dataID);
      };

      ModulesView.prototype.onShow = function() {
        var pagerDiv, pagerOptions, textbookFiltersHTML;
        if (Marionette.getOption(this, 'mode') === 'training') {
          this.$el.find('.status_label, .training-date, #status_header, .dateInfo').remove();
        }
        textbookFiltersHTML = $.showTextbookFilters({
          textbooks: this.textbooksCollection
        });
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        this.$el.find(".select2-filters").select2();
        this.$el.find('#take-class-modules').tablesorter();
        $("#pager").remove();
        pagerDiv = '<div id="pager" class="pager"> <i class="fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="fa fa-chevron-right next"></i> <select class="pagesize"> <option value="25" selected>25</option> <option value="50">50</option> <option value="100">100</option> </select> </div>';
        this.$el.find('#take-class-modules').after(pagerDiv);
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#take-class-modules').tablesorterPager(pagerOptions);
      };

      ModulesView.prototype.checkAll = function() {
        var all_ids, completedModules, excludeIDs;
        all_ids = this.collection.pluck('id');
        completedModules = _.chain(this.collection.where({
          'status': 'completed'
        })).pluck('id').value();
        excludeIDs = _.difference(all_ids, completedModules);
        return $.toggleCheckAll(this.$el.find('#take-class-modules'), excludeIDs);
      };

      ModulesView.prototype.onNewCollectionFetched = function(newCollection, textbooks) {
        var pagerOptions;
        this.textbooksCollection.reset(textbooks.models);
        this.collection.reset(newCollection.models);
        $("#take-class-modules").trigger("updateCache");
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        $('#take-class-modules').tablesorterPager(pagerOptions);
        return this.onShow();
      };

      ModulesView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType) {
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

      ModulesView.prototype.setFilteredContent = function() {
        var filtered_data, pagerOptions;
        filtered_data = $.filterTableByTextbooks(this, 'teaching-modules');
        this.collection.set(filtered_data);
        $("#take-class-modules").trigger("updateCache");
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#take-class-modules').tablesorterPager(pagerOptions);
      };

      ModulesView.prototype.showSubmitButton = function() {
        if (this.$el.find('.tab_checkbox').is(':checked')) {
          return this.$el.find('#send-email, #send-sms').show();
        } else {
          return this.$el.find('#send-email, #send-sms').hide();
        }
      };

      ModulesView.prototype.saveCommunications = function(e) {
        var data;
        data = [];
        data.moduleIDs = $.getCheckedItems(this.$el.find('#take-class-modules'));
        data.division = this.$el.find('#divisions-filter').val();
        if (e.target.id === 'send-email') {
          data.communication_mode = 'email';
        } else {
          data.communication_mode = 'sms';
        }
        if (data.moduleIDs) {
          this.trigger("save:communications", data);
          this.$el.find('#communication_sent').remove();
          return this.$el.find('#send-email').after('<span class="m-l-40 small" id="communication_sent"> Your ' + data.communication_mode + ' has been queued successfully</span>');
        }
      };

      return ModulesView;

    })(Marionette.CompositeView);
  });
});
