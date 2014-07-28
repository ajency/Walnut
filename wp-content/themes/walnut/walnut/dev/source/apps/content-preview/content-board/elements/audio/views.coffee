define ['app'], (App)->

	# Row views
	App.module 'ContentPreview.ContentBoard.Element.Audio.Views',
	(Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.AudioView extends Marionette.ItemView

			className: 'audio'

			template: '{{#audio}}
						<audio title="{{title}}" class="audio1" controls>
							<source src="{{audioUrl}}" type="audio/mpeg">
							Your browser does not support the audio element.
						</audio>
						{{/audio}}'



			# override serializeData to set holder property for the view
			mixinTemplateHelpers: (data)->
				data = super data

				if @model.get('audio_ids').length
					#if _.platform() is 'DEVICE' then the source of audio is taken from the localpath of device
					localAudioPath = new Array()
					localAudioPaths = []
					audiosWebDirectory = _.createAudiosWebDirectory()
					audiosWebDirectory.done =>

						allAudioUrls = @model.get('audioUrls')

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
								decryptFile.done (audioPath)=>
									console.log audioPath
									localAudioPath[index] = 'file:///mnt/sdcard/'+audioPath
									console.log localAudioPath[index]
									localAudioPaths.push localAudioPath
								console.log localAudioPaths

#                    arrayz = ['http://html.cerchez.com/rockstar/tmp/preview1.mp3',
#                              'http://html.cerchez.com/rockstar/tmp/preview2.mp3']
#                    @model.set('audioUrls', arrayz)
				
					console.log localAudioPaths
					arrays = _.zip @model.get('title'), localAudioPaths
					audioArray = new Array()
					_.each arrays, (array)->
						audioArray.push _.object ['title', 'audioUrl'], array
					data.audio = audioArray

				data



			onShow: ->
				@$el.find('audio').panzerlist
					theme: 'light'
					layout: 'big'
					expanded: true
					showduration: true
					show_prev_next : true



				# Code for mobile app
				# if _.platform() is 'DEVICE'

				# 	videosWebDirectory = _.createVideosWebDirectory()
				# 	videosWebDirectory.done =>

				# 		allAudioUrls = @model.get('audioUrls')
				# 		console.log allAudioUrls
				# 		_.each allAudioUrls , (allAudioPaths , index)=>
				# 			do(allAudioPaths, index)=>
				# 				url = allAudioPaths.replace("media-web/","")

				# 				audiosWebUrl = url.substr(url.indexOf("uploads/"))
				# 				audioPaths = audiosWebUrl.replace("audio-web", "audios")

				# 				encryptedAudioPath = "SynapseAssets/SynapseMedia/"+audioPaths
				# 				decryptedAudioPath = "SynapseAssets/SynapseMedia/"+audiosWebUrl

				# 				decryptFile = _.decryptVideoFile(encryptedAudioPath, decryptedAudioPath)
				# 				decryptFile.done (audioPath)=>
				# 					console.log audioPath




#






