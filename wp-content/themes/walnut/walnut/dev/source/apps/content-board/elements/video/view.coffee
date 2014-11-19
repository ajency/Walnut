define ['app'
		'bootbox'], (App,bootbox)->

	# Row views
	App.module 'ContentPreview.ContentBoard.Element.Video.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.VideoView extends Marionette.ItemView

			className : 'video'

			template : '    {{#videoUrl}}
								<video  class="video-js vjs-default-skin" controls preload="none" width="100%"
								poster="/images/video-poster.jpg" data-setup="{}">

								</video>
							{{/videoUrl}}
							{{^videoUrl}}
								<video  class="video-js vjs-default-skin" controls preload="none" width="100%"
								poster="/images/video-unavailable.png" data-setup="{}">

								</video>
							{{/videoUrl}}

							<div class="clearfix"></div>
										'




			events :
				'click .show-playlist' : 'togglePlaylist'
				'click #prev' : '_playPrevVideo'
				'click #next' : '_playNextVideo'
				'click .playlist-video' : '_playClickedVideo'

			# check if a valid image_id is set for the element
			# if present ignore else run the Holder.js to show a placeholder
			# after run remove the data-src attribute of the image to avoid
			# reloading placeholder image again
			onShow : ->

				return if not @model.get('video_ids').length

				@videos = @model.get('videoUrls')
				@index = 0

				@$el.find('video').on 'ended', =>
					@_playNextVideo()

				@_setVideoList() if _.size(@videos) > 1
				@$el.find(".playlist-video[data-index='0']").addClass 'currentVid'

				@$el.find('video')[0].src = @videos[0]

				widthRatio = 16
				heightRatio = 9
				setHeight = (@$el.find('video').width() * heightRatio) / widthRatio
				@$el.find('video').attr 'height', setHeight

				# if _.platform() is 'DEVICE' then @_initLocalVideos()

			# _initLocalVideos : ->

			# 	navigator.notification.activityStart("Please wait", "loading content...")

			# 	widthRatio = 16
			# 	heightRatio = 9
			# 	setHeight = (@$el.find('video').width() * heightRatio) / widthRatio
			# 	@$el.find('video').attr 'height', setHeight

			# 	runFunc = =>
			# 		$.Deferred (d)=>
			# 			deferreds = []

			# 			_.createVideosWebDirectory().done =>

			# 				_.each @videos , (videoSource, index)=>
			# 					do(videoSource)=>
									
			# 						url = videoSource.replace("media-web/","")
			# 						videosWebUrl = url.substr(url.indexOf("uploads/"))
			# 						videoUrl = videosWebUrl.replace("videos-web", "videos")
			# 						encryptedPath = "SynapseAssets/SynapseMedia/"+videoUrl
			# 						decryptedPath = "SynapseAssets/SynapseMedia/"+videosWebUrl
									
			# 						value = _.getStorageOption()
			# 						option = JSON.parse(value)

			# 						encryptedVideoPath = '' 
			# 						decryptedVideoPath = ''

			# 						if option.internal
			# 							encryptedVideoPath = option.internal+'/'+encryptedPath
			# 							decryptedVideoPath = option.internal+'/'+decryptedPath
			# 						else if option.external
			# 							encryptedVideoPath = option.external+'/'+encryptedPath
			# 							decryptedVideoPath = option.external+'/'+decryptedPath


			# 						decryptFile = _.decryptLocalFile(encryptedVideoPath, decryptedVideoPath)
			# 						deferreds.push decryptFile
							
			# 				$.when(deferreds...).done (videoPaths...)=>
								
								

			# 					_.each videoPaths , (localVideoPath , index)=>
			# 						do(localVideoPath, index)=>
										

			# 							# localVideoFullPath = filepath+'/'+localVideoPath
			# 							# @videos[index] = 'file:///mnt/sdcard/'+localVideoPath
										
			# 							@videos[index] = 'file://'+localVideoPath

			# 					d.resolve @videos

			# 	$.when(runFunc()).done =>
			# 		console.log('_initLocalVideos done')
			# 		navigator.notification.activityStop()
			# 		@$el.find('video')[0].src = @videos[0]
			# 		@$el.find('video')[0].load()

			# 	.fail _.failureHandler



			# _initLocalVideos : ->

			# 	# navigator.notification.activityStart("Please wait", "loading content...")
			# 	# deferreds = []
			# 	widthRatio = 16
			# 	heightRatio = 9
			# 	setHeight = (@$el.find('video').width() * heightRatio) / widthRatio
			# 	@$el.find('video').attr 'height', setHeight

			# 	_.createVideosWebDirectory().done =>
			# 		navigator.notification.activityStart("Please wait", "loading content...")
					
			# 		forEach = (videoSource, index)=>
						
			# 			url = videoSource.replace("media-web/","")
			# 			videosWebUrl = url.substr(url.indexOf("uploads/"))
			# 			videoUrl = videosWebUrl.replace("videos-web", "videos")
			# 			encryptedPath = "SynapseAssets/SynapseMedia/"+videoUrl
			# 			decryptedPath = "SynapseAssets/SynapseMedia/"+videosWebUrl
						
			# 			value = _.getStorageOption()
			# 			option = JSON.parse(value)

			# 			encryptedVideoPath = '' 
			# 			decryptedVideoPath = ''

			# 			if option.internal
			# 				encryptedVideoPath = option.internal+'/'+encryptedPath
			# 				decryptedVideoPath = option.internal+'/'+decryptedPath
			# 			else if option.external
			# 				encryptedVideoPath = option.external+'/'+encryptedPath
			# 				decryptedVideoPath = option.external+'/'+decryptedPath

						
			# 			@deferreds = _.decryptLocalFile(encryptedVideoPath, decryptedVideoPath)
			# 			@deferreds.done (localVideoPath)=>
							
			# 				index = index + 1
			# 				if index < _.size(@videos)
			# 					@videos[index - 1] = 'file://'+localVideoPath
			# 					forEach @videos[index], index
								
			# 				else
			# 					console.log('_initLocalVideos done')
			# 					navigator.notification.activityStop()
			# 					@videos[index - 1] = 'file://'+localVideoPath
			# 					@$el.find('video')[0].src = @videos[0]
			# 					@$el.find('video')[0].load()

			# 		forEach @videos[0], 0

			# _initLocalVideos : ->


			_setVideoList : ->
				console.log '@model'
				console.log @model
				@$el.append('<div id="playlist-hover" class="playlistHover">
								<div class="row m-l-0 m-r-0 p-b-5 m-b-5">
									<div class="col-sm-8 nowPlaying">
									<span class="small text-muted">Now Playing:</span>
									<span id="now-playing-tag">'+@model.get('title')[0]+'</span>
								</div>
								<div class="col-sm-4">
									<button class="btn btn-white btn-small pull-right show-playlist">
										<i class="fa fa-list-ul"></i> Playlist
									</button>
								</div>
								</div>
								<div class="row m-l-0 m-r-0 playlist-hidden vidList animated fadeInRight" style="display: none;">
									<div class="video-list col-sm-8" id="video-list"></div>
									<div class="col-sm-4 p-t-5 m-b-5">
										<button class="btn btn-info btn-small pull-right" id="next">
											<i class="fa fa-step-forward"></i>
										</button>
										<button class="btn btn-info btn-small pull-right m-r-10" id="prev">
											<i class="fa fa-step-backward"></i>
										</button>
									</div>
								</div>
							</div>')
				@$el.find('#video-list').empty()
				_.each @model.get('title'),(title,index)=>
					@$el.find('#video-list').append("<div class='playlist-video' data-index=#{index}>#{title}</div>")



			togglePlaylist :->
				@$el.find('.playlist-hidden').toggle()

			_playPrevVideo : (e)->
				e.stopPropagation()
				@index-- if @index > 0
				@_playVideo()

			_playNextVideo : (e)->
				e.stopPropagation() if e?
				if @index < @videos.length-1
					@index++
					@_playVideo()

			_playClickedVideo : (e)->
				e.stopPropagation()
				index = parseInt $(e.target).attr 'data-index'
				@index = index
				@_playVideo()



			_playVideo:->

				@$el.find('video').attr 'height', 'auto !important' if _.platform() is 'DEVICE'

				@$el.find('.playlist-video').removeClass 'currentVid'
				@$el.find(".playlist-video[data-index='#{@index}']").addClass 'currentVid'
				@$el.find('#now-playing-tag').text @model.get('title')[@index]
				
				if _.platform() is 'BROWSER'
					@$el.find('video').attr 'src',@videos[@index]
					@$el.find('video').attr 'poster', SITEURL+'/wp-content/themes/walnut/images/video-unavailable.png'

				else 
					@$el.find('video')[0].src = @videos[@index]
					@$el.find('video').attr 'poster', '/images/video-unavailable.png'

				@$el.find('video')[0].load()
				@$el.find('video')[0].play()



				
				

				
			
				


				

