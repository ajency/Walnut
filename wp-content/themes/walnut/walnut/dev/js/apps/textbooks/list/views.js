var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/textbooks/templates/textbooks.html', 'text!apps/textbooks/list/templates/list_item.html', 'text!apps/textbooks/templates/no_textbooks.html'], function(App, textbooksTpl, listitemTpl, notextbooksTpl) {
  return App.module("TextbooksApp.List.Views", function(Views, App) {
    var EmptyView, ListItemView;
    ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'li';

      ListItemView.prototype.className = 'mix mix_all';

      ListItemView.prototype.template = listitemTpl;

      ListItemView.prototype.onShow = function() {
        var class_id, class_ids, subject, subjects, _i, _j, _len, _len1, _results;
        this.$el.attr('data-name', this.model.get('name'));
        class_ids = this.model.get('classes');
        if (class_ids) {
          for (_i = 0, _len = class_ids.length; _i < _len; _i++) {
            class_id = class_ids[_i];
            this.$el.addClass('class' + class_id);
          }
        }
        subjects = this.model.get('subjects');
        if (subjects) {
          _results = [];
          for (_j = 0, _len1 = subjects.length; _j < _len1; _j++) {
            subject = subjects[_j];
            _results.push(this.$el.addClass(subject));
          }
          return _results;
        }
      };

      ListItemView.prototype.serializeData = function() {
        var class_id, class_ids, class_string, data, item_classes, item_subjects, subject, subject_string, subjects, _i, _j, _len, _len1;
        data = ListItemView.__super__.serializeData.call(this);
        class_ids = this.model.get('classes');
        if (class_ids) {
          item_classes = _.sortBy(class_ids, function(num) {
            return num;
          });
          class_string = '';
          for (_i = 0, _len = item_classes.length; _i < _len; _i++) {
            class_id = item_classes[_i];
            class_string += 'Class ' + class_id;
            if (_.last(item_classes) !== class_id) {
              class_string += ', ';
            }
          }
          data.class_string = class_string;
        }
        subjects = this.model.get('subjects');
        if (subjects) {
          item_subjects = _.sortBy(subjects, function(num) {
            return num;
          });
          subject_string = '';
          for (_j = 0, _len1 = item_subjects.length; _j < _len1; _j++) {
            subject = item_subjects[_j];
            subject_string += subject;
            if (_.last(item_subjects) !== subject) {
              subject_string += ', ';
            }
          }
          data.subject_string = subject_string;
        }
        return data;
      };

      return ListItemView;

    })(Marionette.ItemView);
    EmptyView = (function(_super) {
      __extends(EmptyView, _super);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = notextbooksTpl;

      return EmptyView;

    })(Marionette.ItemView);
    return Views.ListView = (function(_super) {
      __extends(ListView, _super);

      function ListView() {
        this.filterBooks = __bind(this.filterBooks, this);
        return ListView.__super__.constructor.apply(this, arguments);
      }

      ListView.prototype.template = textbooksTpl;

      ListView.prototype.className = 'page-content';

      ListView.prototype.itemView = ListItemView;

      ListView.prototype.emptyView = EmptyView;

      ListView.prototype.itemViewContainer = 'ul.textbooks_list';

      ListView.prototype.serializeData = function() {
        var collection_classes, collection_subjects, data, data_classes, data_subjects;
        data = ListView.__super__.serializeData.call(this);
        console.log(this.collection);
        collection_classes = this.collection.pluck('classes');
        data_classes = _.union(_.flatten(collection_classes));
        data.classes = _.compact(_.sortBy(data_classes, function(num) {
          return num;
        }));
        collection_subjects = this.collection.pluck('subjects');
        data_subjects = _.union(_.flatten(collection_subjects));
        data.subjects = _.compact(_.sortBy(data_subjects, function(num) {
          return num;
        }));
        return data;
      };

      ListView.prototype.events = {
        'click #Filters li': 'filterBooks'
      };

      ListView.prototype.sortTable = function(e) {
        var data_sort, options, sort_by;
        options = {};
        data_sort = $(e.target).attr('data-sort');
        sort_by = data_sort.split('-');
        options.orderby = sort_by[1];
        options.order = $(e.target).attr('data-order');
        return this.trigger("sort:textbooks", options);
      };

      ListView.prototype.onShow = function() {
        setTimeout(function() {
          var $filters, dimensions;
          $('#textbooks').mixitup({
            layoutMode: 'list',
            listClass: 'list',
            gridClass: 'grid',
            effects: ['fade', 'blur'],
            listEffects: ['fade', 'rotateX']
          });
          return $filters = $('#Filters').find('li', dimensions = {
            region: 'all',
            recreation: 'all'
          });
        }, 500);
        return this.dimensions = {
          region: 'all',
          recreation: 'all'
        };
      };

      ListView.prototype.filterBooks = function(e) {
        var $t, dimension, filter, filterString, re;
        console.log('@dimensions');
        console.log(this.dimensions);
        $t = $(e.target).closest('li');
        dimension = $t.attr('data-dimension');
        filter = $t.attr('data-filter');
        filterString = this.dimensions[dimension];
        if (filter === 'all') {
          if (!$t.hasClass('active')) {
            $t.addClass('active').siblings().removeClass('active');
            filterString = 'all';
          } else {
            $t.removeClass('active');
            filterString = '';
          }
        } else {
          $t.siblings('[data-filter="all"]').removeClass('active');
          filterString = filterString.replace('all', '');
          if (!$t.hasClass('active')) {
            $t.addClass('active');
            if (filterString === '') {
              filterString = filter;
            } else {
              filterString = filterString + ' ' + filter;
            }
          } else {
            $t.removeClass('active');
            re = new RegExp('(\\s|^)' + filter);
            filterString = filterString.replace(re, '');
          }
        }
        this.dimensions[dimension] = filterString;
        console.info('dimension 1: ' + this.dimensions.region);
        console.info('dimension 2: ' + this.dimensions.recreation);
        return $('#textbooks').mixitup('filter', [this.dimensions.region, this.dimensions.recreation]);
      };

      return ListView;

    })(Marionette.CompositeView);
  });
});
