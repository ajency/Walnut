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

                quizModel = Marionette.getOption @, 'quizModel'

                data.dateCompleted= 'N/A'

                if responseModel

                    data.dateCompleted= moment(responseModel.get('end_date')).format("Do MMM YYYY")

                    data.timeTaken =$.timeMinSecs responseModel.get 'time_taken'

                    data.responseStatus = responseModel.get 'status'

                    data.display_answer = quizModel.hasPermission 'display_answer'

                    marks_obtained = responseModel.get 'marks_scored'

                    data.marks_obtained= parseFloat parseFloat(marks_obtained).toFixed 1

                    total_marks= @model.get 'marks'
                    
                    data.total_marks= parseFloat total_marks.toFixed 1

                    data.hint_viewed = if responseModel.get('question_response').hint_viewed then 'Yes' else 'No'

                    data.hint = false if not quizModel.hasPermission 'allow_hint'

                    if(@.model.get('comment') != '')
                        data.comment = @.model.get 'comment'
                        if $(window).width() < 1400
                            if comment.length > 61
                                data.comment_modal = true
                                data.comment = comment
                        else if $(window).width() > 1401
                                if comment.length > 74
                                    data.comment_modal = true
                                    data.comment = comment

                    data.statusUI= switch data.responseStatus
                        when 'correct_answer'     then divClass : 'text-success', text : 'Correct', icon : 'fa-check'
                        when 'partially_correct'  then divClass : 'text-success', text : 'Partially Correct', icon : 'fa-check-square'
                        when 'skipped'            then divClass : 'text-warning', text : 'Skipped', icon : 'fa-share-square'
                        when 'wrong_answer'       then divClass : 'text-error', text : 'Wrong', icon : 'fa-times'

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
