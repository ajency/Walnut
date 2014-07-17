define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.Menus", (Menus, App, Backbone, Marionette, $, _)->

			# menu item model
			class Menus.MenuItemModel extends Backbone.Model

				idAttribute : 'id'

				defaults:
					post_title          : ''
					menu_item_link      : ''
					menu_item_parent    : 0
					order 				: 0
					submenu				: []

				name: 'menu-item'


			# menu item collection class
			class Menus.MenuItemCollection extends Backbone.Collection
				model : Menus.MenuItemModel
				comparator : 'order'
				name : 'menu-item'


			# API 
			API = 
				# get all site menus
				getMenus:(param = {})->
					menuCollection = new Menus.MenuItemCollection

					menuCollection.url = AJAXURL + '?action=get-menus'
					menuCollection.fetch
							reset : true
							data  : param

					menuCollection


			# request handler to get all site menus
			App.reqres.setHandler "get:site:menus", ->
				API.getMenus()


		App.Entities.Menus