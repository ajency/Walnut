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

				# get menus for walnut app
				getMenusFromLocal : ->

					data = [{"ID":91,"menu-order":1,"post_title":"Content Management","menu_item_link":"#"
						,"menu_id":null,"submenu":[{"ID":40,"menu-order":2,"post_title":"Textbooks"
						,"menu_item_link":"#textbooks","menu_id":null}]}
						,{"ID":92,"menu-order":4,"post_title":"Training Module","menu_item_link":"#"
						,"menu_id":null,"submenu":[{"ID":93,"menu-order":6,"post_title":"Teacher Training"
						,"menu_item_link":"#teachers/dashboard","menu_id":null}]}
						,{"ID":95,"menu-order":1,"post_title":"Data Synchronization","menu_item_link":"#"
						,"menu_id":null,"submenu":[{"ID":96,"menu-order":2,"post_title":"Sync"
						,"menu_item_link":"#sync","menu_id":null}]}]

					data	
					



			# request handler to get all site menus
			App.reqres.setHandler "get:site:menus", ->
				API.getMenus()

			# request handler to menus for walnut app
			App.reqres.setHandler "get:menu-item:local", ->
				API.getMenusFromLocal()	


		App.Entities.Menus