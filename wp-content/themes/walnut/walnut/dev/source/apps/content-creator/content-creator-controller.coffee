define ['app'
        'controllers/region-controller'
        'apps/content-creator/element-box/elementboxapp'
        'apps/content-creator/content-builder/app'
        'apps/content-creator/property-dock/controller'
        'apps/content-creator/options-bar/options-bar-app'
        'apps/content-creator/grading-parameter/grading-parameter-controller'
], (App, RegionController)->
    App.module "ContentCreator.Controller", (Controller, App)->
        class Controller.ContentCreatorController extends RegionController

            initialize : (options)->
                {@contentType, contentID}= options

                if contentID
                    @contentPieceModel = App.request "get:page:json", contentID
                else
                    @contentPieceModel = App.request "get:page:json"

                App.execute "when:fetched", @contentPieceModel, =>
                    if not @contentPieceModel.get 'ID'
                        @contentPieceModel.set 'content_type' : @contentType

                breadcrumb_items =
                    'items' : [
                        { 'label' : 'Dashboard', 'link' : 'javascript://' },
                        { 'label' : 'Content Management', 'link' : 'javascript:;' },
                        { 'label' : 'Content Creator', 'link' : 'javascript:;', 'active' : 'active' }
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                # get the main layout for the content creator
                @layout = @_getContentCreatorLayout()



                @eventObj = App.createEventObject()

                # listen to "show" event of the layout and start the
                # elementboxapp passing the region
                @listenTo @layout, 'show', =>
                    App.execute "show:options:bar",
                        region : @layout.optionsBarRegion
                        contentType : @contentType
                        contentPieceModel : @contentPieceModel

                    App.execute "show:element:box",
                        region : @layout.elementBoxRegion
                        contentType : @contentPieceModel.get 'content_type'
                        eventObj : @eventObj

                    App.execute "show:content:builder",
                        region : @layout.contentBuilderRegion
                        contentPieceModel : @contentPieceModel
                        eventObj : @eventObj

                    if @contentPieceModel.get('content_type') is 'student_question'
                        App.execute "show:property:dock",
                            region : @layout.PropertyRegion
                            contentPieceModel : @contentPieceModel

                    if @contentPieceModel.get('question_type')? and
                    @contentPieceModel.get('question_type') is 'multiple_eval'
                        @_showGradingParameter()


                @listenTo @layout.optionsBarRegion , 'show:grading:parameter',@_showGradingParameter

                @listenTo @layout.optionsBarRegion, 'close:grading:parameter', @_closeGradingParameter


                # show the layout
                App.execute "when:fetched", @contentPieceModel, =>
                    @show @layout, loading : true

            _getContentCreatorLayout : ->
                new ContentCreatorLayout

            _showGradingParameter : ->

                $(@layout.contentBuilderRegion.el).find('#myCanvas').hide()

                App.execute 'show:grading:parameter:view',
                    region : @layout.gradingParameterRegion
                    contentPieceModel : @contentPieceModel

            _closeGradingParameter :->

                $(@layout.contentBuilderRegion.el).find('#myCanvas').show()

                @layout.gradingParameterRegion.reset()

        class ContentCreatorLayout extends Marionette.Layout

            className : 'content-creator-layout'

            template : '<div id="options-bar-region"></div>
                                    <div class="creator">
                                    <div class="tiles" id="toolbox"></div>
                                    <div class="" id="content-builder"></div>
                                    <div id="grading-parameter"></div>
                                    <div id="property-dock"></div>
                                    </div>'

            regions :
                elementBoxRegion : '#toolbox'
                contentBuilderRegion : '#content-builder'
                PropertyRegion : '#property-dock'
                optionsBarRegion : '#options-bar-region'
                gradingParameterRegion : '#grading-parameter'


# create a command handler to start the content creator controller
#        App.commands.setHandler "show:content:creator", (options)->
#            new Controller.ContentCreatorController