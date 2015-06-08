var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-pieces/list-content-pieces/templates/content-pieces-list-tpl.html', 'bootbox'], function(App, contentListTpl, bootbox) {
  return App.module("ContentPiecesApp.ContentList.Views", function(Views, App) {
    var EmptyView, ListItemView;
    ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        this.removeSpinner = __bind(this.removeSpinner, this);
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td class="cpHeight">{{&post_excerpt}}</td> <td class="cpHeight">{{&present_in_str}}</td> <td>{{textbookName}}</td> <td>{{chapterName}}</td> <td>{{contentType}}</td> <td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td> <td>{{&statusMessage}}</td> <td data-id="{{ID}}" class="text-center"> <a target="_blank" href="{{view_url}}" class="view-content-piece">View</a> {{&edit_link}} {{#is_under_review}} <span class="nonDevice publishModuleSpan">|</span> <a target="_blank" class="nonDevice publishModule">Publish</a> {{/is_under_review}} {{#is_published}} <span class="nonDevice archiveModuleSpan">|</span> <a target="_blank" class="nonDevice archiveModule">Archive</a> {{/is_published}} <span class="nonDevice">|</span> <a target="_blank"  class="nonDevice cloneModule">Clone</a> <i class="fa spinner"></i> </td>';

      ListItemView.prototype.serializeData = function() {
        var data, edit_url, modules;
        data = ListItemView.__super__.serializeData.call(this);
        data.modified_date = moment(data.post_modified).format("Do MMM YYYY, h:mm a");
        data.sort_date = moment(data.post_modified).format("YYYYMMDD");
        if (data.content_type === 'student_question') {
          data.view_url = SITEURL + '/#dummy-quiz/' + data.ID;
        } else {
          data.view_url = SITEURL + '/#dummy-module/' + data.ID;
        }
        edit_url = SITEURL + '/content-creator/#edit-content/' + data.ID;
        data.edit_link = '';
        if (data.post_status === 'pending') {
          data.edit_link = ' <span class="nonDevice editLinkSpan">|</span> <a target="_blank" href="' + edit_url + '" class="nonDevice editLink">Edit</a>';
        }
        data.textbookName = (function(_this) {
          return function() {
            var textbook;
            if (data.term_ids.textbook) {
              textbook = _.findWhere(_this.textbooks, {
                "id": data.term_ids.textbook
              });
              if (textbook) {
                return textbook.name;
              }
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
        data.statusMessage = function() {
          if (data.post_status === 'pending') {
            return '<span class="label post-status label-important">Under Review</span>';
          } else if (data.post_status === 'publish') {
            return '<span class="label post-status label-info">Published</span>';
          } else if (data.post_status === 'archive') {
            return '<span class="label post-status label-success">Archived</span>';
          }
        };
        if (data.post_status === 'publish') {
          data.is_published = true;
        }
        if (data.post_status === 'pending') {
          data.is_under_review = true;
        }
        modules = [];
        _.each(data.present_in_modules, function(ele, index) {
          return modules.push("<a target='_blank' href='#view-group/" + ele.id + "'>" + ele.name + "</a>");
        });
        data.present_in_str = _.size(modules) > 0 ? _.toSentence(modules) : 'Not added to a module yet';
        data.contentType = _.str.titleize(_.str.humanize(data.content_type));
        return data;
      };

      ListItemView.prototype.events = {
        'click a.cloneModule': function() {
          return this.model.duplicate();
        },
        'click a.archiveModule': function() {
          return this.changeModuleStatus('archive');
        },
        'click a.publishModule': function() {
          return this.changeModuleStatus('publish');
        }
      };

      ListItemView.prototype.initialize = function(options) {
        this.textbooks = options.textbooksCollection;
        return this.chapters = options.chaptersCollection;
      };

      ListItemView.prototype.addSpinner = function() {
        return this.$el.find('.spinner').addClass('fa-spin fa-spinner');
      };

      ListItemView.prototype.removeSpinner = function() {
        return this.$el.find('.spinner').removeClass('fa-spin fa-spinner');
      };

      ListItemView.prototype.changeModuleStatus = function(status) {
        return bootbox.confirm("Are you sure you want to " + status + " '" + (this.model.get('post_excerpt')) + "' ?", (function(_this) {
          return function(result) {
            if (result) {
              _this.addSpinner();
              return _this.model.save({
                post_status: status
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
        return this.$el.attr('colspan', 7);
      };

      return EmptyView;

    })(Marionette.ItemView);
    return Views.ListView = (function(_super) {
      __extends(ListView, _super);

      function ListView() {
        return ListView.__super__.constructor.apply(this, arguments);
      }

      ListView.prototype.template = contentListTpl;

      ListView.prototype.className = 'row';

      ListView.prototype.itemView = ListItemView;

      ListView.prototype.emptyView = EmptyView;

      ListView.prototype.itemViewContainer = '#list-content-pieces';

      ListView.prototype.itemViewOptions = function() {
        return {
          textbooksCollection: this.textbooks,
          chaptersCollection: Marionette.getOption(this, 'chaptersCollection')
        };
      };

      ListView.prototype.events = {
        'change #content-post-status-filter, #difficulty-level-filter': 'setFilteredContent',
        'change .textbook-filter': function(e) {
          return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
        }
      };

      ListView.prototype.initialize = function() {
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

      ListView.prototype.onShow = function() {
        var textbookFiltersHTML;
        this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        this.fullCollection = Marionette.getOption(this, 'fullCollection');
        textbookFiltersHTML = $.showTextbookFilters({
          textbooks: this.textbooksCollection
        });
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        this.$el.find("#content-pieces-table").tablesorter();
        this.$el.find(".select2-filters").select2();
        return this.onUpdatePager();
      };

      ListView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType) {
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

      ListView.prototype.setFilteredContent = function() {
        var filtered_data;
        filtered_data = $.filterTableByTextbooks(this);
        this.collection.set(filtered_data);
        return this.onUpdatePager();
      };

      ListView.prototype.onUpdatePager = function() {
        var pagerOptions;
        this.$el.find("#content-pieces-table").trigger("updateCache");
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find("#content-pieces-table").tablesorterPager(pagerOptions);
      };

      return ListView;

    })(Marionette.CompositeView);
  });
});
