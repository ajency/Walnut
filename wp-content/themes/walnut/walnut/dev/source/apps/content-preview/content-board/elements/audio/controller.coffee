define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/audio/views'
		],(App, Element)->
			App.module 'ContentPreview.ContentBoard.Element.Audio',
			(Audio, App, Backbone, Marionette, $, _)->

				# menu controller
				class Audio.Controller extends Element.Controller

					# intializer
					initialize: (options)->

						super(options)

					bindEvents: ->
						super()


					_getAudioView: ->
						new Audio.Views.AudioView
							model: @layout.model

					_getAudioCollection: ->
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
					renderElement: =>
						@_parseInt()

						if _.platform() is 'BROWSER'
							audioCollection = @_getAudioCollection()

							App.execute "when:fetched", audioCollection, =>

								@layout.model.set 'audioUrls' : _.first audioCollection.pluck 'url'
								@layout.model.set 'audioUrls' : audioCollection.pluck 'url'
								@view = @_getAudioView()

								@layout.elementRegion.show @view

						else @_getLocalAudioCollection()


					
					#Get the encrypted audio and decrypt it and play it from local path 
					_getLocalAudioCollection :=>

						runFunc = =>
							$.Deferred (d)=>

								localAudioPaths = []
								deferreds = []

								_.createAudioWebDirectory().done =>

									allAudioUrls = @layout.model.get('audioUrls')

									_.each allAudioUrls , (audioUrl , index)->

										do(audioUrl)->
											url = audioUrl.replace("media-web/","")
											audioWebPath = url.substr(url.indexOf("uploads/"))
											audiosPath = audioWebPath.replace("audio-web", "audios")
											encryptedAudioPath = "SynapseAssets/SynapseMedia/"+audiosPath
											decryptedAudioPath = "SynapseAssets/SynapseMedia/"+audioWebPath

											decryptFile = _.decryptLocalFile(encryptedAudioPath, decryptedAudioPath)
											deferreds.push decryptFile
									
									$.when(deferreds...).done (audioPaths...)=>
										_.each audioPaths , (localAudioPath , index)=>
											do(localAudioPath)=> 
												
												localPath = 'file:///mnt/sdcard/' + localAudioPath
												localAudioPaths.push localPath

										d.resolve @layout.model.set 'audioUrls', localAudioPaths

						$.when(runFunc()).done =>
							console.log('_getLocalAudioCollection done')
							@view = @_getAudioView()
							@layout.elementRegion.show @view

						.fail _.failureHandler


