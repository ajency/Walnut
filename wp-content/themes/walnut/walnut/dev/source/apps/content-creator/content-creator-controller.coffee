define ['app'
        'controllers/region-controller'
        'apps/content-creator/element-box/elementboxapp'
        'apps/content-creator/content-builder/app'
        'apps/content-creator/property-dock/controller'
        'apps/content-creator/options-bar/options-bar-app'
], (App, RegionController)->

    App.module "ContentCreator.Controller", (Controller, App)->
        class Controller.ContentCreatorController extends RegionController

            initialize: (options)->
                {@contentType, contentID}= options

                if contentID
                    @contentPieceModel = App.request "get:page:json", contentID
                else
                    @contentPieceModel = App.request "get:page:json"

                App.execute "when:fetched", @contentPieceModel, =>
                    if not @contentPieceModel.get 'ID'
                        @contentPieceModel.set 'content_type': @contentType


                #command to help trigger of Options/Meta settings save to model
                #when save button is clicked from property dock
                #save needs to happen only after meta settings are set to model

                @saveModelCommand = new Backbone.Wreqr.Commands();

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'},
                        {'label': 'Content Management', 'link': 'javascript:;'},
                        {'label': 'Content Creator', 'link': 'javascript:;', 'active': 'active'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                # get the main layout for the content creator
                @layout = @_getContentCreatorLayout @contentPieceModel

                # eventObj = App.createEventObject()

                # listen to "show" event of the layout and start the
                # elementboxapp passing the region
                @listenTo @layout, 'show', =>
                    console.log @saveModelCommand

                    App.execute "show:options:bar",
                        region: @layout.optionsBarRegion
                        contentType: @contentType
                        contentPieceModel: @contentPieceModel
                        saveModelCommand : @saveModelCommand

                    App.execute "show:element:box",
                        region: @layout.elementBoxRegion
                        contentType: @contentType

                    App.execute "show:content:builder",
                        region: @layout.contentBuilderRegion
                        contentPieceModel: @contentPieceModel

                    App.execute "show:property:dock",
                        region: @layout.PropertyRegion
                        saveModelCommand : @saveModelCommand

                # show the layout
                @show @layout

            _getContentCreatorLayout: ->
                new ContentCreatorLayout


        class ContentCreatorLayout extends Marionette.Layout

            className: 'content-creator-layout'

            template: '<div id="options-bar-region"></div>
                                                    <div class="page-title">
                                                      <h3>Add <span class="semi-bold">Question</span></h3>
                                                    </div>
                                                    <div class="creator">
                                                      <div class="tiles" id="toolbox"></div>
                                                      <div class="" id="content-builder"></div>
                                                      <div class="dock tiles" id="property-dock"></div>
                                                    </div>'

            regions:
                elementBoxRegion: '#toolbox'
                contentBuilderRegion: '#content-builder'
                PropertyRegion: '#property-dock'
                optionsBarRegion: '#options-bar-region'




        # create a command handler to start the content creator controller
#        App.commands.setHandler "show:content:creator", (options)->
#            new Controller.ContentCreatorController