define ['app'
        'controllers/region-controller'
        'apps/content-preview/view'
        'apps/content-preview/content-board/controller'
        'apps/content-preview/top-panel/controller'
], (App, RegionController)->
    App.module "ContentPreview", (ContentPreview, App, Backbone, Marionette, $, _)->

        class ContentPreviewRouter extends Marionette.AppRouter

            appRoutes:
                'content-piece/:contentID': 'viewContentPieces'

        Controller =
            viewContentPieces:(id) ->

                App.execute "show:content:preview",
                    region                  : App.mainContentRegion
                    contentID               : id
                    display_mode            : 'read-only'



        class ContentPreview.Controller extends RegionController

            initialize: (options)->

                {contentID, @model,@questionResponseModel,@timerObject, @display_mode,@students} = options

                if contentID
                    @model= App.request "get:content:piece:by:id", contentID

                # get the main layout for the content preview
                @layout = @_getContentPreviewLayout()

                App.execute "when:fetched", @model, =>
                    # show the layout
                    @show @layout, loading:true



                # listen to "show" event of the layout and start the
                # elementboxapp passing the region
                @listenTo @layout, 'show', =>
                    App.execute "show:top:panel",
                        region: @layout.topPanelRegion
                        model: @model
                        questionResponseModel: @questionResponseModel
                        timerObject : @timerObject
                        display_mode: @display_mode
                        students: @students


                    App.execute "show:content:board",
                        region: @layout.contentBoardRegion
                        model: @model

            _getContentPreviewLayout: ->
                new ContentPreview.Views.Layout

        App.commands.setHandler "show:content:preview", (options)->
            new ContentPreview.Controller options



        ContentPreview.on "start", ->
            new ContentPreviewRouter
                controller: Controller

