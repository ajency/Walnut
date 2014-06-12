define ['app'
        'controllers/region-controller'
        'text!apps/content-group/view-group/content-display/templates/content-display-item.html'], (App, RegionController, contentDisplayItemTpl)->
    App.module "CollectionContentDisplayApp.Controller", (Controller, App)->
        class Controller.CollectionContentDisplayController extends RegionController

            initialize: (opts)->
                {model, @mode, questionResponseCollection,groupContentCollection, @studentCollection} = opts

                @view = view = @_getCollectionContentDisplayView model, groupContentCollection, questionResponseCollection

                @show view, (loading: true, entities: [groupContentCollection, questionResponseCollection])

                @listenTo @view, 'view:question:readonly', (questionID)=>
                    @region.trigger 'goto:question:readonly', questionID

            _getCollectionContentDisplayView: (model, collection, responseCollection) =>
#                timeTakenArray= responseCollection.pluck('time_taken');
#                totalTimeTakenForModule=0
#                if _.size(timeTakenArray)>0
#                    totalTimeTakenForModule =   _.reduce timeTakenArray, (memo, num)-> parseInt memo + parseInt num


                new ContentDisplayView
                    model: model
                    collection: collection
                    responseCollection: responseCollection
                    studentCollection: @studentCollection
                    mode: @mode

#                    templateHelpers:
#                        showElapsedTime:=>
#                            hours=0
#                            time= totalTimeTakenForModule
#                            mins=parseInt totalTimeTakenForModule/60
#                            if mins >59
#                                hours = parseInt mins/60
#                                mins= parseInt mins%60
#                            seconds = parseInt time%60
#                            display_time=''
#
#                            if hours >0
#                                display_time= hours+'h '
#
#                            display_time += mins + 'm '+ seconds+'s'
#                            display_time

        class ContentItemView extends Marionette.ItemView

            template: contentDisplayItemTpl

            tagName: 'li'

            className: ''

            mixinTemplateHelpers:(data)->
                additionalData = Marionette.getOption @, 'additionalData'
                data.dateCompleted= additionalData.dateCompleted
                data.question_type= _.str.capitalize data.question_type
                if additionalData.responseStatus
                    data.responseStatus= additionalData.responseStatus
                    data.timeTaken = additionalData.timeTaken
                    data.correctAnswer = additionalData.correctAnswer
                    data.teacherName = additionalData.teacherName
                data

            onShow:->
                content_icon= 'fa-question'

                if @model.get 'content_type' is 'content_piece'
                    content_icon= 'fa-youtube-play'

                @$el.find '.cbp_tmicon .fa'
                .addClass content_icon

                if @model.get('content_type') is 'content_piece'
                    @$el.find '#correct-answer-div, .question-type-div'
                    .remove()


        class ContentDisplayView extends Marionette.CompositeView

            template: '<div id="myCanvas-miki" class="col-md-10"><ul class="cbp_tmtimeline"></ul></div>'

            itemView: ContentItemView

            itemViewContainer: 'ul.cbp_tmtimeline'

            itemViewOptions:(model, index)->
                responseCollection= Marionette.getOption @, 'responseCollection'

                responseModelArray= responseCollection.where "content_piece_id": model.get 'ID'

                responseModel= responseModel for responseModel in responseModelArray

                additionalData={}

                additionalData.dateCompleted= 'N/A'

                if responseModel

                    if responseModel.get('status') is 'completed'
                        additionalData.responseStatus= responseModel.get 'status'

                        time= responseModel.get 'time_taken'
                        mins=parseInt(time/60)
                        if mins >59
                            mins= parseInt mins%60
                        seconds = parseInt time%60

                        additionalData.timeTaken = mins + 'm '+ seconds+'s'

                        additionalData.dateCompleted= moment(responseModel.get('end_date')).format("Do MMM YYYY")

                        additionalData.correctAnswer= @getResults model, responseModel.get 'question_response'

                        additionalData.teacherName= responseModel.get 'teacher_name'

                    console.log additionalData

                data=
                    model : model
                    additionalData: additionalData


            getResults:(model,question_response)=>
                correct_answer='No One'
                names=[]
                studentCollection= Marionette.getOption @, 'studentCollection'
                if model.get('question_type') is 'chorus'
                    if question_response
                        correct_answer= CHORUS_OPTIONS[question_response]
                else
                    for studID in question_response
                        answeredCorrectly = studentCollection.where("ID": studID)
                        name= ans.get('display_name') for ans in answeredCorrectly
                        names.push(name)

                    if _.size(names)>0
                        student_names=names.join(', ')
                        correct_answer= _.size(names)+ ' Students ('+ student_names+ ')'

                correct_answer

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
                        if _.contains responseQuestionIDs, parseInt $(question).attr 'data-id'
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

