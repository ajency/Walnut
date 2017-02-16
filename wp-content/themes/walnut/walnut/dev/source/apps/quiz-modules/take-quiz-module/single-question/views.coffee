define ['app'
        'controllers/region-controller'
        'bootbox'
        'text!apps/quiz-modules/take-quiz-module/single-question/templates/question-area-tpl.html'],
        (App, RegionController,bootbox, questionAreaTemplate)->

            App.module "TakeQuizApp.SingleQuestion", (SingleQuestion, App)->

                class SingleQuestion.SingleQuestionLayout extends Marionette.Layout

                    template:  questionAreaTemplate

                    regions:
                        contentBoardRegion: '#content-board'

                    events:
                        'click #submit-question'    : 'submitQuest' 

                        'click #previous-question'  :-> @trigger "goto:previous:question"

                        'click #skip-question'      : 'skipQuest'

                        'click #show-hint'          :-> 
                            console.log @model.get 'hint'
                            bootbox.alert @model.get 'hint'
                            @trigger 'show:hint:dialog'

                        'click #next-question'      :-> @trigger "goto:next:question"

                    skipQuest:=>
                        localStorage.button = 'skip'

                        @$el.find '.submit-single'
                        .attr 'disabled', 'disabled'
                        @$el.find '.skip-button'
                        .attr 'disabled', 'disabled'

                        @$el.find '.errorSubmitMsg'
                        .addClass 'hide'

                        @trigger "skip:question"

                    submitQuest:=>
                        localStorage.button = 'submit'

                        @$el.find '.submit-single'
                        .attr 'disabled', 'disabled'
                        @$el.find '.skip-button'
                        .attr 'disabled', 'disabled'

                        @$el.find '.errorSubmitMsg'
                        .addClass 'hide'
                        
                        @trigger "validate:answer"

                        if $('#collapseView').hasClass('in')
                            $('.submit2').addClass 'submit-pushed'

                    mixinTemplateHelpers:(data)=>
                        console.log @quizModel

                        responseModel = Marionette.getOption @, 'questionResponseModel'

                        display_mode = Marionette.getOption @, 'display_mode'

                        if @quizModel.hasPermission('allow_hint') and _.trim data.hint
                            data.show_hint =true

                        if display_mode is 'replay'
                            data.showComment = true
                            data.replay = true

                        else
                            data.replay = false 
                            data.show_skip = true

                            data.allow_submit_answer = true

                            if @quizModel.hasPermission('single_attempt') and not @quizModel.hasPermission 'allow_resubmit'
                                data.show_skip_helper_text=true

                            if responseModel

                                if responseModel.get('status') isnt 'skipped'
                                    data.allow_submit_answer = false

                                if @quizModel.hasPermission 'single_attempt'
                                    data.allow_submit_answer = false
                                    data.show_skip = false

                                if @quizModel.hasPermission 'allow_resubmit'
                                    data.allow_submit_answer = true

                                if responseModel.get('status') is 'paused'
                                    data.allow_submit_answer = true
                                    
                                if responseModel.get('status') not in ['skipped','paused']
                                    data.show_skip = false


                            data.allow_skip = false if not data.allow_submit_answer
                        console.log data

                        data

                    initialize:->
                        @quizModel = Marionette.getOption @, 'quizModel'
                        if ((@quizModel.get('quiz_type') == 'practice') && @quizModel.hasPermission 'display_answer')
                            result = @quizModel.get 'permissions'
                            result.single_attempt = true

                    onShow:->
                        if @$el.find('#submit-question').length is 0
                            if @model.id is parseInt _.last @quizModel.get 'content_pieces'
                                @$el.find '#last_question'
                                .html 'This is the last question'
                                @$el.find '#next-question'
                                .hide()
                            else
                                @$el.find '#next-question'
                                .show()
                                
                        if $('#collapseView').hasClass('in')
                            $('.submit2').addClass 'submit-pushed'

                        if parseInt(@model.id) is parseInt _.first @quizModel.get 'content_pieces'
                            @$el.find '#first_question'
                            .html 'This is the first question'

                            @$el.find '#previous-question'
                            .hide()

                    onSubmitQuestion:->
                        # @$el.find "#submit-question"
                        # .hide()

                        # if $('#collapseView').hasClass('in')
                        #     $('.submit2').addClass 'submit-pushed'    
                            

                        if @model.id is parseInt _.last @quizModel.get 'content_pieces'
                            @$el.find '#last_question'
                            .html 'This is the last question'
                            bootbox.alert 'You have completed the quiz. Now click on end quiz to view your quiz summary'

                        else
                            @$el.find "#next-question"
                            .show()

                            # setTimeout =>
                            #     @trigger "goto:next:question"                        
                            # ,3000

                        # @$el.find "#skip-question"
                        # .hide()

                    onEnableSubmit:=>
                        @$el.find '.submit-single'
                        .attr 'disabled', false
                        @$el.find '.skip-button'
                        .attr 'disabled', false


                    onDisplayError:->
                        @$el.find '.errorSubmitMsg'
                        .removeClass 'hide'

                        @$el.find '.skip-button'
                        .attr 'disabled', false
