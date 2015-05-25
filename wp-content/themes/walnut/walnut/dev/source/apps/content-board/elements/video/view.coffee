define ['app'], (App)->

	# Row views
	App.module 'ContentPreview.ContentBoard.Element.Video.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.VideoView extends Marionette.ItemView

			className : 'video'

			template : '    {{#videoUrl}}
								<div class="videoContainer"></div>
							{{/videoUrl}}

							<img src="./images/video-unavailable.png" alt="no video" class="hidden" width="100%"/>

							<div class="clearfix"></div>'


			events :
				'click .show-playlist' : 'togglePlaylist'
				'click #prev' : '_playPrevVideo'
				'click #next' : '_playNextVideo'
				'click .playlist-video' : '_playClickedVideo'
				'click .video-js' : '_playFirstVideo' #Changes for mobile

				

			# check if a valid image_id is set for the element
			# if present ignore else run the Holder.js to show a placeholder
			# after run remove the data-src attribute of the image to avoid
			# reloading placeholder image again
			onShow : =>
				return if not @model.get('video_ids').length

				@videos = @model.get('videoUrls')
				@index = 0

				@_setVideoList() if _.size(@videos) > 1
				@$el.find(".playlist-video[data-index='0']").addClass 'currentVid'

				if _.platform() is 'BROWSER'
					@_addVideoElement @videos[0]

				if _.platform() is 'DEVICE'
					@count = 0
					@_decryptLocalVideoFiles()

			
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


			_playFirstVideo :=>
				if @count is 0
					@count++
					@$el.find('video')[0].src = @videos[0]
					@$el.find('video')[0].load()
					setTimeout =>
						@$el.find('video')[0].play()
					,300

			
			_playPrevVideo : (e)=>
				e.stopPropagation()
				@index-- if @index > 0
				@_playVideo()


			_playNextVideo : (e)=>
				e.stopPropagation() if e?
				if @index < @videos.length-1
					@count++
					@index++
					@_playVideo()


			_playClickedVideo : (e)=>
				e.stopPropagation()
				index = parseInt $(e.target).attr 'data-index'
				@index = index
				@_playVideo()


			_playVideo:=>
				@$el.find('.playlist-video').removeClass 'currentVid'
				@$el.find(".playlist-video[data-index='#{@index}']").addClass 'currentVid'
				@$el.find('#now-playing-tag').text @model.get('title')[@index]

				if _.platform() is 'BROWSER'
					@$el.find('video').attr 'src',@videos[@index]
					if not @videos[@index]
						@$el.find('video').attr 'poster', SITEURL+'/wp-content/themes/walnut/images/video-unavailable.png'

				@_addVideoElement @videos[@index], true


			_decryptLocalVideoFiles : ->
				navigator.notification.activityStart "Please wait", "loading content..."
				deferreds = []

				youtubeVideoDeferred = (videoSource)->
					defer = $.Deferred()
					defer.resolve videoSource
					defer.promise()

				_.createVideosWebDirectory().done =>
					_.each @videos , (videoSource, index)=>
						if videoSource.indexOf('youtube.com') < 0
							url = videoSource.replace "media-web/", ""
							videosWebUrl = url.substr(url.indexOf("uploads/"))
							videoUrl = videosWebUrl.replace("videos-web", "videos")
							encryptedPath = "SynapseAssets/SynapseMedia/"+videoUrl
							decryptedPath = "SynapseAssets/SynapseMedia/"+videosWebUrl
							
							value = _.getStorageOption()
							option = JSON.parse(value)
							encryptedVideoPath = decryptedVideoPath = ''

							if option.internal
								encryptedVideoPath = option.internal+'/'+encryptedPath
								decryptedVideoPath = option.internal+'/'+decryptedPath
							else if option.external
								encryptedVideoPath = option.external+'/'+encryptedPath
								decryptedVideoPath = option.external+'/'+decryptedPath
							
							deferreds.push _.decryptLocalFile(encryptedVideoPath, decryptedVideoPath)
						else
							deferreds.push youtubeVideoDeferred(videoSource)

					$.when(deferreds...).done (videoPaths...)=>
						_.each videoPaths , (localVideoPath , index)=>
							if localVideoPath.indexOf('youtube.com') < 0
								@videos[index] = 'file://'+localVideoPath

						console.log('_decryptLocalVideoFiles done')
						navigator.notification.activityStop()
						@_addVideoElement @videos[0]


			_addVideoElement:(videoUrl, autoplay=false)->
			
				@$el.find('.videoContainer').empty()
				if _.str.contains videoUrl, 'youtube.com'
					vidID= _.str.strRightBack videoUrl,'?v='
					@$el.find('.videoContainer').html '<div class="videoWrapper">
					<iframe width="100%" height="349" 
						src="https://www.youtube.com/embed/'+vidID+'?rel=0&amp;showinfo=0&autoplay=1" 
						frameborder="0">
					</iframe></div>'
				else
					@$el.find('.videoContainer').html '<video class="video-js vjs-default-skin" controls preload="none" width="100%"
									poster="./images/video-poster.jpg" data-setup="{}">
								</video>'

					if _.platform() is 'BROWSER'
						@$el.find('video')[0].load()
						@$el.find('video')[0].play()
					
					if _.platform() is 'DEVICE'
						@count++
						ratio = width: 16, height: 9
						setHeight = (@$el.find('video').width() * ratio.height) / ratio.width
						@$el.find('video').attr 'height', setHeight

						setTimeout =>
							$('img').addClass 'hidden'
							$('video').removeClass 'hidden'
							
							@$el.find('video')[0].src = @videos[@index]
							@$el.find('video')[0].addEventListener 'error', @onError, true
							@$el.find('video').on 'ended', =>
								@_playNextVideo()

							@$el.find('video')[0].load()
						, 300

						setTimeout =>
							@$el.find('video')[0].play()
						, 600


			onError : (evt)=>
				$('img').removeClass 'hidden'
				$('video').addClass 'hidden'
				@$el.find('video')[0].removeEventListener 'error', @onError, true

