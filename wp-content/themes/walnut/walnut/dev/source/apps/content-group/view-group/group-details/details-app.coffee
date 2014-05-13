define ['app'
        'controllers/region-controller'
        'text!apps/content-group/view-group/group-details/templates/group-details.html'], (App, RegionController, collectionDetailsTpl)->
    App.module "CollecionDetailsApp.Controller", (Controller, App)->
        class Controller.ViewCollecionDetailsController extends RegionController

            initialize: (opts)->

                # for take-class module the template changes a bit
                # so based on this value (@mode) we set the template additional stuff
                {@model,@mode,@questionResponseCollection,@textbookNames}= opts

                @view = view = @_getCollectionDetailsView @model

                @show view, (loading: true, entities: [@textbookNames])

                @listenTo view, 'start:teaching:module', =>
                    @region.trigger "start:teaching:module"

            _getCollectionDetailsView: (model)->
                terms = model.get 'term_ids'
                console.log terms
                console.log @textbookNames

                new CollectionDetailsView
                    model: model
                    mode: @mode

                    templateHelpers:
                        getTextbookName: =>
                            textbook = @textbookNames.get terms.textbook
                            texbookName = textbook.get 'name' if textbook?

                        getChapterName: =>
                            chapter = @textbookNames.get terms.chapter
                            chapterName = chapter.get 'name' if chapter?


                        startScheduleButton: =>
                            actionButtons = ''

                            allContentPieces = @model.get 'content_pieces'

                            answeredPieces= @questionResponseCollection.where "status":"completed"

                            answeredIDs = _.chain answeredPieces
                                            .map (m)->m.toJSON()
                                            .pluck 'content_piece_id'
                                            .value()

                            answeredPieces = @questionResponseCollection.pluck 'content_piece_id'

                            unanswered = _.difference allContentPieces, answeredIDs

                            if _.size(unanswered) > 0 and @mode isnt 'training'
                                actionButtons = '<button type="button" id="start-module" class="btn btn-white btn-small action pull-right m-t-10">
                                									<i class="fa fa-play"></i> Start
                                								</button>'
                            actionButtons


        class CollectionDetailsView extends Marionette.ItemView

            template: collectionDetailsTpl

            className: 'tiles white grid simple vertical green'

            events:
                'click #start-module': 'startModule'

            serializeData: ->
                data = super()
                data.takeClassModule = Marionette.getOption @, 'mode'
                data

            startModule: =>
                currentRoute = App.getCurrentRoute()
                App.navigate currentRoute + "/question"

                @trigger "start:teaching:module"


        # set handlers
        App.commands.setHandler "show:viewgroup:content:group:detailsapp", (opt = {})->
            new Controller.ViewCollecionDetailsController opt

