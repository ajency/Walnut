define ['app'], (App)->

    # Row views
    App.module 'ContentPreview.ContentBoard.Element.Video.Views', (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.VideoView extends Marionette.ItemView

            className : 'video'

            template : '
            							<video  class="video-js vjs-default-skin" controls preload="none" width="100%"
            								poster="http://www.eyespot.com/2013/wp-content/uploads/2013/04/video-clip.jpg"
            								data-setup="{}" controls>
            								<source src="{{videoUrl}}" type="video/mp4" />


            							</video>
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
                videoId = _.uniqueId('video-')
                @$el.find('video').attr 'id', videoId
                # init videojs
                @videoElement = videojs videoId


                # set height according to the aspect ratio of 16:9
                width = @videoElement.width()
                height = 9 * width / 16
                @videoElement.height height

				
				

				
			
				


				

			