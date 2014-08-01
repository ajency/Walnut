define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/view-single-quiz/content-display/templates/content-display-item.html'], 
(App, RegionController, contentDisplayItemTpl)->
    
    App.module "QuizItemsDisplayApp.ContentCompositeView.ContentItemView", (ContentItemView, App)->

        class ContentItemView.View extends Marionette.ItemView

            template: contentDisplayItemTpl

            tagName: 'li'

            mixinTemplateHelpers:(data)->
                responseModel = Marionette.getOption @, 'responseModel'

                data.dateCompleted= 'N/A'

                if responseModel

                    data.dateCompleted= moment(responseModel.get('end_date')).format("Do MMM YYYY")

                    data.timeTaken = @formatTimeTaken  responseModel.get 'time_taken'

                    data.responseStatus = responseModel.get 'status'

                    data.statusUI= switch data.responseStatus
                        when 'correct_answer'     then divClass : 'text-right', text : 'Correct', icon : 'fa-check'
                        when 'partially_correct'  then divClass : 'text-right', text : 'Parially Correct', icon : 'fa-check-square'
                        when 'skipped'            then divClass : 'text-error', text : 'Skipped', icon : 'fa-share-square'
                        when 'wrong_answer'       then divClass : 'text-error', text : 'Wrong', icon : 'fa-times'

                console.log data        
                data

            formatTimeTaken:(time)->
                mins=parseInt(time/60)
                if mins >59
                    mins= parseInt mins%60
                seconds = parseInt time%60

                timeTaken = mins + 'm '+ seconds+'s'

            getResults:(question_response)=>
                correct_answer='No One'

                names=[]
                studentCollection= Marionette.getOption @, 'studentCollection'

                if @model.get('question_type') is 'chorus'
                    correct_answer= CHORUS_OPTIONS[question_response] if question_response?

                else if @model.get('question_type') is 'individual'

                    for studID in question_response
                        answeredCorrectly = studentCollection.where("ID": studID)
                        name= ans.get('display_name') for ans in answeredCorrectly
                        names.push(name)

                    if _.size(names)>0
                        student_names=names.join(', ')
                        correct_answer= _.size(names)+ ' Students ('+ student_names+ ')'

                else
                     correct_answer = _.size(_.pluck(question_response, 'id')) + ' Students'

                correct_answer

            onShow:->
                content_icon= 'fa-question'

                if @model.get 'content_type' is 'content_piece'
                    content_icon= 'fa-youtube-play'

                @$el.find '.cbp_tmicon .fa'
                .addClass content_icon

                if @model.get('content_type') is 'content_piece'
                    @$el.find '#correct-answer-div, .question-type-div'
                    .remove()
