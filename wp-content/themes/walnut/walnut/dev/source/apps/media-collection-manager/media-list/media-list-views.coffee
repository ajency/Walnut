define ['app'],(App)->
    App.module 'MediaCollectionManager.MediaList.Views',(Views)->

        class MediaView extends Marionette.ItemView

            tagName: 'div'

            className: 'panel panel-default moveable'

            template: '<div class="panel-heading">
                              <a class="accordion-toggle">
                                <div class="aj-imp-image-item row">

                                    <a class="thumbnail col-sm-8">
                                    <div class="imaTitle"><span>{{title_show}}</span></div>

                                    </a>

                                    <div class="imgactions col-sm-4">
                                        <a class="remove-media" title="Delete Media"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete Image</a>
                                    </div>
                                </div>
                              </a>
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
                data

            onRender: ->
                @$el.attr 'data-media-id', @model.get 'id'

        class NoMediaView extends Marionette.ItemView

            template: '<div class="alert">No media found. Please add media.</div>'


        class Views.MediaListView extends Marionette.CompositeView

            template: '<div class="aj-imp-image-header row">

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
