define ['app'],(App)->

    # Row views
    App.module 'ContentCreator.ContentBuilder.Element.Audio.Views', (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.AudioView extends Marionette.ItemView

            className : 'audio'

            template : '{{#audio}}
            							<video  class="video-js vjs-default-skin" controls preload="none" width="100%"
            								poster="http://www.eyespot.com/2013/wp-content/uploads/2013/04/video-clip.jpg"
            								data-setup="{}" controls>
            								<source src="{{videoUrl}}" type="video/mp4" />


            							</video>
            							<div class="clearfix"></div>
            						{{/audio}}
            						{{#placeholder}}
            							<div class="image-placeholder"><span class="bicon icon-uniF10E"></span>Upload Video</div>
            						{{/placeholder}}'


            # override serializeData to set holder property for the view
            mixinTemplateHelpers:(data)->
                data = super data

                data.audio = true


                data

            events:
                'click'	: (e)->
                    e.stopPropagation()
            # @trigger "show:media:manager"

            # check if a valid image_id is set for the element
            # if present ignore else run the Holder.js to show a placeholder
            # after run remove the data-src attribute of the image to avoid
            # reloading placeholder image again
            onShow:->
#                @$el.find('video').resize =>
#                    @triggerMethod 'audio:resized'
#
#                # generate unique id and give to video element
#                videoId = _.uniqueId('video-')
#                @$el.find('video').attr 'id',videoId
#                # init videojs
#                @videoElement = videojs videoId
#
#                # set height according to the aspect ratio of 16:9
#                width = @videoElement.width()
#                console.log width
#                height = 9*width/16
#                @videoElement.height height
#                console.log height



#            # when the video element is moved arround change
#            # the height according to the new aspect ratio
#            onVideoResized:->
#
#                width = @videoElement.width()
#                height = 9*width/16
#                @videoElement.height height





