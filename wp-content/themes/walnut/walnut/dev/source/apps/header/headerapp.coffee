define ['app'
		'controllers/region-controller'
		'apps/header/left/leftapp'
		'apps/header/right/rightapp'
		'text!apps/header/templates/header.html'], (App, RegionController, LeftApp, RightApp, headerTpl)->
	App.module "HeaderApp.Controller", (Controller, App)->
		class Controller.HeaderController extends RegionController

			initialize: ->
				@layout = layout = @_getHeaderView()

				@school = App.request "get:current:school"

				@listenTo layout, 'show', @_showLeftRightViews

				@show layout

				@listenTo @layout.rightRegion, "user:logout", @_logoutCurrentUser

				@listenTo layout, 'user:logout', @_logoutCurrentUser

			_logoutCurrentUser:->
				$.post AJAXURL + '?action=logout_user',
				(response) =>
					if response.error
						console.log response
					else
						usermodel = App.request "get:user:model"
						usermodel.clear()
						App.vent.trigger "show:login"

			_showLeftRightViews: =>
				App.execute "show:leftheaderapp", region: @layout.leftRegion
				App.execute "show:rightheaderapp", region: @layout.rightRegion


			_getHeaderView: =>
				new HeaderView
					model: @school
					templateHelpers:
						show_user_name:->
							user_model= App.request "get:user:model"
							user_name= user_model.get 'display_name'


		class HeaderView extends Marionette.Layout

			template: headerTpl

			className: 'header navbar navbar-inverse'

			regions:
				leftRegion: '#header-left'
				rightRegion: '#header-right'

			events:
				'click #logout'   :->
					# $.sidr 'close', 'walnutProfile'
					@trigger "user:logout"

				'click #user_logout' : 'onAppLogout'
				'click .dropdown-menu > li > a' :(e)-> e.stopPropagation();
				'click #user-options' : 'showAudioCuesToggleValue'
				'click #onOffSwitchToggle' : 'onToggle'

			serializeData: ->
				data = super()
				data.logourl = SITEURL + '/wp-content/themes/walnut/images/synapse_logo.png'
				data.logourl = SITEURL + './images/synapse_logo.png' if _.platform() is 'DEVICE'
				data

			onShow: ->
				if $( window ).width()>1024
					$( "#gears-mob" ).remove()

				if $( window ).width()<1025
					$( "#gears-pc" ).remove()
					# $('#walnutProfile').mmenu
					#     position: 'right'
					#     zposition: 'front'
				@$el.find "#mobile-menu-toggle-wrapper"
				.show()

				# @$el.find('.right-menu').sidr
				#     name : 'walnutProfile'
				#     side: 'right'
				#     renaming: false

				# || ($('.teacher-app').length>0)
				if (($('.creator').length > 0))
					$('.page-content').addClass('condensed');
					$(".header-seperation").css("display", "none");

				#Changes for mobile
				# if _.platform() is 'DEVICE'
				#      #display name of logged in user
				#     @$el.find('#app_username').text('Hi '+_.getUserName()+',')

				if _.platform() is 'DEVICE'
					lastSyncOperation = _.getLastSyncOperation()
					lastSyncOperation.done (typeOfOperation)->

						if typeOfOperation is 'file_import'
							$('#main-menu-toggle').css('display','block')
						else
							$('#main-menu-toggle').css('display','none')
							

			
			onAppLogout : ->

				console.log 'Synapse App Logout'

				_.removeCordovaBackbuttonEventListener()
				
				_.setUserID(null)

				user = App.request "get:user:model"
				user.clear()

				App.leftNavRegion.close()
				App.headerRegion.close()
				App.mainContentRegion.close()
				App.breadcrumbRegion.close()

				App.navigate('app-login', trigger: true)

			showAudioCuesToggleValue : ->	
				_.setAudioCuesToggle()


			onToggle : ->
				if $('#onOffSwitchToggle').prop "checked"
					_.setAudioCues 'true'
				else
					_.setAudioCues 'false'




		# set handlers
		App.commands.setHandler "show:headerapp", (opt = {})->
			new Controller.HeaderController opt