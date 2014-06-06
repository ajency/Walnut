var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/content-pieces/list-content-pieces/templates/content-pieces-list-tpl.html'], function(App, contentListTpl, listitemTpl, notextbooksTpl) {
  return App.module("ContentPiecesApp.ContentList.Views", function(Views, App) {
    var EmptyView, ListItemView;
    ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td>{{post_excerpt}}</td> <td>{{post_author_name}}</td> <td>{{modified_date}}</td> <td class="text-center"><a target="_blank" href="{{view_url}}">View</a> <span class="nonDevice">|</span> <a target="_blank" href="{{edit_url}}" class="nonDevice">Edit</a></td>';

      ListItemView.prototype.serializeData = function() {
        var data;
        data = ListItemView.__super__.serializeData.call(this);
        data.modified_date = moment(this.model.get('post_modified')).format("Do MMM YYYY");
        data.view_url = SITEURL + '/#content-piece/' + this.model.get('ID');
        data.edit_url = SITEURL + '/content-creator/#edit-content/' + this.model.get('ID');
        return data;
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
    return Views.ListView = (function(_super) {
      __extends(ListView, _super);

      function ListView() {
        this.filterTableData = __bind(this.filterTableData, this);
        this.changeTextbooks = __bind(this.changeTextbooks, this);
        return ListView.__super__.constructor.apply(this, arguments);
      }

      ListView.prototype.template = contentListTpl;

      ListView.prototype.className = 'tiles white grid simple vertical green';

      ListView.prototype.itemView = ListItemView;

      ListView.prototype.emptyView = EmptyView;

      ListView.prototype.itemViewContainer = '#list-content-pieces';

      ListView.prototype.events = {
        'change .filters': 'filterTableData',
        'change #textbooks-filter': 'changeTextbooks',
        'change #chapters-filter': function(e) {
          return this.trigger("fetch:sections:subsections", $(e.target).val());
        }
      };

      ListView.prototype.onShow = function() {
        var pagerOptions;
        $("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter").select2();
        $('#content-pieces-table').tablesorter();
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#content-pieces-table').tablesorterPager(pagerOptions);
      };

      ListView.prototype.changeTextbooks = function(e) {
        this.$el.find('#chapters-filter, #sections-filter, #subsections-filter').select2('data', '');
        return this.trigger("fetch:chapters", $(e.target).val());
      };

      ListView.prototype.onFetchChaptersComplete = function(chapters) {
        if (_.size(chapters) > 0) {
          $('#chapters-filter').select2('data', {
            'text': 'Select Chapter'
          });
          return _.each(chapters.models, (function(_this) {
            return function(chap, index) {
              return _this.$el.find('#chapters-filter').append('<option value="' + chap.get('term_id') + '">' + chap.get('name') + '</option>');
            };
          })(this));
        } else {
          this.$el.find('#chapters-filter,#sections-filter,#subsections-filter').html('');
          this.$el.find('#chapters-filter').select2('data', {
            'text': 'No chapters'
          });
          this.$el.find('#sections-filter').select2('data', {
            'text': 'No Sections'
          });
          return this.$el.find('#subsections-filter').select2('data', {
            'text': 'No Subsections'
          });
        }
      };

      ListView.prototype.onFetchSubsectionsComplete = function(allsections) {
        if (_.size(allsections) > 0) {
          if (_.size(allsections.sections) > 0) {
            $('#sections-filter').select2('data', {
              'text': 'Select Section'
            });
            _.each(allsections.sections, (function(_this) {
              return function(section, index) {
                return _this.$el.find('#sections-filter').append('<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>');
              };
            })(this));
          } else {
            $('#sections-filter').select2('data', {
              'text': 'No Sections'
            }).html('');
          }
          if (_.size(allsections.subsections) > 0) {
            $('#subsections-filter').select2('data', {
              'text': 'Select SubSection'
            });
            return _.each(allsections.subsections, (function(_this) {
              return function(section, index) {
                return _this.$el.find('#subsections-filter').append('<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>');
              };
            })(this));
          } else {
            return $('#subsections-filter').select2('data', {
              'text': 'No Subsections'
            }).html('');
          }
        } else {
          $('#sections-filter,#subsections-filter').html('');
          $('#sections-filter').select2('data', {
            'text': 'No Sections'
          });
          return $('#subsections-filter').select2('data', {
            'text': 'No Subsections'
          });
        }
      };

      ListView.prototype.filterTableData = function(e) {
        var content_type, filter_ids, filtered_data, fullCollection, pagerOptions;
        filter_ids = _.map(this.$el.find('select.textbook-filter'), function(ele, index) {
          var item;
          item = '';
          if (!isNaN(ele.value)) {
            item = ele.value;
          }
          return item;
        });
        filter_ids = _.compact(filter_ids);
        content_type = this.$el.find('#content-type-filter').val();
        fullCollection = Marionette.getOption(this, 'fullCollection');
        filtered_data = fullCollection.models;
        if (content_type !== '') {
          filtered_data = fullCollection.where({
            'content_type': content_type
          });
        }
        if (_.size(filter_ids) > 0) {
          filtered_data = _.filter(filtered_data, (function(_this) {
            return function(item) {
              var filtered_item, term_ids;
              filtered_item = '';
              term_ids = _.flatten(item.get('term_ids'));
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

      return ListView;

    })(Marionette.CompositeView);
  });
});
