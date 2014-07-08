var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-pieces/list-content-pieces/templates/content-pieces-list-tpl.html'], function(App, contentListTpl, listitemTpl, notextbooksTpl) {
  return App.module("ContentPiecesApp.ContentList.Views", function(Views, App) {
    var EmptyView, ListItemView;
    ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        this.successSaveFn = __bind(this.successSaveFn, this);
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td>{{&post_excerpt}}</td> <td>{{post_author_name}}</td> <td>{{textbookName}}</td> <td>{{chapterName}}</td> <td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td> <td>{{&statusMessage}}</td> <td class="text-center"><a target="_blank" href="{{view_url}}">View</a> {{&edit_link}} {{#archivedModule}}<span class="nonDevice">|</span><a target="_blank"  class="nonDevice cloneModule">Clone</a>{{/archivedModule}}</td>';

      ListItemView.prototype.serializeData = function() {
        var data, edit_url, _ref;
        data = ListItemView.__super__.serializeData.call(this);
        data.modified_date = moment(data.post_modified).format("Do MMM YYYY");
        data.sort_date = moment(data.post_modified).format("YYYYMMDD");
        data.view_url = SITEURL + '/#content-piece/' + data.ID;
        edit_url = SITEURL + '/content-creator/#edit-content/' + data.ID;
        data.edit_link = '';
        if (data.post_status === 'pending') {
          data.edit_link = ' <span class="nonDevice">|</span> <a target="_blank" href="' + edit_url + '" class="nonDevice">Edit</a>';
        }
        data.textbookName = (function(_this) {
          return function() {
            var textbook;
            textbook = _.findWhere(_this.textbooks, {
              "id": data.term_ids.textbook
            });
            return textbook.name;
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
        data.statusMessage = function() {
          if (data.post_status === 'pending') {
            return '<span class="label label-important">Under Review</span>';
          } else if (data.post_status === 'publish') {
            return '<span class="label label-info">Published</span>';
          } else if (data.post_status === 'archive') {
            return '<span class="label label-success">Archived</span>';
          }
        };
        if ((_ref = data.post_status) === 'publish' || _ref === 'archive') {
          data.archivedModule = true;
        }
        return data;
      };

      ListItemView.prototype.events = {
        'click a.cloneModule': 'cloneModule'
      };

      ListItemView.prototype.initialize = function(options) {
        this.textbooks = options.textbooksCollection;
        return this.chapters = options.chaptersCollection;
      };

      ListItemView.prototype.cloneModule = function() {
        var contentPieceData, _ref;
        if ((_ref = this.model.get('post_status')) === 'publish' || _ref === 'archive') {
          if (confirm("Are you sure you want to clone '" + (this.model.get('post_excerpt')) + "' ?") === true) {
            this.cloneModel = App.request("new:content:piece");
            contentPieceData = this.model.toJSON();
            console.log('contentpiecedata');
            console.log(this.model.toJSON());
            this.clonedData = _.omit(contentPieceData, ['ID', 'guid', 'last_modified_by', 'post_author', 'post_author_name', 'post_date', 'post_date_gmt', 'published_by']);
            this.clonedData.post_status = "pending";
            this.clonedData.clone_id = this.model.id;
            return App.execute("when:fetched", this.cloneModel, (function(_this) {
              return function() {
                return _this.cloneModel.save(_this.clonedData, {
                  wait: true,
                  success: _this.successSaveFn,
                  error: _this.errorFn
                });
              };
            })(this));
          }
        }
      };

      ListItemView.prototype.successSaveFn = function(model) {
        return document.location = SITEURL + ("/content-creator/#edit-content/" + model.id);
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
        return this.$el.attr('colspan', 3);
      };

      return EmptyView;

    })(Marionette.ItemView);
    return Views.ListView = (function(_super) {
      __extends(ListView, _super);

      function ListView() {
        return ListView.__super__.constructor.apply(this, arguments);
      }

      ListView.prototype.template = contentListTpl;

      ListView.prototype.className = 'tiles white grid simple vertical green';

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
        'change #content-post-status-filter, .content-type-filter': function() {
          return this.setFilteredContent();
        },
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
        var pagerOptions, textbookFiltersHTML;
        this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        this.fullCollection = Marionette.getOption(this, 'fullCollection');
        textbookFiltersHTML = $.showTextbookFilters({
          textbooks: this.textbooksCollection
        });
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        this.$el.find(".select2-filters").select2();
        $('#content-pieces-table').tablesorter();
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#content-pieces-table').tablesorterPager(pagerOptions);
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
        var filtered_data, pagerOptions;
        filtered_data = $.filterTableByTextbooks(this);
        this.collection.set(filtered_data);
        $('#content-pieces-table').trigger("updateCache");
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#content-pieces-table').tablesorterPager(pagerOptions);
      };

      return ListView;

    })(Marionette.CompositeView);
  });
});
