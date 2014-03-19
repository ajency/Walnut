define ['app'],(App)->

	App.module "LeftNavApp.Controller.Views",(Views, App)->

		class MenuItemView extends Marionette.ItemView

			tagName : 'li'

			template : '<a href="{{menu_item_link}}"><span class="title">{{post_title}}</span></a>'


		class Views.LeftNavView extends Marionette.CompositeView

			template 	: '<div id="main-menu-wrapper" class="page-sidebar-wrapper"><p class="menu-title">SCHOOL 1<span class="pull-right"><a href="javascript:;"><i class="fa fa-refresh"></i></a></span></p>
							<ul class="menu"></ul></div>'
			
			id 			: 'main-menu' 

			className	: 'page-sidebar'

			itemView 	: MenuItemView

			itemViewContainer : '> .page-sidebar-wrapper > ul.menu'

