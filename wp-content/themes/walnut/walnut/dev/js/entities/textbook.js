var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  App.module("Entities.Textbooks", function(Textbooks, App, Backbone, Marionette, $, _) {
    var API;
    Textbooks.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'id';

      ItemModel.prototype.defaults = {
        post_title: '',
        menu_item_link: '',
        menu_item_parent: 0,
        order: 0
      };

      ItemModel.prototype.name = 'menu-item';

      return ItemModel;

    })(Backbone.Model);
    Menus.MenuItemCollection = (function(_super) {
      __extends(MenuItemCollection, _super);

      function MenuItemCollection() {
        return MenuItemCollection.__super__.constructor.apply(this, arguments);
      }

      MenuItemCollection.prototype.model = Menus.MenuItemModel;

      MenuItemCollection.prototype.comparator = 'order';

      return MenuItemCollection;

    })(Backbone.Collection);
    Menus.MenuCollection = (function(_super) {
      __extends(MenuCollection, _super);

      function MenuCollection() {
        return MenuCollection.__super__.constructor.apply(this, arguments);
      }

      MenuCollection.prototype.model = Menus.MenuModel;

      MenuCollection.prototype.getSiteMenus = function() {
        return this.map(function(model) {
          return {
            menu_id: model.get('id'),
            menu_name: model.get('menu_name')
          };
        });
      };

      return MenuCollection;

    })(Backbone.Collection);
    API = {
      getMenus: function(param) {
        var menuCollection;
        if (param == null) {
          param = {};
        }
        menuCollection = new Menus.MenuItemCollection;
        menuCollection.url = AJAXURL + '?action=get-menus';
        menuCollection.fetch({
          reset: true,
          data: param
        });
        return menuCollection;
      },
      getMenuItems: function(menuId) {
        var menuItems;
        if (menuId == null) {
          menuId = 0;
        }
        menuItems = new Menus.MenuItemCollection;
        menuItems.url = "" + AJAXURL + "?action=get-menu-items";
        menuItems.fetch({
          reset: true,
          data: {
            menu_id: menuId
          }
        });
        return menuItems;
      }
    };
    App.reqres.setHandler("get:site:menus", function() {
      return API.getMenus();
    });
    return App.reqres.setHandler("get:menu:menuitems", function(menuId) {
      return API.getMenuItems(menuId);
    });
  });
  return App.Entities.Menus;
});
