define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/view-single-quiz/content-display/item-view'], (App, RegionController)->

    App.module "QuizItemsDisplayApp.ContentCompositeView", (ContentCompositeView, App)->

        class ContentCompositeView.View extends Marionette.CompositeView

            template: '<div id="myCanvas-miki" class="col-md-10"><ul class="cbp_tmtimeline"></ul></div>'

            itemView: ContentCompositeView.ContentItemView.View

            itemViewContainer: 'ul.cbp_tmtimeline'

            itemViewOptions:(model, index)->
                responseCollection= Marionette.getOption @, 'responseCollection'
                if responseCollection
                    responseModel= responseCollection.findWhere "content_piece_id": model.get 'ID'

                data = 
                    studentCollection: Marionette.getOption @, 'studentCollection'
                    responseModel: responseModel if responseModel?

            events:
                'click .cbp_tmlabel.completed': 'viewQuestionReadOnly'

            onShow: ->
                responseCollection = Marionette.getOption @, 'responseCollection'

                if responseCollection
                    completedResponses = responseCollection.where 'status': 'completed'

                    responseQuestionIDs = _.chain completedResponses
                                            .map (m)->m.toJSON()
                                            .pluck 'content_piece_id'
                                            .value()

                    if Marionette.getOption(@, 'mode') is 'training'
                        for question in @$el.find '.contentPiece'
                            $(question).find '.cbp_tmlabel'
                            .addClass 'completed'
                            .css 'cursor', 'pointer'

                    else
                        for question in @$el.find '.contentPiece'
                            if _.contains responseQuestionIDs, parseInt $(question).attr 'data-id'
                                $(question).find '.cbp_tmlabel'
                                .addClass 'done completed'
                                .css 'cursor', 'pointer'

            viewQuestionReadOnly: (e)=>
                questionID = $ e.target
                .closest '.contentPiece'
                    .attr 'data-id'

                @trigger "view:question:readonly", questionID
