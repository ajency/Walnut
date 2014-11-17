define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/view-single-quiz/content-display/item-view'], (App, RegionController)->

    App.module "QuizItemsDisplayApp.ContentCompositeView", (ContentCompositeView, App)->

        class ContentCompositeView.View extends Marionette.CompositeView

            template    : '<div style="display:none" class="tiles grey m-t-20 text-grey p-t-10 p-l-15 p-r-10 p-b-10 b-grey b-b" id="teacher-check">
                                Your answers are sent for evaluation. 
                                You will be notified as soon as the results are out on your registered email and phone number
                            </div>
                            <div id="myCanvas-miki" class="col-md-10"><ul class="cbp_tmtimeline"></ul></div>'

            itemView    : ContentCompositeView.ContentItemView.View

            itemViewContainer: 'ul.cbp_tmtimeline'

            itemViewOptions:(model, index)->
                responseCollection= Marionette.getOption @, 'responseCollection'

                if responseCollection
                    responseModel= responseCollection.findWhere "content_piece_id": model.get 'ID'

                data = 
                    quizModel: @model
                    responseModel: responseModel if responseModel?
