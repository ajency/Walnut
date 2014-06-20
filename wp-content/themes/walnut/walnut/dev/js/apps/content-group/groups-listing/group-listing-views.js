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
            console.log(_this.textbooks);
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
        this.textbooks = options.textbooksCollection;
        return console.log(options);
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

      EmptyView.prototype.template = 'No content pieces available';

      return EmptyView;

    })(Marionette.ItemView);
    return Views.GroupsListingView = (function(_super) {
      __extends(GroupsListingView, _super);

      function GroupsListingView() {
        this.filterTableData = __bind(this.filterTableData, this);
        this.changeSection = __bind(this.changeSection, this);
        this.changeChapter = __bind(this.changeChapter, this);
        this.changeTextbook = __bind(this.changeTextbook, this);
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
        'change .filters': 'filterTableData',
        'change #textbooks-filter': 'changeTextbook',
        'change #chapters-filter': 'changeChapter',
        'change #sections-filter': 'changeSection'
      };

      GroupsListingView.prototype.mixinTemplateHelpers = function(data) {
        data = GroupsListingView.__super__.mixinTemplateHelpers.call(this, data);
        data.textbooksFilter = this.textbooks;
        return data;
      };

      GroupsListingView.prototype.initialize = function() {
        var textbooksCollection;
        textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        this.textbooks = new Array();
        textbooksCollection.each((function(_this) {
          return function(textbookModel, ind) {
            return _this.textbooks.push({
              'name': textbookModel.get('name'),
              'id': textbookModel.get('term_id')
            });
          };
        })(this));
        return console.log(this.textbooks);
      };

      GroupsListingView.prototype.onShow = function() {
        var pagerOptions;
        this.$el.find("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter").select2();
        $('#content-pieces-table').tablesorter();
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#content-pieces-table').tablesorterPager(pagerOptions);
      };

      GroupsListingView.prototype.changeTextbook = function(e) {
        this.$el.find('#chapters-filter, #sections-filter, #subsections-filter').select2('data', '');
        return this.trigger("fetch:chapters", $(e.target).val());
      };

      GroupsListingView.prototype.changeChapter = function(e) {
        console.log('in change chapter');
        this.$el.find('#sections-filter, #subsections-filter').select2('data', '');
        return this.trigger("fetch:sections", $(e.target).val());
      };

      GroupsListingView.prototype.changeSection = function(e) {
        this.$el.find(' #subsections-filter').select2('data', '');
        return this.trigger("fetch:subsections", $(e.target).val());
      };

      GroupsListingView.prototype.onFetchChaptersComplete = function(chapterCollection) {
        if (_.size(chapterCollection) > 0) {
          this.$el.find('#chapters-filter').select2('data', {
            'text': 'Select Chapter'
          });
          return _.each(chapterCollection, (function(_this) {
            return function(chap, index) {
              return _this.$el.find('#chapters-filter').append("<option value='" + (chap.get('term_id')) + "'>" + (chap.get('name')) + "</option>");
            };
          })(this));
        } else {
          this.$el.find('#chapters-filter').select2('data', {
            'text': 'No chapters'
          }).html('<option value="">All Chapters</option>');
          this.$el.find('#sections-filter').select2('data', {
            'text': 'No Sections'
          }).html('<option value="">All Sections</option>');
          return this.$el.find('#subsections-filter').select2('data', {
            'text': 'No Subsections'
          }).html('<option value="">All Sub Sections</option>');
        }
      };

      GroupsListingView.prototype.onFetchSectionsComplete = function(sectionList) {
        if (_.size(sectionList) > 0) {
          this.$el.find('#sections-filter').select2('data', {
            'text': 'Select Section'
          });
          return _.each(sectionList, (function(_this) {
            return function(section, index) {
              return _this.$el.find('#sections-filter').append("<option value='" + (section.get('term_id')) + "'>" + (section.get('name')) + "</option>");
            };
          })(this));
        } else {
          this.$el.find('#sections-filter').select2('data', {
            'text': 'No Sections'
          }).html('<option value="">All Sections</option>');
          return this.$el.find('#subsections-filter').select2('data', {
            'text': 'No Subsections'
          }).html('<option value="">All Sub Sections</option>');
        }
      };

      GroupsListingView.prototype.onFetchSubsectionsComplete = function(subSectionList) {
        if (_.size(subSectionList) > 0) {
          this.$el.find('#subsections-filter').select2('data', {
            'text': 'Select Subsection'
          });
          return _.each(subSectionList, (function(_this) {
            return function(subSection) {
              return _this.$el.find('#subsections-filter').append("<option value='" + (subSection.get('term_id')) + "'>" + (subSection.get('name')) + "</option>");
            };
          })(this));
        } else {
          return this.$el.find('#subsections-filter').select2('data', {
            'text': 'No Subsections'
          }).html('<option value="">All Sub Sections</option>');
        }
      };

      GroupsListingView.prototype.filterTableData = function(e) {
        var filter_ids, filtered_data, fullCollection, pagerOptions;
        filter_ids = _.map(this.$el.find('select.terms-filter'), function(ele, index) {
          var item;
          item = '';
          if (!isNaN(ele.value)) {
            item = ele.value;
          }
          return item;
        });
        filter_ids = _.compact(filter_ids);
        fullCollection = Marionette.getOption(this, 'fullCollection');
        filtered_data = fullCollection.models;
        if (_.size(filter_ids) > 0) {
          filtered_data = _.filter(filtered_data, (function(_this) {
            return function(item) {
              var filtered_item, term_ids;
              filtered_item = '';
              term_ids = _.flatten(item.get('term_ids'));
              console.log(term_ids);
              if (_.size(_.intersection(term_ids, filter_ids)) === _.size(filter_ids)) {
                filtered_item = item;
              }
              return filtered_item;
            };
          })(this));
        }
        this.collection.set(filtered_data);
        console.log(this.collection);
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
