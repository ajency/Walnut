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

				name: 'menu-item'

					

			# menu item collection class
			class Menus.MenuItemCollection extends Backbone.Collection
				model : Menus.MenuItemModel
				comparator : 'order'

			
			# menu collection
			class Menus.MenuCollection extends Backbone.Collection
				model : Menus.MenuModel

				getSiteMenus:()->
					@map (model)->
						menu_id : model.get 'id'
						menu_name : model.get 'menu_name'

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

				# get all menu items for the passed menu
				# menuId = 0 if no menu is passed
				getMenuItems: (menuId = 0)->

					menuItems = new Menus.MenuItemCollection

					menuItems.url = "#{AJAXURL}?action=get-menu-items"

					menuItems.fetch
								reset : true
								data  : 
									menu_id : menuId

					menuItems	

			# request handler to get all site menus
			App.reqres.setHandler "get:site:menus", ->
				API.getMenus()

			# request handler to get all site menus
			App.reqres.setHandler "get:menu:menuitems",(menuId)->
				API.getMenuItems(menuId)

		App.Entities.Menus