define ['app'
		'controllers/region-controller'
		'text!apps/media-manager/templates/outer.html'], (App, AppController, outerTpl)->

			App.module 'MediaManager', (MediaManager, App, Backbone, Marionette, $, _)->

				# defineall routers required for the app in MediaManager.Router class
				class MediaManager.Router extends Marionette.AppRouter
					appRoutes :
						'media-manager' 				: 'show'
						

				# Define the initial controller for the media-manager. this controller will 
				# be responsible for getting the initial layout, show the dialog in dialog region
				# also this controller will identify which all sub apps needs to be started
				class ShowController extends AppController

					# initialize
					initialize:(opt = {})->

						@choosedMedia = null
					
						@layout = layout = @_getLayout()
						@show @layout

						
						# start media manager apps. conditional strating of apps is possible
						# each app needs a region as the argument. Each app will be functional only
						# for that region
						App.execute "start:media:upload:app", region : layout.uploadRegion
						App.execute "start:media:grid:app", region : layout.gridRegion 
						
						
						@listenTo @layout.gridRegion, "media:element:selected",(media)=>
																	@choosedMedia = media
																	App.execute "show:edit:media", 
																					media, 
																					@layout.editMediaRegion


						@listenTo @layout ,"media:selected", =>
											if not _.isNull @choosedMedia
												App.vent.trigger "media:manager:choosed:media", @choosedMedia
												@region.closeDialog()

						# App.getRegion('elementsBoxRegion').hide()
						
					onClose: ->
						# navigate back to original route. do not trigger the router 
						# only navigate
						App.navigate ''
						# App.getRegion('elementsBoxRegion').unhide()

					# gets the main login view
					_getLayout :()->
						new OuterLayout
								

				# this is the outer layout for the media manager
				# this layout contians all the region for the manager. 
				# define the region which can be later accessed with layout.{regionName} property
				# this is the main view for the dialog region. dialogOptions property is set to 
				# set the modal title
				class OuterLayout extends Marionette.Layout

					template: outerTpl

					regions : 
						uploadRegion 	: '#upload-region'
						gridRegion		: '#grid-region'
						editMediaRegion : '#edit-media-region'

					dialogOptions : 
						modal_title : 'Media Manager'
						modal_size  : 'wide-modal'

					events: 
						'click button.media-manager-select' : ->
												@trigger "media:selected"

				
				#public API
				API = 
					show:()->
						new ShowController
									region 	: App.dialogRegion
									statApp : 'all-media'

					editMedia:(model, region)->
						


				MediaManager.on "start", ->
					new MediaManager.Router
								controller : API	

				# stop listetning to media manager stop
				MediaManager.on "stop", ->
					App.vent.off "media:element:clicked"