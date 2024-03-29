define ['app'
		'controllers/region-controller'
		'text!apps/media-manager/templates/outer.html'
		],(App, AppController, outerTpl)->
	App.module 'MediaManager', (MediaManager, App, Backbone, Marionette, $, _)->

		# defineall routers required for the app in MediaManager.Router class
		class MediaManager.Router extends Marionette.AppRouter
			appRoutes:
				'media-manager/:mediaType': 'show'


		# Define the initial controller for the media-manager. this controller will
		# be responsible for getting the initial layout, show the dialog in dialog region
		# also this controller will identify which all sub apps needs to be started
		class ShowController extends AppController

			# initialize
			initialize: (opt = {})->
				@choosedMedia = null
				{@mediaType} = opt

				@layout = layout = @_getLayout()
				@show @layout


				# start media manager apps. conditional strating of apps is possible
				# each app needs a region as the argument. Each app will be functional only
				# for that region

				@listenTo @layout, "show", =>
					App.execute "start:media:upload:app",
						region: layout.uploadRegion
						mediaType: @mediaType

					App.execute "start:media:grid:app",
						region: layout.gridRegion
						mediaType: @mediaType

					App.execute "start:youtube:video:app",
						region: layout.youtubeRegion
						mediaType: @mediaType

				@show @layout

				@listenTo @layout.gridRegion, "media:element:selected", (media)=>
					@choosedMedia = media
					# App.execute "show:edit:media",
					#   media,
					#   @layout.editMediaRegion

				@listenTo @layout.youtubeRegion, "youtube:url:selected", (url)=>
				
					data= 
						id		: 'youtube_'+_.random 855,1234
						title	: url
						name	: url
						url		: url
						type	: 'video'
						videoType: 'youtubeVideo'
				
					mediaModel = App.request "new:media:added", data
					App.vent.trigger "media:manager:choosed:media", mediaModel

				@listenTo @layout, "media:selected", =>
					if not _.isNull @choosedMedia
						App.vent.trigger "media:manager:choosed:media", @choosedMedia
						if @region
							@region.closeDialog()

			# App.getRegion('elementsBoxRegion').hide()

			onClose: ->
				# navigate back to original route. do not trigger the router
				# only navigate
	#                App.navigate ''
			# App.getRegion('elementsBoxRegion').unhide()

			# gets the main login view
			_getLayout: ()=>
				new OuterLayout
					mediaType: @mediaType


		# this is the outer layout for the media manager
		# this layout contians all the region for the manager.
		# define the region which can be later accessed with layout.{regionName} property
		# this is the main view for the dialog region. dialogOptions property is set to
		# set the modal title
		class OuterLayout extends Marionette.Layout

			template: outerTpl

			regions:
				uploadRegion: '#upload-region'
				gridRegion: '#grid-region'
				youtubeRegion: '#youtube-region'
				# editMediaRegion: '#edit-media-region'

			dialogOptions:
				modal_title: 'Media Manager'
				modal_size: 'wide-modal'

			events:
				'click button.media-manager-select': ->
					@trigger "media:selected"

			onShow:->
				if Marionette.getOption(@,'mediaType') in ['audio', 'video']
					@$el.find '.upload-tab'
					.hide()

				if Marionette.getOption(@, 'mediaType') in ['audio','image']
					@$el.find '.youtube-video'
					.hide()

			onClose: ->
				#stop listening to event
				App.vent.trigger "stop:listening:to:media:manager"


		#public API
		API =
			show: (mediaType)->
				new ShowController
					region: App.dialogRegion
					statApp: 'all-media'
					mediaType: mediaType

			editMedia: (model, region)->


		MediaManager.on "start", ->
			new MediaManager.Router
				controller: API

		# stop listetning to media manager stop
		MediaManager.on "stop", ->
			App.vent.off "media:element:clicked"


		App.commands.setHandler "show:media:manager:app", (options)->
			new ShowController options
