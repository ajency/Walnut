var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["app", 'backbone'], function(App, Backbone) {
  App.module("Entities.Menus", function(Menus, App, Backbone, Marionette, $, _) {
    var API, menuCollection;
    Menus.MenuItemModel = (function(superClass) {
      extend(MenuItemModel, superClass);

      function MenuItemModel() {
        return MenuItemModel.__super__.constructor.apply(this, arguments);
      }

      MenuItemModel.prototype.idAttribute = 'id';

      MenuItemModel.prototype.defaults = {
        post_title: '',
        menu_item_link: '',
        menu_item_parent: 0,
        order: 0,
        submenu: []
      };

      MenuItemModel.prototype.name = 'menu-item';

      return MenuItemModel;

    })(Backbone.Model);
    Menus.MenuItemCollection = (function(superClass) {
      extend(MenuItemCollection, superClass);

      function MenuItemCollection() {
        return MenuItemCollection.__super__.constructor.apply(this, arguments);
      }

      MenuItemCollection.prototype.model = Menus.MenuItemModel;

      MenuItemCollection.prototype.comparator = 'order';

      return MenuItemCollection;

    })(Backbone.Collection);
    menuCollection = new Menus.MenuItemCollection;
    API = {
      getMenus: function(param) {
        if (param == null) {
          param = {};
        }
        if (menuCollection.isEmpty()) {
          menuCollection.url = AJAXURL + '?action=get-menus';
          menuCollection.fetch({
            reset: true,
            data: param
          });
          return menuCollection;
        } else {
          return menuCollection;
        }
      }
    };
    return App.reqres.setHandler("get:site:menus", function() {
      return API.getMenus();
    });
  });
  return App.Entities.Menus;
});
