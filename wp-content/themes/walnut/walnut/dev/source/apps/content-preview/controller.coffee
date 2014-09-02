define ['app'
        'controllers/region-controller'
        'apps/content-preview/view'
        'apps/content-preview/content-board/controller'
        'apps/content-preview/top-panel/controller'
        'apps/content-preview/dialogs/hint-dialog/hint-dialog-controller'
        'apps/content-preview/dialogs/comment-dialog/comment-dialog-controller'
        'apps/take-module-item/multiple-evaluation/multiple-evaluation-controller'
], (App, RegionController)->
    App.module "ContentPreview", (ContentPreview, App, Backbone, Marionette, $, _)->
        class ContentPreviewRouter extends Marionette.AppRouter

            appRoutes :
                'content-piece/:contentID' : 'viewContentPieces'

        Controller =
            viewContentPieces : (id) ->
                App.execute "show:content:preview",
                    region : App.mainContentRegion
                    contentID : id
                    display_mode : 'read-only'
                    content_preview : true


        class ContentPreview.Controller extends RegionController

            initialize : (options)->
                {contentID, @model,@questionResponseModel,@timerObject, @display_mode,@students, content_preview,@classID} = options

                if contentID
                    @model = App.request "get:content:piece:by:id", contentID

                # get the main layout for the content preview
                @layout = @_getContentPreviewLayout(content_preview)

                @listenTo @layout, 'show:hint:dialog',(options)->
                    App.execute 'show:hint:dialog',
                        hint : options.hint

                @listenTo @layout,'show:comment:dialog',(options)->
                    App.execute 'show:comment:dialog',
                        comment : options.comment

                App.execute "when:fetched", @model, =>
                    # show the layout
                    @show @layout, loading : true


                # listen to "show" event of the layout and start the
                # elementboxapp passing the region
                @listenTo @layout, 'show', =>
                    App.execute "show:top:panel",
                        region : @layout.topPanelRegion
                        model : @model
                        questionResponseModel : @questionResponseModel
                        timerObject : @timerObject
                        display_mode : @display_mode
                        students : @students
                        classID  : @classID

                    if @model.get('question_type') is 'multiple_eval'
                        App.execute "show:single:question:multiple:evaluation:app",
                            region : @layout.contentBoardRegion
                            questionResponseModel : @questionResponseModel
                            studentCollection : @students
                            display_mode : @display_mode
                            timerObject : @timerObject
                            evaluationParams : @model.get 'grading_params'

                    else
                        App.execute "show:content:board",
                            region : @layout.contentBoardRegion
                            model : @model

            _getContentPreviewLayout : (content_preview)=>
                new ContentPreview.Views.Layout
                    model : @model
                    content_preview :content_preview

        App.commands.setHandler "show:content:preview", (options)->
            if not options.content_preview?
                options.content_preview = false
            new ContentPreview.Controller options


        ContentPreview.on "start", ->
            new ContentPreviewRouter
                controller : Controller

