define ['app'
        'controllers/region-controller'
        'text!apps/content-group/view-group/content-display/templates/content-display.html',
        'text!apps/content-group/view-group/content-display/templates/content-display-item.html'], (App, RegionController, contentDisplayTpl, contentDisplayItemTpl)->
    App.module "CollectionContentDisplayApp.Controller", (Controller, App)->
        class Controller.CollectionContentDisplayController extends RegionController

            initialize: (opts)->
                {model, @mode, questionResponseCollection,groupContentCollection} = opts

                @view = view = @_getCollectionContentDisplayView model, groupContentCollection, questionResponseCollection

                @show view, (loading: true, entities: [groupContentCollection, questionResponseCollection])

                @listenTo @view, 'view:question:readonly', (questionID)=>
                    @region.trigger 'goto:question:readonly', questionID

            _getCollectionContentDisplayView: (model, collection, responseCollection) =>
                timeTakenArray= responseCollection.pluck('time_taken');
                totalTimeTakenForModule=0
                if _.size(timeTakenArray)>0
                    totalTimeTakenForModule =   _.reduce timeTakenArray, (memo, num)-> parseInt memo + parseInt num

                new ContentDisplayView
                    model: model
                    collection: collection
                    responseCollection: responseCollection
                    mode: @mode

                    templateHelpers:
                        showElapsedTime:=>
                            mins=parseInt(totalTimeTakenForModule/60)


        class ContentItemView extends Marionette.ItemView

            template: contentDisplayItemTpl

            tagName: 'li'

            className: ''


        class ContentDisplayView extends Marionette.CompositeView

            template: contentDisplayTpl

            itemView: ContentItemView

            itemViewContainer: 'ul.cbp_tmtimeline'

            events:
                'click .cbp_tmlabel.completed': 'viewQuestionReadOnly'

            onShow: ->
                responseCollection = Marionette.getOption @, 'responseCollection'

                completedResponses = responseCollection.where 'status': 'completed'

                responseQuestionIDs = _.chain completedResponses
                                        .map (m)->m.toJSON()
                                        .pluck 'content_piece_id'
                                        .value()

                if Marionette.getOption(@, 'mode') is 'training'
                    for question in @$el.find '.contentPiece'
                        $ question
                        .find '.cbp_tmlabel'
                            .addClass 'completed'
                                .css 'cursor', 'pointer'


                else
                    for question in @$el.find '.contentPiece'
                        current_question = $(question).attr 'data-id'
                        current_question = parseInt($(question).attr 'data-id') if _.checkPlatform() is 'Mobile'

                        if _.contains responseQuestionIDs, current_question
                            $ question
                            .find '.cbp_tmlabel'
                                .addClass 'done completed'
                                    .css 'cursor', 'pointer'
                                    

            viewQuestionReadOnly: (e)=>
                questionID = $ e.target
                .closest '.contentPiece'
                    .attr 'data-id'

                @trigger "view:question:readonly", questionID



        # set handlers
        App.commands.setHandler "show:viewgroup:content:displayapp", (opt = {})->
            new Controller.CollectionContentDisplayController opt

