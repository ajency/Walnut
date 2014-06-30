define ['app'], (App)->

	# Row views
	App.module 'ContentPreview.ContentBoard.Element.Video.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.VideoView extends Marionette.ItemView

			className : 'video'

			template : '
							<video class="video-js vjs-default-skin" 
								poster="http://www.eyespot.com/2013/wp-content/uploads/2013/04/video-clip.jpg" 
								width="100%" data-setup="{}" controls></video>
							
							<div class="clearfix"></div>
						'


			events :
				'click' : (e)->
					e.stopPropagation()
			# @trigger "show:media:manager"

			
			# check if a valid image_id is set for the element
			# if present ignore else run the Holder.js to show a placeholder
			# after run remove the data-src attribute of the image to avoid
			# reloading placeholder image again
			onShow : ->
				console.log @model

				# generate unique id and give to video element
				videoId = _.uniqueId('video_')
				@$el.find('video').attr 'id', videoId
				# init videojs
				# @videoElement = videojs @$el.find('video').attr('id')


				# set height according to the asp ect ratio of 16:9
				# width = @videoElement.width()
				# height = 9 * width / 16
				# @videoElement.height height

				if _.platform() is 'DEVICE'

					url = @model.get('videoUrl').replace("media-web/","")
					videosWebUrl = url.substr(url.indexOf("uploads/"))

					videoUrl = videosWebUrl.replace("videos-web", "videos")
					encryptedVideoPath = "SynapseAssets/SynapseMedia/"+videoUrl
					
					decryptedVideoPath = "SynapseAssets/SynapseMedia/"+videosWebUrl

					videosWebDirectory = _.createVideosWebDirectory()
					videosWebDirectory.done ->

						decryptFile = _.decryptVideoFile(encryptedVideoPath, decryptedVideoPath)
						decryptFile.done (videoPath)->
							
							#'videos' is initialized globally inside 'plugins/walnut-app.js'
							`videos[videoId] = videoPath;`

							window.plugins.html5Video.initialize videos
							window.plugins.html5Video.play videoId