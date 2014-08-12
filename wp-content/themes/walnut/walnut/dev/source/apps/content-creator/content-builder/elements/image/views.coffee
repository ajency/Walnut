define ['app'], (App)->

    # Row views
    App.module 'ContentCreator.ContentBuilder.Element.Image.Views', (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.ImageView extends Marionette.ItemView

            className: 'image'

            template: '{{#image}}
            							<img src="{{imageurl}}" alt="{{title}}" class="{{alignclass}} img-responsive" width="100%"/>
            							<div class="clearfix"></div>
            						{{/image}}
            						{{#placeholder}}
            							<div class="image-placeholder"><span class="bicon icon-uniF10E"></span>Add Image</div>
            						{{/placeholder}}'


            # override serializeData to set holder property for the view
            mixinTemplateHelpers: (data)->
                data = super data

                console.log data
                console.log @model.id

                if @model.isNew()
                    console.log @model.id
                    data.placeholder = true
                else
                    data.image = true
                    data.imageurl = ''
                    # if @sizes['thumbnail'] then @sizes['thumbnail'].url else @sizes['full'].url
                    # @sizes['full'].url

                    data.alignclass = ->
                        switch @alignment
                            when 'left'
                                return 'pull-left'
                            when 'right'
                                return 'pull-right'

                data

            events:
                'click': 'imageClick'

            initialize :(options)->
                @imageHeightRatio = Marionette.getOption @,'imageHeightRatio'
                @positionTopRatio = Marionette.getOption @, 'positionTopRatio' 
                    

            # check if a valid image_id is set for the element
            # if present ignore else run the Holder.js to show a placeholder
            # after run remove the data-src attribute of the image to avoid
            # reloading placeholder image again
            onShow: ->
                if @model.isNew()
                    @$el.resizable
                        helper : "ui-image-resizable-helper"
                        handles: "s"
                    return

                if @imageHeightRatio isnt 'auto'
                    @$el.height parseFloat(@imageHeightRatio)*@$el.width()

                if @positionTopRatio 
                    @$el.find('img').css 'top',"#{@positionTopRatio*@$el.width()}px"

                # image resizable
                @$el.resizable
                    helper : "ui-image-resizable-helper"
                    handles: "s"

                    stop : (evt, ui)=>
                        # @assignImagePath @$el.height()
                        @$el.css 'width','auto'
                        @trigger 'set:image:height',@$el.height(),@$el.width()
                        @adjustImagePosition()
                        

                    start:(evt,ui)=>
                        $(@).addClass('noclick')

                # @TODO be done in css
                @$el.css 'overflow','hidden'
                # allow moving of image
                @$el.find('img').draggable
                    axis: "y" 
                    cursor: "move"

                    drag : (evt,ui)=>
                        topmarginpx = ui.position.top
                        if topmarginpx > 0
                            ui.position.top = 0

                        if topmarginpx < @$el.height()-@$el.find('img').height()
                            ui.position.top = @$el.height()-@$el.find('img').height()

                    stop:(evt,ui)=>
                        @trigger 'set:image:top:position',@$el.width(),parseInt @$el.find('img').css 'top'


                # on change of column size
                @$el.closest('.column').on 'class:changed',=>
                    @assignImagePath()
                    if @$el.height() > @$el.find('img').height()
                        @$el.height( 'auto' )
                        @trigger 'set:image:height','auto'

                    else
                        @trigger 'set:image:height',@$el.height(),@$el.width()

                    @adjustImagePosition()


                @assignImagePath()


            imageClick : (e)->
                e.stopPropagation()
                if $(e.target).hasClass('noclick')
                    $(e.target).removeClass('noclick')
                else
                    ratio = @_getImageRatio()
                    @trigger "show:media:manager", ratio

            assignImagePath :->                
                width = @$el.width()
                image = @model.getBestFit width
                @$el.find('img').attr 'src', image.url
                
                @trigger "image:size:selected", image.size

            _getImageRatio : ->
                console.log @$el
                width = @$el.width()
                height = @$el.height()
                "#{parseInt width}:#{parseInt height}"

            adjustImagePosition:->
                top = parseInt _(@$el.find('img').css('top')).rtrim('px')
                if top > 0
                    @$el.find('img').css 'top','0px'

                @trigger 'set:image:top:position',@$el.width(),parseInt @$el.find('img').css 'top'



