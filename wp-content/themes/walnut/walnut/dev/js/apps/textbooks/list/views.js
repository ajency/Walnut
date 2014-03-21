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

      ListItemView.prototype.className = 'mix northeast camping climbing fishing swimming mix_all';

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

      ListView.prototype.initialize = function() {
        return console.log('textbooks');
      };

      return ListView;

    })(Marionette.CompositeView);
  });
});
