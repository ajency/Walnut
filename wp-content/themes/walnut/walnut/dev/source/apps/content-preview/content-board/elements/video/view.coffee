define ['app'], (App)->

    # Row views
    App.module 'ContentPreview.ContentBoard.Element.Video.Views', (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.VideoView extends Marionette.ItemView

            className : 'video'

            template : '    {{#videoUrl}}
                            <video  class="video-js vjs-default-skin" controls preload="none" width="100%"
                            poster="'+SITEURL+'/wp-content/themes/walnut/images/video-poster.jpg"
                                    data-setup="{}" controls src="{{videoUrl}}">

                            </video>
                            {{/videoUrl}}
                            {{^videoUrl}}
                                <video  class="video-js vjs-default-skin" controls preload="none" width="100%"
                                poster="'+SITEURL+'/wp-content/themes/walnut/images/video-unavailable.png"
                                        data-setup="{}" controls src="{{videoUrl}}">

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
                @$el.find('.playlist-video').removeClass 'currentVid'
                @$el.find(".playlist-video[data-index='#{@index}']").addClass 'currentVid'
                @$el.find('#now-playing-tag').text @model.get('title')[@index]
                @$el.find('video').attr 'src',@videos[@index]
                console.log @videos[@index]
                @$el.find('video').attr 'poster', SITEURL+'/wp-content/themes/walnut/images/video-unavailable.png'
                @$el.find('video')[0].load()
                @$el.find('video')[0].play()


				
				

				
			
				


				

			