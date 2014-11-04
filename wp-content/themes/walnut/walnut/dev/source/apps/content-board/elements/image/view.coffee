define ['app'], (App)->

    # Row views
    App.module 'ContentPreview.ContentBoard.Element.Image.Views',
    (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.ImageView extends Marionette.ItemView

            className : 'image'

            template : '<img src="{{imageurl}}" alt="{{title}}" class="img-responsive" width="100%" style="position:relative;"
                        onerror="this.onerror=null;this.src=\'/images/img-not-found.jpg\';"/>
                        <div class="clearfix"></div>'


            # override serializeData to set holder property for the view
            mixinTemplateHelpers : (data)->
                data = super data

                data.imageurl = data.sizes[data.size].url if data.sizes?

                data


            initialize :(options)->
                @imageHeightRatio = Marionette.getOption @,'imageHeightRatio'
                @positionTopRatio = Marionette.getOption @, 'positionTopRatio'


            # check if a valid image_id is set for the element
            # if present ignore else run the Holder.js to show a placeholder
            # after run remove the data-src attribute of the image to avoid
            # reloading placeholder image again
            onShow : ->
                @$el.css 'overflow','hidden'

                if @imageHeightRatio isnt 'auto'
                    @$el.height parseFloat(@imageHeightRatio)*@$el.width()

                if @positionTopRatio 
                    @$el.find('img').css 'top',"#{@positionTopRatio*@$el.width()}px"