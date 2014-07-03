define ['app'], (App)->

    # Row views
    App.module 'ContentPreview.ContentBoard.Element.ImageWithText.Views',
    (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.ImageWithTextView extends Marionette.ItemView

            className : 'imagewithtext'

            template : '<img src="{{imageurl}}" alt="{{title}}" class="{{alignclass}} img-responsive" 
                        onerror="this.onerror=null;this.src=\'/images/avtar.png\';"/>
                        <p class="editor"></p>
						<div class="clearfix"></div>'

            # override serializeData to set holder property for the view
            mixinTemplateHelpers : (data)->
                data = super data
                data.holder = ''

                data.imageurl = ->
                    if @sizes?
                        if @sizes['thumbnail'] then @sizes['thumbnail'].url else @sizes['full'].url

                data.alignclass = ->
                    switch @align
                        when 'left'
                            return 'pull-left'
                        when 'right'
                            return 'pull-right'

                data






            # set the height of the parent of img in case float value is set
            # check if a valid image_id is set for the element
            # if present ignore else run the Holder.js to show a placeholder
            # after run remove the data-src attribute of the image to avoid
            # reloading placeholder image again
            onShow : ->
                content = Marionette.getOption(this, 'templateHelpers').content
                @$el.find('p').append _.stripslashes content