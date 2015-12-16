var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/textbooks/templates/textbooks-list.html', 'text!apps/textbooks/list/templates/list_item.html', 'text!apps/textbooks/templates/no_textbooks.html'], function(App, textbooksListTpl, listitemTpl, notextbooksTpl) {
  return App.module("TextbooksApp.List.Views", function(Views, App) {
    var EmptyView, ListItemView;
    ListItemView = (function(superClass) {
      extend(ListItemView, superClass);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'li';

      ListItemView.prototype.className = 'mix mix_all';

      ListItemView.prototype.template = listitemTpl;

      ListItemView.prototype.onShow = function() {
        var class_id, class_ids, i, j, len, len1, subject, subjects;
        this.$el.attr('data-name', this.model.get('name'));
        class_ids = this.model.get('classes');
        if (class_ids) {
          for (i = 0, len = class_ids.length; i < len; i++) {
            class_id = class_ids[i];
            this.$el.addClass(_.slugify(CLASS_LABEL[class_id]));
          }
        }
        subjects = this.model.get('subjects');
        if (subjects) {
          for (j = 0, len1 = subjects.length; j < len1; j++) {
            subject = subjects[j];
            this.$el.addClass(subject);
          }
        }
        return $('#textbooks').mixitup({
          layoutMode: 'list',
          listClass: 'list',
          gridClass: 'grid',
          effects: ['fade', 'blur'],
          listEffects: ['fade', 'rotateX']
        });
      };

      ListItemView.prototype.serializeData = function() {
        var class_id, class_ids, class_string, data, i, item_classes, len;
        data = ListItemView.__super__.serializeData.call(this);
        class_ids = this.model.get('classes');
        if (class_ids) {
          item_classes = _.sortBy(class_ids, function(num) {
            return num;
          });
          class_string = '';
          for (i = 0, len = item_classes.length; i < len; i++) {
            class_id = item_classes[i];
            class_string += CLASS_LABEL[class_id];
            if (_.last(item_classes) !== class_id) {
              class_string += ', ';
            }
          }
          data.class_string = class_string;
        }
        return data;
      };

      return ListItemView;

    })(Marionette.ItemView);
    EmptyView = (function(superClass) {
      extend(EmptyView, superClass);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = notextbooksTpl;

      return EmptyView;

    })(Marionette.ItemView);
    return Views.ListView = (function(superClass) {
      extend(ListView, superClass);

      function ListView() {
        this.filterBooks = bind(this.filterBooks, this);
        return ListView.__super__.constructor.apply(this, arguments);
      }

      ListView.prototype.template = textbooksListTpl;

      ListView.prototype.className = '';

      ListView.prototype.itemView = ListItemView;

      ListView.prototype.emptyView = EmptyView;

      ListView.prototype.itemViewContainer = 'ul.textbooks_list';

      ListView.prototype.serializeData = function() {
        var collection_classes, collection_subjects, data, data_subjects;
        data = ListView.__super__.serializeData.call(this);
        console.log(this.collection);
        collection_classes = this.collection.pluck('classes');
        data.classes = _.chain(collection_classes).flatten().union().compact().sortBy(function(num) {
          return parseInt(num);
        }).map(function(m) {
          var classes;
          classes = [];
          classes.slug = _.slugify(CLASS_LABEL[m]);
          classes.label = CLASS_LABEL[m];
          return classes;
        }).value();
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
        console.log('onShow');
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
