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



					_parseInt:->
						audio_ids = new Array()
						if not @layout.model.get('audio_ids') and @layout.model.get('audio_id')
							@layout.model.set 'audio_ids',[@layout.model.get('audio_id')]
							@layout.model.set 'audioUrls',[@layout.model.get('audioUrl')]

						_.each @layout.model.get('audio_ids'),(id)->
							audio_ids.push parseInt id

						@layout.model.set 'audio_ids',audio_ids
						
					#Get the encrypted audio and decrypt it and play it from local path 
					_getAudioLocalPath :=>

						runFunc = =>
							$.Deferred (d)=>

								localAudioPath = new Array()
								audioPath = new Array()
								localAudioPaths = []
								decryptFile = []
								deferreds = []
								audioPaths = []

								audiosWebDirectory = _.createAudiosWebDirectory()
								audiosWebDirectory.done =>
									allAudioUrls = @layout.model.get('audioUrls')

									_.each allAudioUrls , (allAudioPaths , index)->
										url = allAudioPaths.replace("media-web/","")

										audiosWebUrl = url.substr(url.indexOf("uploads/"))

										audioPaths = audiosWebUrl.replace("audio-web", "audios")

										encryptedAudioPath = "SynapseAssets/SynapseMedia/"+audioPaths
										decryptedAudioPath = "SynapseAssets/SynapseMedia/"+audiosWebUrl

										decryptFile = _.decryptVideoFile_N(encryptedAudioPath, decryptedAudioPath)
										deferreds.push decryptFile
									
									$.when(deferreds...).done (audioPaths...)=>
										_.each audioPaths , (localAudioPath , index)=>
											do(localAudioPath, index)=>

												audioPath = 'file:///storage/emulated/0/' + localAudioPath

												localAudioPaths.push audioPath

										d.resolve @layout.model.set 'audioUrls',localAudioPaths

						$.when(runFunc()).done =>
							@layout.elementRegion.show @view
						.fail _.failureHandler



					# setup templates for the element
					renderElement: =>
						@_parseInt()

						@view = @_getAudioView()
						if _.platform() is 'DEVICE'
							@_getAudioLocalPath()

						
