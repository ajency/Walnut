define ['app'
        'controllers/region-controller'],
        (App, RegionController)->

            App.module "TakeQuizApp.SingleQuestion", (SingleQuestion, App)->

                class SingleQuestion.SingleQuestionLayout extends Marionette.Layout

                    template:  '<div id="content-board" class="quizContent no-margin"></div>

                                <div class="well m-b-10 p-t-10 p-b-10 h-center quizActions"> 
                                    <span class="pull-left" id="first_question"></span>
                                    <button type="button" id="previous-question" class="btn btn-info pull-left"> 
                                        <i class="fa fa-backward"></i> Previous 
                                    </button>
                                    {{#allow_submit_answer}}
                                   <button type="button" id="submit-question" class="btn btn-success pull-right">
                                        Submit <i class="fa fa-forward"></i> 
                                    </button>
                                    {{/allow_submit_answer}}

                                    <span class="pull-right" id="last_question"></span>
                                    <button type="button" id="next-question" class="none btn btn-info pull-right">
                                        Next <i class="fa fa-forward"></i> 
                                    </button>

                                    <div class="text-center">
                                        {{#show_hint}}
                                        <button type="button" id="show-hint" class="btn btn-default btn-sm btn-small m-r-10">
                                            <i class="fa fa-lightbulb-o"></i> Hint
                                        </button>
                                        {{/show_hint}}
                                        {{#allow_skip}}
                                        <button type="button" id="skip-question" class="btn btn-default btn-sm btn-small">
                                            Skip <i class="fa fa-step-forward"></i>
                                        </button>
                                        {{/allow_skip}}
                                    </div>
                                    <div class="clearfix"></div>
                                </div>                                

                                <div class="tiles grey text-grey b-grey b-b m-t-30 qstnInfo">
                                    <div class="grid simple m-b-0 transparent"> 
                                        <div class="grid-title no-border"> 
                                            <p class="small-text bold inline text-grey"><span class="fa fa-question"></span> Question Info </p>
                                        </div>
                                        <div class="grid-body no-border"> 
                                            <p class="bold inline text-grey">{{&instructions}}</p>
                                        </div> 
                                        <div class="qstnInfoBod no-border m-t-10 p-b-5 p-r-20 p-l-20"> 
                                            <p class=""></p> 
                                        </div> 
                                    </div>
                                </div>'

                    regions:
                        contentBoardRegion: '#content-board'

                    events:
                        'click #submit-question'    :-> @trigger "validate:answer"

                        'click #previous-question'  :-> @trigger "goto:previous:question"

                        'click #skip-question'      :-> @trigger "skip:question"

                        'click #show-hint'          :-> @trigger 'show:hint:dialog'

                        'click #next-question'      :-> @trigger "goto:next:question"


                    mixinTemplateHelpers:(data)=>

                        responseModel = Marionette.getOption @, 'questionResponseModel'

                        display_mode = Marionette.getOption @, 'display_mode'

                        if display_mode isnt 'replay'
                            
                            data.allow_submit_answer = true

                            data.allow_skip = true if @quizModel.hasPermission 'allow_skip'

                            if @quizModel.hasPermission('allow_hint') and _.trim data.hint
                                data.show_hint =true

                            if responseModel

                                if responseModel.get('status') isnt 'skipped'
                                    data.allow_submit_answer = false

                                if @quizModel.hasPermission 'single_attempt'
                                    data.allow_submit_answer = false

                                if @quizModel.hasPermission 'allow_resubmit'
                                    data.allow_submit_answer = true

                                if responseModel.get('status') is 'paused'
                                    data.allow_submit_answer = true
                                    

                            data.allow_skip = false if not data.allow_submit_answer

                        data

                    initialize:->
                        @quizModel = Marionette.getOption @, 'quizModel'


                    onShow:->
                        if @$el.find('#submit-question').length is 0
                            if @model.id is parseInt _.last @quizModel.get 'content_pieces'
                                @$el.find '#last_question'
                                .html 'This is the last question'
                            else
                                @$el.find '#next-question'
                                .show()

<<<<<<< HEAD
                        if @model.id is parseInt _.first @quizModel.get 'content_pieces'
=======
                        if parseInt(@model.id) is parseInt _.first @quizModel.get 'content_pieces'
>>>>>>> 45c6801dc1cfbb0cc788f94a74371fee0e3e5b38
                            @$el.find '#first_question'
                            .html 'This is the first question'

                            @$el.find '#previous-question'
                            .hide()


                    onAnswerValidated:(isEmptyAnswer)->
                        if isEmptyAnswer
                            if confirm 'You havent completed the question. Are you sure you want to continue?'
                                @submitQuestion()
                        else
                            @submitQuestion()

                    onSubmitQuestion:->

                        if @model.get 'comment'
                            @trigger 'show:comment:dialog'

                        @$el.find "#submit-question"
                        .hide()

                        if @model.id is parseInt _.last @quizModel.get 'content_pieces'
                            @$el.find '#last_question'
                            .html 'This is the last question'

                        else
                            @$el.find "#next-question"
                            .show()

                        @$el.find "#skip-question"
                        .hide()
