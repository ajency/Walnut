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

			events :
				'click #app_logout': 'appUserLogout'

			serializeData : ->
				data = super()
				data.logourl= SITEURL+ '/wp-content/themes/walnut/images/walnutlearn.png'
				data.logourl= SITEURL+ '/images/logo-synapse.png' if _.platform() is 'DEVICE'
				console.log SITEURL
				data
				
			onShow:->
				# || ($('.teacher-app').length>0)
				if (($('.creator').length > 0)) 
					$('.page-content').addClass('condensed');
					$(".header-seperation").css("display","none");

				# changes for mobile
				if _.platform() is 'DEVICE'

					$('.right-menu').sidr({       
						name : 'walnutProfile',
						side: 'right',
						renaming: false
					}) 

					#display name of logged in user
					@$el.find('#app_username').text('Hi '+_.getUserName()+',')

			
			appUserLogout : ->
				console.log 'appUserLogout'

				_.setUserID(null)

				$.sidr('close', 'walnutProfile')

				user = App.request "get:user:model"
				user.clear()

				App.leftNavRegion.close()
				App.headerRegion.close()
				App.mainContentRegion.close()
				App.breadcrumbRegion.close()

				App.navigate('app-login', trigger: true)

				removeBackButtonEvent = ->
					console.log 'removeBackButtonEvent'
					document.removeEventListener("backbutton", removeBackButtonEvent, false)

				
				document.addEventListener("backbutton"
					,->
						if App.getCurrentRoute() is 'app-login'
							navigator.app.exitApp()
						else 
							if App.getCurrentRoute() is 'teachers/dashboard'
								console.log 'Remove event'
								removeBackButtonEvent()
							else	
								App.navigate('app-login', trigger: true)
					, false)
						



		# set handlers
		App.commands.setHandler "show:headerapp", (opt = {})->
			new Controller.HeaderController opt		

