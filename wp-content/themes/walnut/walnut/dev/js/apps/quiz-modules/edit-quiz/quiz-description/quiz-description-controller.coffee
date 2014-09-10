define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/edit-quiz/quiz-description/quiz-description-views'
], (App, RegionController, collectionDetailsTpl)->
    App.module "QuizModuleApp.EditQuiz.QuizDetails", (QuizDetails, App)->

        class QuizDetails.Controller extends RegionController

            initialize : (opts)->
                {@model}= opts
                @message = @model.get('message')

                @view = @_getQuizDetailsView()

                @listenTo @view, 'show:custom:msg:popup',(options)=>
                    slug = options.slug
                    if not @message[slug]? then  @message[slug]=''

                    App.execute 'show:single:edit:popup',
                        title :  slug
                        textArray : @message

                @listenTo @view, "save:quiz:details" , (data) =>
                    @model.set 'changed' , 'quiz_details'
                    @model.save(data, { wait : true, success : @successFn, error : @errorFn })
                    @region.trigger "close:content:selection:app" if data.status isnt 'underreview'

                @show @view,
                    loading : true

            successFn : (model)=>
                App.navigate "edit-quiz/#{model.get('id')}"
                @view.triggerMethod 'saved:quiz', model

            errorFn : ->
                console.log 'error'


            _getQuizDetailsView : ->
                new QuizDetails.Views.DeatailsView
                    model : @model


        # set handlers
        App.commands.setHandler "show:edit:quiz:details", (opt = {})->
            new QuizDetails.Controller opt

