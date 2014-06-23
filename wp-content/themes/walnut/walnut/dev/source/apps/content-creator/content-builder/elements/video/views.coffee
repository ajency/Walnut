define ['app'], (App)->

    # Row views
    App.module 'ContentCreator.ContentBuilder.Element.Video.Views', (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.VideoView extends Marionette.ItemView

            className: 'video'

            template: '{{#video}}
            							<video  class="video-js vjs-default-skin" controls preload="none" width="100%"
            								poster="'+SITEURL+'/wp-content/themes/walnut/images/video-poster.jpg"
            								data-setup="{}" controls>
            								<source src="{{videoUrl}}" type="video/mp4" />


            							</video>
            							<div class="clearfix"></div>
            						{{/video}}
            						{{#placeholder}}
            							<div class="video-placeholder"><span class="bicon icon-uniF11E"></span>Add Video</div>
            						{{/placeholder}}'


            # override serializeData to set holder property for the view
            mixinTemplateHelpers: (data)->
                data = super data

                if not @model.get 'video_id'
                    data.placeholder = true
                else
                    data.video = true
                    data.videourl = ''

                data

            events:
                'click': (e)->
                    e.stopPropagation()
                    @trigger "show:media:manager"

            # check if a valid image_id is set for the element
            # if present ignore else run the Holder.js to show a placeholder
            # after run remove the data-src attribute of the image to avoid
            # reloading placeholder image again
            onShow: ->
                return if not @model.get 'video_id'

                @$el.find('video').resize =>
                    @triggerMethod 'video:resized'

                # generate unique id and give to video element
                videoId = _.uniqueId('video-')
                @$el.find('video').attr 'id', videoId
                # init videojs
                @videoElement = videojs videoId

                # set height according to the aspect ratio of 16:9
                width = @videoElement.width()
                console.log width
                height = 9 * width / 16
                @videoElement.height height
                console.log height



            # when the video element is moved arround change
            # the height according to the new aspect ratio
            onVideoResized: ->
                width = @videoElement.width()
                height = 9 * width / 16
                @videoElement.height height

			


				

			