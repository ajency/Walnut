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
						
					_getAudioLocalPath :->
						localAudioPath = new Array()
						decryptFile = []
						deferreds = []
						audioPaths = []
						audiosWebDirectory = _.createAudiosWebDirectory()
						audiosWebDirectory.done =>
							allAudioUrls = @layout.model.get('audioUrls')
							_.each allAudioUrls , (allAudioPaths , index)=>
								do(allAudioPaths, index)=>
									url = allAudioPaths.replace("media-web/","")

									audiosWebUrl = url.substr(url.indexOf("uploads/"))
									console.log audiosWebUrl
									audioPaths = audiosWebUrl.replace("audio-web", "audios")
									console.log audioPaths

									encryptedAudioPath = "SynapseAssets/SynapseMedia/"+audioPaths
									decryptedAudioPath = "SynapseAssets/SynapseMedia/"+audiosWebUrl

									decryptFile = _.decryptVideoFile(encryptedAudioPath, decryptedAudioPath)
									deferreds.push decryptFile

								console.log JSON.stringify deferreds
								$.when(deferreds...).done(audioPaths...) =>
									console.log audioPaths
									console.log JSON.stringify audioPaths
									localAudioPath[index] = 'file:///mnt/sdcard/'+audioPaths
									console.log localAudioPath[index]
									localAudioPaths.push localAudioPath
									@layout.model.set 'audioUrls',localAudioPaths

					# setup templates for the element
					renderElement: =>
						@_parseInt()

						@view = @_getAudioView()
						@_getAudioLocalPath()

						@layout.elementRegion.show @view
