var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/textbooks/templates/textbooks.html', 'text!apps/textbooks/list/templates/list_item.html'], function(App, textbooksTpl, listitemTpl) {
  return App.module("TextbooksApp.List.Views", function(Views, App) {
    var ListItemView;
    ListItemView = (function(_super) {
      __extends(ListItemView, _super);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'li';

      ListItemView.prototype.className = 'mix';

      ListItemView.prototype.template = listitemTpl;

      return ListItemView;

    })(Marionette.ItemView);
    return Views.ListView = (function(_super) {
      __extends(ListView, _super);

      function ListView() {
        return ListView.__super__.constructor.apply(this, arguments);
      }

      ListView.prototype.template = textbooksTpl;

      ListView.prototype.className = 'page-content';

      ListView.prototype.itemView = ListItemView;

      ListView.prototype.itemViewContainer = 'ul.textbooks_list';

      ListView.prototype.serializeData = function() {
        var data, num;
        data = ListView.__super__.serializeData.call(this);
        data.classes = [];
        num = 0;
        num = (function() {
          var _results;
          _results = [];
          while (num < 15) {
            data.classes.push(num);
            _results.push(num++);
          }
          return _results;
        })();
        return data;
      };

      ListView.prototype.events = {
        'click .btn-group': 'dropdown_popup',
        'click .sort': 'sortTable',
        'click .filter_class': function(e) {
          return this.trigger("filter:textbooks:class", $(e.target).closest('li').attr('data-filter'));
        }
      };

      ListView.prototype.dropdown_popup = function(e) {
        if ($(e.target).closest('div').hasClass('open')) {
          return $(e.target).closest('div').removeClass('open');
        } else {
          return $(e.target).closest('div').addClass('open');
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
        return console.log(this.collection);
      };

      return ListView;

    })(Marionette.CompositeView);
  });
});
