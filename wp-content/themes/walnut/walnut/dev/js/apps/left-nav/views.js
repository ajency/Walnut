var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("LeftNavApp.Controller.Views", function(Views, App) {
    var MenuItemView;
    MenuItemView = (function(_super) {
      __extends(MenuItemView, _super);

      function MenuItemView() {
        return MenuItemView.__super__.constructor.apply(this, arguments);
      }

      MenuItemView.prototype.tagName = 'li';

      MenuItemView.prototype.template = '<a href="{{menu_item_link}}"><span class="title">{{post_title}}</span></a>';

      return MenuItemView;

    })(Marionette.ItemView);
    return Views.LeftNavView = (function(_super) {
      __extends(LeftNavView, _super);

      function LeftNavView() {
        return LeftNavView.__super__.constructor.apply(this, arguments);
      }

      LeftNavView.prototype.template = '<div id="main-menu-wrapper" class="page-sidebar-wrapper"><p class="menu-title">SCHOOL 1<span class="pull-right"><a href="javascript:;"><i class="fa fa-refresh"></i></a></span></p> <ul class="menu"></ul></div>';

      LeftNavView.prototype.id = 'main-menu';

      LeftNavView.prototype.className = 'page-sidebar';

      LeftNavView.prototype.itemView = MenuItemView;

      LeftNavView.prototype.itemViewContainer = '> .page-sidebar-wrapper > ul.menu';

      return LeftNavView;

    })(Marionette.CompositeView);
  });
});
