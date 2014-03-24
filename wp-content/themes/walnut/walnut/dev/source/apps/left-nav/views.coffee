define ['app','text!apps/left-nav/templates/leftnav.html'],(App,navTpl)->

	App.module "LeftNavApp.Controller.Views",(Views, App)->

		class MenuItemView extends Marionette.ItemView

			tagName : 'li'

			template : '<a href="{{menu_item_link}}"><span>{{post_title}}</span></a>'


		class Views.LeftNavView extends Marionette.CompositeView

			template 	: navTpl
			
			id 			: 'main-menu' 

			className	: 'page-sidebar'

			itemView 	: MenuItemView

			itemViewContainer : 'ul.sub-menu'

