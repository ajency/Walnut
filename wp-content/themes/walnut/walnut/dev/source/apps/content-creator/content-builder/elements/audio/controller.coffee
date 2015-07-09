define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/audio/views'
], (App, Element)->
	App.module 'ContentCreator.ContentBuilder.Element.Audio',
	(Audio, App, Backbone, Marionette, $, _)->

		# menu controller
		class Audio.Controller extends Element.Controller

			# intializer
			initialize : (options)->
				_.defaults options.modelData,
					element : 'Audio'
					audio_id : 0
					audio_ids : []
					height : 0
					width : 0
					audioUrl : ''
					audioUrls : []
					title : [] #'http://www.jplayer.org/audio/ogg/Miaow-04-Lismore.ogg'


				super(options)

			bindEvents : ->
				super()


			_getAudioView : ->
				new Audio.Views.AudioView
					model: @layout.model

			_getAudioCollection : ->
				if not @audioCollection

					if @layout.model.get('audio_ids').length
						@audioCollection = App.request "get:media:collection:by:ids", @layout.model.get 'audio_ids'
					else
						@audioCollection = App.request "get:empty:media:collection"

				@audioCollection.comparator = 'order'


				@audioCollection

			_parseInt:->
				audio_ids = new Array()
				if not @layout.model.get('audio_ids') and @layout.model.get('audio_id')
					@layout.model.set 'audio_ids',[@layout.model.get('audio_id')]
					@layout.model.set 'audioUrls',[@layout.model.get('audioUrl')]

				_.each @layout.model.get('audio_ids'),(id)->
					audio_ids.push parseInt id

				@layout.model.set 'audio_ids',audio_ids



			# setup templates for the element
			renderElement : =>
				@removeSpinner()
				@_parseInt()

				audioCollection = @_getAudioCollection()


				App.execute "when:fetched", audioCollection, =>
					@view = @_getAudioView()

					#trigger media manager popup and start listening to "media:manager:choosed:media" event
					@listenTo @view, "show:media:manager", =>

						App.execute "show:media:collection:manager",
							region: App.dialogRegion
							mediaType: 'audio'
							mediaCollection : audioCollection

					@listenTo @audioCollection, 'add remove order:updated',->
						@audioCollection.sort()
						@layout.model.set
							'audio_ids': @audioCollection.pluck 'id'
							'audioUrls' : @audioCollection.pluck 'url'
							'title' : @audioCollection.pluck 'title'
							'audio_id' : _.first @audioCollection.pluck 'id'
							'audioUrl' : _.first @audioCollection.pluck 'url'
						@layout.elementRegion.show @view
						@layout.model.save()

					@listenTo @view, "show show:audio:properties", =>
						App.execute "show:question:properties",
						model : @layout.model

					@layout.elementRegion.show @view
