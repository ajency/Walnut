var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  App.module("Entities.Menus", function(Menus, App, Backbone, Marionette, $, _) {
    var API;
    Menus.MenuItemModel = (function(_super) {
      __extends(MenuItemModel, _super);

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
    Menus.MenuItemCollection = (function(_super) {
      __extends(MenuItemCollection, _super);

      function MenuItemCollection() {
        return MenuItemCollection.__super__.constructor.apply(this, arguments);
      }

      MenuItemCollection.prototype.model = Menus.MenuItemModel;

      MenuItemCollection.prototype.comparator = 'order';

      MenuItemCollection.prototype.name = 'menu-item';

      return MenuItemCollection;

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
      getMenusFromLocal: function() {
        var data;
        data = [
          {
            "ID": 91,
            "menu-order": 1,
            "post_title": "Content Management",
            "menu_item_link": "#",
            "menu_id": null,
            "submenu": [
              {
                "ID": 40,
                "menu-order": 2,
                "post_title": "Textbooks",
                "menu_item_link": "#textbooks",
                "menu_id": null
              }
            ]
          }, {
            "ID": 92,
            "menu-order": 4,
            "post_title": "Training Module",
            "menu_item_link": "#",
            "menu_id": null,
            "submenu": [
              {
                "ID": 93,
                "menu-order": 6,
                "post_title": "Teacher Training",
                "menu_item_link": "#teachers/dashboard",
                "menu_id": null
              }
            ]
          }, {
            "ID": 95,
            "menu-order": 1,
            "post_title": "Data Synchronization",
            "menu_item_link": "#",
            "menu_id": null,
            "submenu": [
              {
                "ID": 96,
                "menu-order": 2,
                "post_title": "Sync",
                "menu_item_link": "#sync1",
                "menu_id": null
              }
            ]
          }
        ];
        return data;
      }
    };
    App.reqres.setHandler("get:site:menus", function() {
      return API.getMenus();
    });
    return App.reqres.setHandler("get:menu-item:local", function() {
      return API.getMenusFromLocal();
    });
  });
  return App.Entities.Menus;
});
