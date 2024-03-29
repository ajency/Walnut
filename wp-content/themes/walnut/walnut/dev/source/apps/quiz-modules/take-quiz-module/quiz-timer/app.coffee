define ['app'
        'controllers/region-controller'
        'bootbox'],
        (App, RegionController,bootbox)->

            App.module "TakeQuizApp.QuizTimer", (QuizTimer, App)->
                class QuizTimer.Controller extends RegionController

                    initialize: (opts)->
                        {@model,@display_mode, @timerObject, @quizResponseSummary} = opts

                        if @quizResponseSummary
                            time_taken= parseInt @quizResponseSummary.get 'total_time_taken'

                        time_taken =0 if not time_taken

                        total_time = parseInt(@model.get('duration')) * 60

                        @durationInSeconds = total_time-time_taken

                        @timerObject.setHandler "get:elapsed:time", ()=>

                            timerTimePeriod = $ @view.el
                            .find '#downUpTimer'
                                .countdown 'getTimes'

                            if timerTimePeriod
                                timerTime= $.countdown.periodsToSeconds timerTimePeriod

                                timerSign= $ @view.el
                                .find '#downUpTimer'
                                    .attr 'timerdirection'

                                if timerSign is 'countDown'
                                    timeElapsed = @durationInSeconds - timerTime

                                else
                                    timeElapsed = @durationInSeconds + timerTime

                                timeElapsed

                        @view = view = @_showQuizTimerView @model

                        @show view,
                            loading: true

                        @listenTo view, 'end:quiz', -> @region.trigger 'end:quiz'
                        @listenTo view, 'show:single:quiz:app', -> @region.trigger 'show:single:quiz:app'

                    _timeLeftOrElapsed : =>
                        timeTaken = 0

                        responseTime = @questionResponseModel.get('time_taken') if @questionResponseModel

                        if responseTime and responseTime isnt 'NaN'
                            timeTaken = responseTime

                        timer = @durationInSeconds - timeTaken
                        timer

                    _showQuizTimerView: (model) =>
                        
                        new QuizTimerView
                            model           : model
                            display_mode    : @display_mode 
                            timeLeftOrElapsed : @_timeLeftOrElapsed()


                class QuizTimerView extends Marionette.ItemView

                    className: 'timerBox'

                    template: '<div class="container-grey">
                                    <div class="timerStrip"><span class="fa fa-clock-o"></span></div>

                                    <div class="bold small-text text-center p-t-10"> Quiz Time</div>
                                
                                    {{#completed_quiz}}
                                        <div class="b-grey m-b-10 p-b-5" id="completed-quiz"> 
                                            <div class="qstnStatus text-center"><i class="fa fa-check-circle"></i> Completed</div> 
                                        </div>
                                        <div class="endQuiz b-grey b-t p-t-10 p-b-10">
                                            <button type="button" id="end-replay" class="btn btn-white block h-center"> End Replay </button> 
                                        </div>
                                    {{/completed_quiz}}

                                    {{^completed_quiz}}
                                        <div id="downUpTimer" timerdirection=""></div>
                                        <div class="endQuiz b-grey b-t p-t-10 p-b-10">
                                            <button type="button" id="end-quiz" class="btn btn-white block h-center"> End Quiz </button> 
                                        </div>
                                    {{/completed_quiz}}
                                </div>

                                <div class="container-grey m-b-5 m-t-5 p-t-10 p-r-10 p-b-10 p-l-20">
                                    <label class="form-label bold small-text muted no-margin inline">Question Info: </label>
                                    <p class="inline text-grey small">Testing Question instruction. with hints and comment.</p>
                                </div>'

                    events:
                        'click #end-quiz'   : 'endQuiz'
                        'click #end-replay' : 'endReplay'

                    mixinTemplateHelpers:(data)->
                        @display_mode = Marionette.getOption @, 'display_mode'

                        if @display_mode in ['replay','quiz_report']
                            data.completed_quiz = true

                        data

                    onShow:->

                        timeLeftOrElapsed =Marionette.getOption @,'timeLeftOrElapsed'
                        @display_mode = Marionette.getOption @, 'display_mode'

                        if @display_mode not in ['replay','quiz_report']
                            if timeLeftOrElapsed >= 0
                                @countDown timeLeftOrElapsed

                    countDown:(time)=>

                        @$el.find '#downUpTimer'
                        .attr 'timerdirection','countDown'
                        .countdown 'destroy'
                        .countdown
                            until: time
                            format: 'MS'
                            onExpiry: @quizTimedOut

                    quizTimedOut:=>
                        @trigger "end:quiz"
                        msgContent= @model.getMessageContent 'quiz_time_up'
                        bootbox.alert msgContent,=>
                            @trigger "show:single:quiz:app"


                    endQuiz:->                        
                        msgContent= @model.getMessageContent 'end_quiz'
                        bootbox.confirm msgContent,(result)=>
                            if result
                                @trigger "end:quiz"
                                @trigger "show:single:quiz:app"


                    endReplay:->                        
                        @trigger "show:single:quiz:app"
                            