define ['app'], (App)->

    # Row views
    App.module 'ContentCreator.ContentBuilder.Element.Video.Views', (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.VideoView extends Marionette.ItemView

            className: 'video'


            template: '{{#video}}
                        <video  class="video-js vjs-default-skin show-video" controls preload="none" width="100%"
                            poster="'+SITEURL+'/wp-content/themes/walnut/images/video-poster.jpg"
                                        data-setup="{}" controls src="{{videourl}}">

                        </video>
                        <div class="clearfix"></div>
                        <div id="playlist-hover" class="row playlistHover m-l-0 m-r-0" style="z-index:20">
                            <div class="col-sm-1 show-playlist"><button class="btn btn-info btn-small"><i class="fa fa-list-ul"></i></button></div>
                            <div class="video-list col-sm-9 playlist-hidden" id="video-list"></div>
                            <div class="col-sm-1 playlist-hidden" id="prev"><button class="btn btn-info btn-small"><i class="fa fa-step-backward"></i></button></div>
                            <div class="col-sm-1 playlist-hidden" id="next"><button class="btn btn-info btn-small pull-right"><i class="fa fa-step-forward"></i></button></div>

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
                    data.videourl = data.videoUrl[0]

                data

            events:
                'click .show-video': (e)->
                    e.stopPropagation()
                    @trigger "show:media:manager"
#
                'click .show-playlist' : 'togglePlaylist'
                'click #prev' : '_playPrevVideo'
                'click #next' : '_playNextVideo'
                'click .playlist-video' : '_playClickedVideo'


            # check if a valid image_id is set for the element
            # if present ignore else run the Holder.js to show a placeholder
            # after run remove the data-src attribute of the image to avoid
            # reloading placeholder image again
            onShow: ->
                return if not @model.get('video_ids').length



                @videos = @model.get('videoUrl')
                @index = 0

                @$el.find('video').on 'ended', =>
                    @_playNextVideo()

                @_setVideoList()
                @$el.find(".playlist-video[data-index='0']").addClass 'currentVid'


            _setVideoList : ->

                @$el.find('#video-list').empty()
                _.each @model.get('title'),(title,index)=>
                    @$el.find('#video-list').append("<div class='playlist-video' data-index=#{index}>#{title}</div>")




            togglePlaylist :->
                @$el.find('.playlist-hidden').toggle()

            _playPrevVideo : (e)->
                e.stopPropagation()
                @index-- if @index >0
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
                @$el.find('video').attr 'src',@videos[@index]
                @$el.find('video')[0].load()
                @$el.find('video')[0].play()




			


				

			