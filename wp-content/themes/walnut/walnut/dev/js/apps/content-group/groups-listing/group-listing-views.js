var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-group/groups-listing/templates/content-group-list-tmpl.html'], function(App, contentListTpl) {
  return App.module("ContentGroupApp.GroupListing.Views", function(Views, App, Backbone, Marionette, $, _) {
    var EmptyView, ListItemView;
    ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        this.successUpdateFn = __bind(this.successUpdateFn, this);
        this.successSaveFn = __bind(this.successSaveFn, this);
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td>{{name}}</td> <td>{{textbookName}}</td> <td>{{durationRounded}} {{minshours}}</td> <td>{{&statusMessage}}</td> <td class="text-center"><a target="_blank" href="{{view_url}}">View</a> <span class="nonDevice">|</span> <a target="_blank" href="{{edit_url}}" class="nonDevice">Edit</a> {{#archivedModule}}<span class="nonDevice">|</span><a target="_blank"  class="nonDevice cloneModule">Clone</a>{{/archivedModule}}</td>';

      ListItemView.prototype.serializeData = function() {
        var data, _ref;
        data = ListItemView.__super__.serializeData.call(this);
        data.view_url = SITEURL + ("/#view-group/" + data.id);
        data.edit_url = SITEURL + ("/#edit-module/" + data.id);
        data.textbookName = (function(_this) {
          return function() {
            var textbook;
            textbook = _.findWhere(_this.textbooks, {
              "id": data.term_ids.textbook
            });
            return textbook.name;
          };
        })(this);
        data.durationRounded = function() {
          if (data.minshours === 'hrs') {
            return _.numberFormat(parseFloat(data.duration), 2);
          } else {
            return data.duration;
          }
        };
        data.statusMessage = function() {
          if (data.status === 'underreview') {
            return '<span class="label label-important">Under Review</span>';
          } else if (data.status === 'publish') {
            return '<span class="label label-info">Published</span>';
          } else if (data.status === 'archive') {
            return '<span class="label label-success">Archived</span>';
          }
        };
        if ((_ref = data.status) === 'publish' || _ref === 'archive') {
          data.archivedModule = true;
        }
        return data;
      };

      ListItemView.prototype.events = {
        'click a.cloneModule': 'cloneModule'
      };

      ListItemView.prototype.initialize = function(options) {
        return this.textbooks = options.textbooksCollection;
      };

      ListItemView.prototype.cloneModule = function() {
        var groupData, _ref;
        if ((_ref = this.model.get('status')) === 'publish' || _ref === 'archive') {
          if (confirm("Are you sure you want to clone '" + (this.model.get('name')) + "' ?") === true) {
            this.cloneModel = App.request("new:content:group");
            groupData = this.model.toJSON();
            this.clonedData = _.omit(groupData, ['id', 'last_modified_on', 'last_modified_by', 'created_on', 'created_by']);
            this.clonedData.name = "" + this.clonedData.name + " clone";
            this.clonedData.status = "underreview";
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
        return App.navigate("edit-module/" + (model.get('id')), {
          trigger: true
        });
      };

      ListItemView.prototype.errorFn = function() {
        return console.log('error');
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
    return Views.GroupsListingView = (function(_super) {
      __extends(GroupsListingView, _super);

      function GroupsListingView() {
        return GroupsListingView.__super__.constructor.apply(this, arguments);
      }

      GroupsListingView.prototype.template = contentListTpl;

      GroupsListingView.prototype.className = 'tiles white grid simple vertical green';

      GroupsListingView.prototype.itemView = ListItemView;

      GroupsListingView.prototype.emptyView = EmptyView;

      GroupsListingView.prototype.itemViewContainer = '#list-content-pieces';

      GroupsListingView.prototype.itemViewOptions = function() {
        return {
          textbooksCollection: this.textbooks
        };
      };

      GroupsListingView.prototype.events = {
        'change .filters': function(e) {
          return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
        }
      };

      GroupsListingView.prototype.mixinTemplateHelpers = function(data) {
        data = GroupsListingView.__super__.mixinTemplateHelpers.call(this, data);
        data.textbooksFilter = this.textbooks;
        return data;
      };

      GroupsListingView.prototype.initialize = function() {
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

      GroupsListingView.prototype.onShow = function() {
        var pagerOptions, textbookFiltersHTML;
        textbookFiltersHTML = $.showTextbookFilters(this.textbooksCollection);
        this.fullCollection = Marionette.getOption(this, 'fullCollection');
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        this.$el.find("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter").select2();
        $('#content-pieces-table').tablesorter();
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#content-pieces-table').tablesorterPager(pagerOptions);
      };

      GroupsListingView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType) {
        var filtered_data, pagerOptions;
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
        filtered_data = $.filterTableByTextbooks(this);
        this.collection.set(filtered_data);
        $("#content-pieces-table").trigger("updateCache");
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#content-pieces-table').tablesorterPager(pagerOptions);
      };

      return GroupsListingView;

    })(Marionette.CompositeView);
  });
});
