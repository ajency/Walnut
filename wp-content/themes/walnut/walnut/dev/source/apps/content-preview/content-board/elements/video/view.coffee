define ['app'], (App)->

    # Row views
    App.module 'ContentPreview.ContentBoard.Element.Video.Views', (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.VideoView extends Marionette.ItemView

            className : 'video'

            template : '    <video class="video-js vjs-default-skin" 
                                poster="/images/video-poster.jpg" 
                                width="100%" data-setup="{}" controls>
                            </video>
                          
                            <div class="clearfix"></div>
                            <div id="playlist-hover" class="row" style="position: absolute; background-color: #000000;  z-index:20;  display: none">
                                <div class="col-sm-2" id="prev"><button>Prev</button></div>
                                <div class="row video-list col-sm-8" id="video-list"></div>
                                <div class="col-sm-2" id="next"><button>Next</button></div>

                             </div>
                        					'




            events :
                'mouseenter' : 'showPlaylist'
                'mouseleave' : 'hidePlaylist'
                'click #prev' : '_playPrevVideo'
                'click #next' : '_playNextVideo'
                'click .playlist-video' : '_playClickedVideo'

            # check if a valid image_id is set for the element
            # if present ignore else run the Holder.js to show a placeholder
            # after run remove the data-src attribute of the image to avoid
            # reloading placeholder image again
            onShow : ->

                # generate unique id and give to video element
                videoId = _.uniqueId('video-')
                @$el.find('video').attr 'id', videoId
                # init videojs
                # @videoElement = videojs videoId

                # videos = new Array()
                # _.each @model.get('videoUrl'),(url)->
                #     videos.push
                #         src : [url]

                # #playlist
                # @videoElement.playList videos,
                #     getVideoSource: (vid, cb) ->
                #         cb(vid.src)


                # set height according to the aspect ratio of 16:9
                # width = @videoElement.width()
                # height = 9 * width / 16
                # @videoElement.height height

                @_setPlaylistPosition()
                @_setVideoList()

                # if _.platform() is 'DEVICE'

                #     url = @model.get('videoUrl').replace("media-web/","")
                #     videosWebUrl = url.substr(url.indexOf("uploads/"))

                #     videoUrl = videosWebUrl.replace("videos-web", "videos")
                #     encryptedVideoPath = "SynapseAssets/SynapseMedia/"+videoUrl
                    
                #     decryptedVideoPath = "SynapseAssets/SynapseMedia/"+videosWebUrl

                #     videosWebDirectory = _.createVideosWebDirectory()
                #     videosWebDirectory.done ->

                #         decryptFile = _.decryptVideoFile(encryptedVideoPath, decryptedVideoPath)
                #         decryptFile.done (videoPath)->
                            
                #             #'videos' is initialized globally inside 'plugins/walnut-app.js'
                #             `videos[videoId] = videoPath;`

                #             window.plugins.html5Video.initialize videos
                #             window.plugins.html5Video.play videoId

            _setPlaylistPosition : ->

                position =  @$el.position()
                @$el.find('#playlist-hover').css
                    'top' : position.top + @$el.height()
                    'left' : position.left + 15
                    'width' : @$el.width()

            _setVideoList : ->
                @$el.find('#video-list').empty()
                _.each @model.get('title'),(title,index)=>
                    @$el.find('#video-list').append("<div class='col-sm-6 playlist-video' data-index=#{index}>#{title}</div>")



            showPlaylist :->
                @_setPlaylistPosition()
                @$el.find('#playlist-hover').show()

            hidePlaylist : ->
                @$el.find('#playlist-hover').hide()

            _playPrevVideo : ->
                @videoElement.prev()

            _playNextVideo : ->
                @videoElement.next()

            _playClickedVideo : (e)->
                index = parseInt $(e.target).attr('data-index')
                @videoElement.playList index


				
				

				
			
				


				

			