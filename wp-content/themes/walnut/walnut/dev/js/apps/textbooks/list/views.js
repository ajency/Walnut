var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/textbooks/templates/textbooks.html', 'text!apps/textbooks/list/templates/list_item.html', 'text!apps/textbooks/templates/no_textbooks.html'], function(App, textbooksTpl, listitemTpl, notextbooksTpl) {
  return App.module("TextbooksApp.List.Views", function(Views, App) {
    var EmptyView, ListItemView;
    ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'li';

      ListItemView.prototype.className = 'mix';

      ListItemView.prototype.template = listitemTpl;

      ListItemView.prototype.onShow = function() {
        var $filters, class_id, dimensions, _i, _len, _ref;
        this.$el.attr('data-name', this.model.get('name'));
        _ref = this.model.get('classes');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          class_id = _ref[_i];
          this.$el.addClass('Class_' + class_id);
        }
        return $filters = $('#Filters').find('li', dimensions = {
          region: 'all',
          recreation: 'all'
        });
      };

      ListItemView.prototype.serializeData = function() {
        var class_id, class_string, data, item_classes, _i, _len;
        data = ListItemView.__super__.serializeData.call(this);
        item_classes = _.sortBy(this.model.get('classes', function(num) {
          return num;
        }));
        class_string = '';
        for (_i = 0, _len = item_classes.length; _i < _len; _i++) {
          class_id = item_classes[_i];
          class_string += 'Class ' + class_id;
          if (_.last(item_classes) !== class_id) {
            class_string += ', ';
          }
        }
        data.class_string = class_string;
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
        return ListView.__super__.constructor.apply(this, arguments);
      }

      ListView.prototype.template = textbooksTpl;

      ListView.prototype.className = 'page-content';

      ListView.prototype.itemView = ListItemView;

      ListView.prototype.emptyView = EmptyView;

      ListView.prototype.itemViewContainer = 'ul.textbooks_list';

      ListView.prototype.serializeData = function() {
        var collection_classes, data, data_classes;
        data = ListView.__super__.serializeData.call(this);
        collection_classes = this.collection.pluck('classes');
        data_classes = _.union(_.flatten(collection_classes));
        data.classes = _.sortBy(data_classes, function(num) {
          return num;
        });
        return data;
      };

      ListView.prototype.events = {
        'click .filter_class': function(e) {
          return this.trigger("filter:textbooks:class", $(e.target).closest('li').attr('data-filter'));
        }
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
        return $('#textbooks').mixitup({
          layoutMode: 'list',
          listClass: 'list',
          gridClass: 'grid',
          effects: ['fade', 'blur'],
          listEffects: ['fade', 'rotateX']
        });
      };

      return ListView;

    })(Marionette.CompositeView);
  });
});
