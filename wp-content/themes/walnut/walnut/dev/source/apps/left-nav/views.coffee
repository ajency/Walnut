define ['app', 'text!apps/left-nav/templates/leftnav.html'], (App, navTpl)->
	App.module "LeftNavApp.Controller.Views", (Views, App)->
		class MenuItemView extends Marionette.ItemView

			tagName: 'li'

			template: '<a href="javascript:;">
								<i class="{{iconClass}}"></i>
								<span class="title">{{post_title}}</span>
								<span class="arrow"></span>
							</a>
							<ul class="sub-menu">
								{{#submenu}}
								<li><a href="{{menu_item_link}}">{{post_title}}</a></li>
								{{/submenu}}
							</ul>'

			serializeData: ->
				data = super()

				iconClass = 'icon-custom-ui'

				if @model.get('post_title') is 'Training Module'
					iconClass = 'fa fa-pencil-square-o'

				if @model.get('post_title') is 'Content Management'
					iconClass = 'fa fa-book'

				data.iconClass = iconClass

				data

		class Views.LeftNavView extends Marionette.CompositeView

			template: navTpl

			id: 'main-menu'

			className: 'page-sidebar'

			itemView: MenuItemView

			itemViewContainer: 'ul.menu-items'


			events:
				'click li': 'clickMenu'

			onShow: ->

				#Auto close open menus in Condensed menu
				#|| ($('.teacher-app').length>0)
				if (($('.creator').length > 0) )
					$("#main-menu").addClass("mini");
					$(".start").removeClass("active open");
					$(".arrow").removeClass("open");
					$('.page-content').addClass('condensed');
					$('.header-seperation').hide();
				else
					$('.page-content').removeClass('condensed');

				if($('.page-sidebar').hasClass('mini'))
					elem = $('.page-sidebar ul');
					elem.children('li.open').children('a').children('.arrow').removeClass('open');
					elem.children('li.open').children('a').children('.arrow').removeClass('active');
					elem.children('li.open').children('.sub-menu').slideUp(200);
					elem.children('li').removeClass('open');

				if $( window ).width()<1025
					$('#main-menu').mmenu
						position: 'left'
					
					$("#main-menu").find(".mm-subopen").addClass("mm-fullsubopen ")




			clickMenu: (e)->
				li_target = $(e.target).closest('li').find('a');
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
					sub.slideUp 200, () ->
						handleSidenarAndContentHeight();
				else
					$('.arrow', li_target).addClass("open");
					li_target.parent().addClass("open");
					sub.slideDown 200, ()->
						handleSidenarAndContentHeight();

				e.preventDefault();

			handleSidenarAndContentHeight = ()->
				content = $('.page-content');
				sidebar = $('.page-sidebar');
				if (!content.attr("data-height"))
					content.attr("data-height", content.height());

				if (sidebar.height() > content.height())
					content.css("min-height", sidebar.height() + 120);
				else
					content.css("min-height", content.attr("data-height"));
				


