var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-modules/modules-listing/templates/content-modules-list-tmpl.html', 'bootbox'], function(App, contentListTpl, bootbox) {
  return App.module("ContentModulesApp.ModulesListing.Views", function(Views, App, Backbone, Marionette, $, _) {
    var EmptyView, ListItemView;
    ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        this.removeSpinner = __bind(this.removeSpinner, this);
        this.successUpdateFn = __bind(this.successUpdateFn, this);
        this.successSaveFn = __bind(this.successSaveFn, this);
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<!--<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}"> <label for="checkbox{{id}}"></label> </div> </td>--> <td>{{name}}</td> {{#isQuiz}}<td>{{quiz_type}}</td>{{/isQuiz}} <td>{{textbookName}}</td> <td>{{chapterName}}</td> <td>{{durationRounded}} {{minshours}}</td> {{#isQuiz}}<td>{{marks}}</td>{{/isQuiz}} <td>{{&statusMessage}}</td> <td><a target="_blank" class="view-content-piece" href="{{view_url}}">View</a> {{#is_editable}} <span class="editLinkSpan nonDevice">|</span> <a target="_blank" href="{{edit_url}}" class="editLink nonDevice">Edit</a> {{/is_editable}} {{#is_under_review}} <span class="nonDevice publishModuleSpan">|</span> <a target="_blank" class="nonDevice publishModule">Publish</a> {{/is_under_review}} {{#is_published}} <span class="nonDevice archiveModuleSpan">|</span> <a target="_blank" class="nonDevice archiveModule"> Archive</a> {{/is_published}} <span class="nonDevice">|</span><a target="_blank" class="nonDevice cloneModule"> Clone</a> <i class="fa spinner"></i> </td>';

      ListItemView.prototype.serializeData = function() {
        var data;
        data = ListItemView.__super__.serializeData.call(this);
        data.view_url = SITEURL + ("/#view-group/" + data.id);
        data.edit_url = SITEURL + ("/#edit-module/" + data.id);
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
            chapter = _.chain(_this.chapters.findWhere({
              "id": data.term_ids.chapter
            })).pluck('name').compact().value();
            return chapter;
          };
        })(this);
        data.durationRounded = function() {
          if (data.minshours === 'hrs') {
            return _.numberFormat(parseFloat(data.duration), 2);
          } else {
            return data.duration;
          }
        };
        if (this.groupType === 'quiz') {
          data.quiz_type = this.model.getQuizTypeLabel();
          data.view_url = SITEURL + ("/#view-quiz/" + data.id);
          data.edit_url = SITEURL + ("/#edit-quiz/" + data.id);
        }
        if (this.groupType === 'student-training') {
          data.view_url = SITEURL + ("/#view-student-training-module/" + data.id);
          data.edit_url = SITEURL + ("/#edit-student-training-module/" + data.id);
        }
        data.statusMessage = function() {
          if (data.post_status === 'underreview') {
            return '<span class="post-status label label-important">Under Review</span>';
          } else if (data.post_status === 'publish') {
            return '<span class="post-status label label-info">Published</span>';
          } else if (data.post_status === 'archive') {
            return '<span class="post-status label label-success">Archived</span>';
          }
        };
        if (data.post_status === 'publish') {
          data.is_published = true;
        }
        if (data.post_status === 'underreview') {
          data.is_under_review = true;
        }
        if (data.post_status === 'underreview') {
          data.is_editable = true;
        }
        return data;
      };

      ListItemView.prototype.mixinTemplateHelpers = function(data) {
        data = ListItemView.__super__.mixinTemplateHelpers.call(this, data);
        if (this.groupType === 'quiz') {
          data.isQuiz = true;
        }
        return data;
      };

      ListItemView.prototype.events = {
        'click a.cloneModule': 'cloneModule',
        'click a.publishModule': function() {
          return this.changeModuleStatus('publish');
        },
        'click a.archiveModule': function() {
          return this.changeModuleStatus('archive');
        }
      };

      ListItemView.prototype.initialize = function(options) {
        this.textbooks = options.textbooksCollection;
        this.chapters = options.chaptersCollection;
        return this.groupType = options.groupType;
      };

      ListItemView.prototype.cloneModule = function() {
        return bootbox.confirm("Are you sure you want to clone '" + (this.model.get('name')) + "' ?", (function(_this) {
          return function(result) {
            var groupData;
            if (result) {
              _this.addSpinner();
              _this.cloneModel = (function() {
                switch (this.groupType) {
                  case 'teaching-module':
                    return App.request("new:content:group");
                  case 'quiz':
                    return App.request("new:quiz");
                  case 'student-training':
                    return App.request("new:student:training:module");
                }
              }).call(_this);
              groupData = _this.model.toJSON();
              _this.clonedData = _.omit(groupData, ['id', 'last_modified_on', 'last_modified_by', 'created_on', 'created_by']);
              _this.clonedData.name = "" + _this.clonedData.name + " clone";
              _this.clonedData.post_status = "underreview";
              return App.execute("when:fetched", _this.cloneModel, function() {
                return _this.cloneModel.save(_this.clonedData, {
                  wait: true,
                  success: _this.successSaveFn,
                  error: _this.errorFn,
                  complete: _this.removeSpinner
                });
              });
            }
          };
        })(this));
      };

      ListItemView.prototype.successSaveFn = function(model) {
        model.set('content_pieces', this.clonedData.content_pieces);
        return model.save({
          'changed': 'content_pieces'
        }, {
          wait: true,
          success: this.successUpdateFn,
          error: this.errorFn
        });
      };

      ListItemView.prototype.successUpdateFn = function(model) {
        var url;
        url = (function() {
          switch (this.groupType) {
            case 'teaching-module':
              return "edit-module";
            case 'quiz':
              return "edit-quiz";
            case 'student-training':
              return "edit-student-training-module";
          }
        }).call(this);
        return App.navigate("" + url + "/" + model.id, true);
      };

      ListItemView.prototype.errorFn = function() {
        return console.log('error');
      };

      ListItemView.prototype.addSpinner = function() {
        return this.$el.find('.spinner').addClass('fa-spin fa-spinner');
      };

      ListItemView.prototype.removeSpinner = function() {
        return this.$el.find('.spinner').removeClass('fa-spin fa-spinner');
      };

      ListItemView.prototype.changeModuleStatus = function(status) {
        return bootbox.confirm("Are you sure you want to " + status + " '" + (this.model.get('name')) + "' ?", (function(_this) {
          return function(result) {
            if (result) {
              _this.addSpinner();
              return _this.model.save({
                post_status: status,
                changed: 'module_details'
              }, {
                success: function() {
                  return _this.changeStatusLabel(status);
                },
                error: function(resp) {
                  return console.log(resp);
                },
                complete: _this.removeSpinner
              });
            }
          };
        })(this));
      };

      ListItemView.prototype.changeStatusLabel = function(status) {
        switch (status) {
          case 'archive':
            this.$el.find('.post-status').removeClass('label-info').addClass('label-success').html('Archived');
            return this.$el.find('.archiveModule, .archiveModuleSpan').remove();
          case 'publish':
            this.$el.find('.post-status').removeClass('label-important').addClass('label-info').html('Published');
            this.$el.find('.view-content-piece').after('<span class="nonDevice archiveModuleSpan">|</span> <a target="_blank" class="nonDevice archiveModule">Archive</a>');
            return this.$el.find('.publishModule, .publishModuleSpan, .editLink, .editLinkSpan').remove();
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
          chaptersCollection: Marionette.getOption(this, 'chaptersCollection'),
          groupType: this.groupType
        };
      };

      ModulesListingView.prototype.mixinTemplateHelpers = function(data) {
        data = ModulesListingView.__super__.mixinTemplateHelpers.call(this, data);
        if (this.groupType === 'quiz') {
          data.isQuiz = true;
        }
        data.type = _.titleize(_.humanize(data.type));
        console.log(this.groupType);
        return data;
      };

      ModulesListingView.prototype.events = {
        'change .textbook-filter': function(e) {
          return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
        },
        'change #check_all_div': 'checkAll',
        'change #content-post-status-filter': 'setFilteredContent'
      };

      ModulesListingView.prototype.initialize = function() {
        this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        this.groupType = Marionette.getOption(this, 'groupType');
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
        var textbookFiltersHTML;
        textbookFiltersHTML = $.showTextbookFilters({
          textbooks: this.textbooksCollection
        });
        this.fullCollection = Marionette.getOption(this, 'fullCollection');
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        this.$el.find(".select2-filters").select2();
        this.$el.find('#content-pieces-table').tablesorter();
        return this.onUpdatePager();
      };

      ModulesListingView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType) {
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

      ModulesListingView.prototype.setFilteredContent = function() {
        var filtered_data;
        filtered_data = $.filterTableByTextbooks(this);
        this.collection.set(filtered_data);
        return this.onUpdatePager();
      };

      ModulesListingView.prototype.checkAll = function() {
        if (this.$el.find('#check_all').is(':checked')) {
          return this.$el.find('.table-striped .tab_checkbox').trigger('click').prop('checked', true);
        } else {
          return this.$el.find('.table-striped .tab_checkbox').removeAttr('checked');
        }
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
