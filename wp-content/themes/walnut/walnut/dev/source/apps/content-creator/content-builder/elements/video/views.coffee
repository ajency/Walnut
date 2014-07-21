define ['app'], (App)->

    # Row views
    App.module 'ContentCreator.ContentBuilder.Element.Video.Views', (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.VideoView extends Marionette.ItemView

            className: 'video'


            template: '{{#video}}
                        <video  class="video-js vjs-default-skin show-video" controls preload="none" width="100%"
                            poster="'+SITEURL+'/wp-content/themes/walnut/images/video-poster.jpg"
                                        data-setup="{}" controls>

                        </video>
                        <div class="clearfix"></div>
                        <div id="playlist-hover" class="row" style="position: absolute; background-color: #000000;  z-index:20;  display: none">
                            <div class="col-sm-2" id="prev"><button>Prev</button></div>
                            <div class="row video-list col-sm-8" id="video-list"></div>
                            <div class="col-sm-2" id="next"><button>Next</button></div>

                         </div>
                            {{/video}}
                        {{#placeholder}}
                            <div class="video-placeholder show-video "><span class="bicon icon-uniF11E"></span>Add Video</div>
                        {{/placeholder}}'

#            <source src="{{videoUrl[0]}}" type="video/mp4" />
#



                    # override serializeData to set holder property for the view
            mixinTemplateHelpers: (data)->
                data = super data

                if not @model.get('video_ids').length
                    data.placeholder = true
                else
                    data.video = true

                data

            events:
                'click .show-video': (e)->
                    e.stopPropagation()
                    @trigger "show:media:manager"

                'mouseenter' : 'showPlaylist'
                'mouseleave' : 'hidePlaylist'
                'click #prev' : '_playPrevVideo'
                'click #next' : '_playNextVideo'
                'click .playlist-video' : '_playClickedVideo'

            # check if a valid image_id is set for the element
            # if present ignore else run the Holder.js to show a placeholder
            # after run remove the data-src attribute of the image to avoid
            # reloading placeholder image again
            onShow: ->
                return if not @model.get('video_ids').length

                @$el.find('video').resize =>
                    @triggerMethod 'video:resized'

                # generate unique id and give to video element
                videoId = _.uniqueId('video-')
                @$el.find('video').attr 'id', videoId
                # init videojs
                @videoElement = videojs videoId

                videos = new Array()
                _.each @model.get('videoUrl'),(url)->
                    videos.push
                        src : [url]

                #playlist
                @videoElement.playList videos,
                    getVideoSource: (vid, cb) ->
                        cb(vid.src)

                # set height according to the aspect ratio of 16:9
                width = @videoElement.width()
                height = 9 * width / 16
                @videoElement.height height

                @_setPlaylistPosition()
                @_setVideoList()

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
                @_setVideoList()
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


            # when the video element is moved arround change
            # the height according to the new aspect ratio
            onVideoResized: ->
                width = @videoElement.width()
                height = 9 * width / 16
                @videoElement.height height


			


				

			