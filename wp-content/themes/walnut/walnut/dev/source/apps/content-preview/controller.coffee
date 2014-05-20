define ['app'
        'controllers/region-controller'
        'apps/content-preview/view'
        'apps/content-preview/content-board/controller'
        'apps/content-preview/top-panel/controller'
], (App, RegionController)->
    App.module "ContentPreview", (ContentPreview, App, Backbone, Marionette, $, _)->
        class ContentPreview.Controller extends RegionController

            initialize: (options)->

                {@model,@questionResponseModel,@timerObject, @display_mode,@classID,@students} = options
                # get the main layout for the content preview
                @layout = @_getContentPreviewLayout()

                # eventObj = App.createEventObject()

                # listen to "show" event of the layout and start the
                # elementboxapp passing the region
                @listenTo @layout, 'show', =>
                    App.execute "show:top:panel",
                        region: @layout.topPanelRegion
                        model: @model
                        textbookNames: @textbookNames
                        questionResponseModel: @questionResponseModel
                        timerObject : @timerObject
                        display_mode: @display_mode
                        classID: @classID
                        students: @students


                    App.execute "show:content:board",
                        region: @layout.contentBoardRegion
                        model: @model


                # show the layout
                @show @layout, loading:true

            _getContentPreviewLayout: ->
                new ContentPreview.Views.Layout

        App.commands.setHandler "show:content:preview", (options)->
            new ContentPreview.Controller options

