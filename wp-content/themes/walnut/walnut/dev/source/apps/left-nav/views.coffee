define ['app'],(App)->

	App.module "LeftNavApp.Controller.Views",(Views, App)->

		class MenuItemView extends Marionette.ItemView

			tagName : 'li'

			template : 'menu item {{post_title}} '


		class Views.LeftNavView extends Marionette.CompositeView

			template 	: ' <p class="menu-title">SCHOOL 1<span class="pull-right"><a href="javascript:;"><i class="fa fa-refresh"></i></a></span></p>
							<ul class="menu"></ul>'
			
			id 			: 'main-menu-wrapper' 

			className	: 'page-sidebar-wrapper'

			itemView 	: MenuItemView

			itemViewContainer : '> ul.menu'

