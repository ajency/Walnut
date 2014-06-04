define ['app'
        'text!apps/media/grid/templates/media.html'
], (App, mediaTpl, layoutTpl)->
    App.module 'Media.Grid.Views', (Views, App)->

        # single media view
        class MediaView extends Marionette.ItemView

            template: mediaTpl

            className: 'col-sm-2 single-img'

            events:
                'click a': (e)->
                    e.preventDefault()
                'click': '_whenImageClicked'

            # override serializeData to set holder property for the view
            #if no thumbnail thn dont show image
            mixinTemplateHelpers: (data)->
                data = super data
                data.imagePreview = @imagePreview = false
                data.videoPreview = @videoPreview = false

                if data.type is 'image'
                    if data.sizes and data.sizes.thumbnail and data.sizes.thumbnail.url
                        data.imagePreview = @imagePreview = true

                if data.type is 'video'
                    data.videoPreview = @videoPreview = true
                    data.title_excerpt= _.prune data.title, 15

                console.log data
                data

            _whenImageClicked: (e)->
                console.log 'clicked'
                console.log e.target
                media = if $(e.target).hasClass('single-img') then $(e.target)
                else $(e.target).closest('.single-img')
                #                if $(media).hasClass('ui-selected')
                @trigger "media:element:selected"
                console.log 'media selected ' + media
#                else
#                    @trigger "media:element:unselected"
#                    console.log 'media unselected '+media


        # collection view
        class Views.GridView extends Marionette.CompositeView

            template: '<div class="row b-b b-grey m-b-10">
                            <div class="btn-group">
                                <a id="list" class="btn btn-default btn-sm btn-small">
                                    <span class="glyphicon glyphicon-th-list"></span> List
                                </a>
                                <a id="grid" class="btn btn-default btn-sm btn-small">
                                    <span class="glyphicon glyphicon-th"></span> Grid
                                </a>
                            </div>
                            <div class="input-with-icon right pull-right mediaSearch m-b-10">
                                <i class="fa fa-search"></i>
                                <input type="text" class="form-control" placeholder="Search">
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="row">
                            <div id="selectable-images"></div>
                        </div>'

            itemView: MediaView

            itemViewContainer: '#selectable-images'

            onCollectionRendered: ->
                if @multiSelect
                    @$el.find('#selectable-images').bind "mousedown", (e)->
                        e.metaKey = true;
                    .selectable()
                else
                    @$el.find('#selectable-images').selectable()

            onShow: ->
                @$el.find('a#list.btn').on 'click', _.bind @_changeChildClass, @, 'List'
                @$el.find('a#grid.btn').on 'click', _.bind @_changeChildClass, @, 'Grid'

                # after showing the initial list
                #  initialize the event
                @on 'after:item:added', (imageView)=>
                    if @$el.find('.single-img:first').hasClass 'col-sm-2'
                        @_changeChildClass 'Grid'
                    else if @$el.find('.single-img:first').hasClass 'listView'
                        @_changeChildClass 'List'
                    #show the grid view on image added
                    @$el.closest('.tab-content').siblings('.nav-tabs')
                    .find('.all-media-tab').find('a').trigger 'click'
                    #trigger the selectable to point to the newly added image
                    imageView.$el.find('img').trigger 'click'
                    @$el.find('#selectable-images').selectSelectableElements imageView.$el


#            programatically select elements
#            _selectSelectableElements :(selectableContainer, elementsToSelect)->
#                # remove the class ui-selected for the ones not selected
#                $(".ui-selected", selectableContainer).not(elementsToSelect).
#                removeClass("ui-selected")
#                # add ui-selected class to the elements to select
#                $(elementsToSelect).not(".ui-selected").addClass("ui-selected")

            _changeChildClass: (toType, evt)->
                @children.each _.bind @_changeClassOfEachChild, @, toType

            _changeClassOfEachChild: (type, child)->
                if type is 'List'
                    child.$el.removeClass('col-sm-2')
                    .addClass('listView')
                else if type is 'Grid'
                    child.$el.removeClass('listView')
                    .addClass('col-sm-2')