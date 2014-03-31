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


			events: 
				'click li'	: 'clickMenu'

			onShow:->
				#Auto close open menus in Condensed menu
				if($('.page-sidebar').hasClass('mini'))		
					elem = $('.page-sidebar ul');
					elem.children('li.open').children('a').children('.arrow').removeClass('open');
					elem.children('li.open').children('a').children('.arrow').removeClass('active');
					elem.children('li.open').children('.sub-menu').slideUp(200);
					elem.children('li').removeClass('open');
			
			clickMenu:(e)->
				li_target=$(e.target).closest('li').find('a');
				if (li_target.next().hasClass('sub-menu') == false) 
					return; 
				parent = li_target.parent().parent();
				parent.children('li.open').children('a').children('.arrow').removeClass('open');
				parent.children('li.open').children('a').children('.arrow').removeClass('active');
				parent.children('li.open').children('.sub-menu').slideUp(200);
				parent.children('li').removeClass('open');
				#parent.children('li').removeClass('active');
				
				sub = li_target.next();
				if (sub.is(":visible"))
					$('.arrow', li_target).removeClass("open");
					li_target.parent().removeClass("active");
					sub.slideUp 200, () -> handleSidenarAndContentHeight();
				else
					$('.arrow', li_target).addClass("open");
					li_target.parent().addClass("open");
					sub.slideDown 200, ()-> handleSidenarAndContentHeight();

				e.preventDefault();

			handleSidenarAndContentHeight =  ()-> 
				content = $('.page-content');
				sidebar = $('.page-sidebar');
				if (!content.attr("data-height"))
					content.attr("data-height", content.height());
				
				if (sidebar.height() > content.height()) 
					content.css("min-height", sidebar.height() + 120);
				else
					content.css("min-height", content.attr("data-height"));
				


