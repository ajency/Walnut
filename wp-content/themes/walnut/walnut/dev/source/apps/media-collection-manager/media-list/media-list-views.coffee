define ['app'],(App)->
    App.module 'MediaCollectionManager.MediaList.Views',(Views)->

        class MediaView extends Marionette.ItemView

            tagName: 'div'

            className: 'panel panel-default moveable'

            template: '<div class="accordion-toggle">
                            <div class="aj-imp-image-item row">
                                <div class="col-sm-8">
                                    <div class="thumbnail m-b-5">
                                        <div class="imaTitle"><span>{{title_show}}</span></div>
                                    </div>
                                </div>

                                <div class="col-sm-4">
                                    <div class="imgactions">
                                        <a class="remove-media text-error" title="Delete Media"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete {{mediaType}}</a>
                                    </div>
                                </div>
                            </div>
                          </div>'

            events:

                'click .remove-media': (e)->
                    e.preventDefault()
                    e.stopPropagation()
                    if confirm( 'Are you sure?')
                        @trigger "remove:media", @model

            mixinTemplateHelpers : (data)->
                data = super data
                data.title_show = _.prune data.title, 50
                data.mediaType = Marionette.getOption @,'mediaType'
                data

            onRender: ->
                @$el.attr 'data-media-id', @model.get 'id'

        class NoMediaView extends Marionette.ItemView

            template: '<div class="alert">No {{mediaType}} found. Please add {{mediaType}}.</div>'

            mixinTemplateHelpers :(data)->
                data = super data
                data.mediaType = Marionette.getOption @,'mediaType'
                data


        class Views.MediaListView extends Marionette.CompositeView

            template: '<div class="aj-imp-image-header m-b-10 row">

                            <div class="col-sm-8">
                                File Name
                            </div>
                            <div class="col-sm-4">
                                Actions
                            </div>
                        </div>
                        <div class="panel-group" id="media-accordion"></div>'

            itemView: MediaView

            emptyView: NoMediaView

            itemViewOptions : ->
                mediaType : Marionette.getOption @,'mediaType'

            itemViewContainer: '#media-accordion'

            onBeforeRender: ->
                @collection.sort()

            # make them sortable
            onShow: ->
                @$el.find('#media-accordion').sortable
                    start: (e, ui)->
                        ui.placeholder.height ui.item.height()
                    update: @mediaSorted

            mediaSorted: (evt, ui)=>
                mediaIds = @$el.find('#media-accordion').sortable 'toArray', attribute: 'data-media-id'


                parsedMediaIds = _.map mediaIds, (mediaId, index)->
                    parseInt mediaId

                @trigger "media:order:updated", parsedMediaIds

            onClose: ->
                @$el.find('#media-accordion').sortable 'destroy'
