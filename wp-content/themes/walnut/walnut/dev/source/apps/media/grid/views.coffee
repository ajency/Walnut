define ['app'
        'text!apps/media/grid/templates/media.html'
        'text!apps/media/grid/templates/layout-tpl.html'
        # 'bootbox'
], (App, mediaTpl, layoutTpl)->
    App.module 'Media.Grid.Views', (Views, App)->

        # single media view
        class MediaView extends Marionette.ItemView

            template : mediaTpl

            className : 'col-sm-2 single-img'

            events :
                'click a' : (e)->
                    e.preventDefault()
                'click' : '_whenImageClicked'
                'click .delete-media-img' : ->
                    if confirm "Delete image?"#,(result)=>
                        # if result
                            @trigger "delete:media:image", @model
                'click .edit-image' : ->
                    @trigger 'show:image:editor', @model

            modelEvents : 
                'change' : 'render'

            # override serializeData to set holder property for the view
            #if no thumbnail thn dont show image
            mixinTemplateHelpers : (data)->
                data = super data
                data.imagePreview  = false
                data.videoPreview  = false
                data.audioPreview  = false

                if data.type is 'image'
                    if data.sizes and data.sizes.thumbnail and data.sizes.thumbnail.url
                        data.imagePreview  = true

                if data.type is 'video'
                    data.videoPreview  = true
                    data.title_show  = _.prune data.title , 50

                if data.type is 'audio'
                    data.audioPreview  = true
                    data.title_show  = _.prune data.title , 50

                data

            _whenImageClicked : (e)->
                media = if $(e.target).hasClass('single-img') then $(e.target)
                else $(e.target).closest('.single-img')
                #                if $(media).hasClass('ui-selected')
                @trigger "media:element:selected"
        #                console.log 'media selected ' + media
        #                else
        #                    @trigger "media:element:unselected"
        #                    console.log 'media unselected '+media


        # collection view
        class Views.GridView extends Marionette.CompositeView

            template : layoutTpl

            itemView : MediaView

            itemViewContainer : '#selectable-images'

            events:
                'keypress .mediaSearch' : 'searchMedia'
                'click a#list.btn'  :-> @_changeChildClass 'List'
                'click a#grid.btn'  :-> @_changeChildClass 'Grid'

            mixinTemplateHelpers : (data)->
                data = super data

                data.audio = data.video = false

                if Marionette.getOption(@,'mediaType') is 'video'
                    data.video = true
                if Marionette.getOption(@,'mediaType') is 'audio'
                    data.audio = true

                data

            onRender:->
                @$el.find '#no-results-div'
                .hide()

                mediaType= Marionette.getOption(@,'mediaType')
                # after showing the initial list
                #  initialize the event
                @listenTo @, 'after:item:added', (imageView)=>

                    if @$el.find('.single-img:first').hasClass 'col-sm-2'
                        @_changeChildClass 'Grid'
                    else if @$el.find('.single-img:first').hasClass 'listView'
                        @_changeChildClass 'List'
                    #show the grid view on image added
                    @$el.closest('.tab-content').siblings('.nav-tabs')
                    .find('.all-media-tab').find('a').trigger 'click'
                    #trigger the selectable to point to the newly added image
                   

                @listenTo @collection,'media:uploaded',(imageModel)->
                    imageView = @children.findByModel imageModel
                    imageView.$el.find('img').trigger 'click'
                    @$el.find( '#selectable-images' ).selectSelectableElements imageView.$el

                if not @collection.isEmpty() or mediaType is 'image'
                    @$el.find "#placeholder-video-txt"
                    .hide()

                if mediaType in ['video', 'audio']
                    @$el.find '#list, #grid'
                    .hide()
                    @_changeChildClass 'List'

                if @collection.isEmpty() and _.trim(@collection.filters.searchStr) isnt ''
                    @$el.find "#placeholder-video-txt"
                    .hide()

                    @$el.find '#no-results-div'
                    .show()
                    .html 'No media files were found for your search: '+ @collection.filters.searchStr +
                        '<br>Add a part of the media title in search.'
                    @collection.filters.searchStr = ''

            # @$el.find('#selectable-images').selectSelectableElements imageView.$el
            onCollectionRendered : ->
                if @multiSelect
                    @$el.find('#selectable-images').bind "mousedown", (e)->
                        e.metaKey = true;
                    .selectable
                        cancel : '.delete-media-img'
                else
                    @$el.find('#selectable-images').selectable
                        cancel : '.delete-media-img'

            _changeChildClass : (toType, evt)->
                @children.each _.bind @_changeClassOfEachChild, @, toType

            _changeClassOfEachChild : (type, child)->
                if type is 'List'
                    child.$el.removeClass('col-sm-2')
                    .addClass('listView')
                else if type is 'Grid'
                    child.$el.removeClass('listView')
                    .addClass('col-sm-2')

            searchMedia:(e)=>
                p = e.which
                if p is 13
                    searchStr= _.trim $(e.target).val()
                    @trigger("search:media", searchStr) if searchStr

            onMediaCollectionFetched:(coll)=>
                @collection =coll
                @render()

            onShowEditImage : ( editView )->
                @$el.find( '#show-image' ).hide()
                @$el.find( '#edit-image-view' ).html( editView.render().$el ).show()
                editView.triggerMethod 'show'

            onImageEditingCancelled : ->
                self = @
                @$el.find( '#edit-image-view' ).fadeOut 'fast', ->
                   $( @ ).empty()
                   self.$el.find( '#show-image' ).show()