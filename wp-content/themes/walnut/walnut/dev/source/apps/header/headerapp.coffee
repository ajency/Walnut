define ['app'
		'controllers/region-controller'
		'apps/header/left/leftapp'
		'apps/header/right/rightapp'
		'text!apps/header/templates/header.html'], (App, RegionController, LeftApp, RightApp,  headerTpl)->

	App.module "HeaderApp.Controller", (Controller, App)->

		class Controller.HeaderController extends RegionController

			initialize : ->
				
				@layout = layout = @_getHeaderView()

				@school = App.request "get:current:school"

				console.log '@school1'
				console.log @school
				@listenTo layout, 'show', @showLeftRightViews
				@show layout, (loading:true)

			showLeftRightViews:=>
				App.execute "show:leftheaderapp", region : @layout.leftRegion
				App.execute "show:rightheaderapp", region : @layout.rightRegion


			_getHeaderView : =>
				console.log '@school2'
				console.log @school
				new HeaderView
					model: @school


		class HeaderView extends Marionette.Layout

			template 	: headerTpl

			className 	: 'header navbar navbar-inverse'

			regions:
				leftRegion	: '#header-left'
				rightRegion	: '#header-right'

			serializeData : ->
				data = super()
				data.logourl= SITEURL+ '/wp-content/themes/walnut/images/walnutlearn.png'
				console.log SITEURL
				data
				
			onShow:->						
				if ($('.creator').length > 0) 
					$(".header-seperation").css("display","none");
					$("#main-menu").addClass("mini");
					$("#main-content-region").addClass("condensed");
					$(".start").removeClass("active open");
					$(".arrow").removeClass("open");

		# set handlers
		App.commands.setHandler "show:headerapp", (opt = {})->
			new Controller.HeaderController opt		

