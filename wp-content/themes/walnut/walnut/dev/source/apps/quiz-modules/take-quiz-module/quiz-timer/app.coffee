define ['app'
        'controllers/region-controller'],
        (App, RegionController)->

            App.module "TakeQuizApp.QuizTimer", (QuizTimer, App)->
                class QuizTimer.Controller extends RegionController

                    initialize: (opts)->
                        {@model,@display_mode, @timerObject, @quizResponseSummary} = opts

                        time_taken= parseInt @quizResponseSummary.get 'total_time_taken'

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

                        @listenTo view, 'end:quiz', -> @region.trigger 'show:alert:popup', 'end_quiz'
                        @listenTo view, 'quiz:time:up', -> @region.trigger 'show:alert:popup', 'quiz_time_up','alert'

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

                    template: '<div class="bold small-text text-center p-t-10"> Quiz Time</div>
                                <div id="downUpTimer" timerdirection=""></div>
                                <div class="b-grey m-b-10 p-b-5" style="display:none" id="completed-quiz"> 
                                    <div class="qstnStatus"><i class="fa fa-check-circle"></i> Completed</div> 
                                </div>
                                <div class="endQuiz b-grey b-t p-t-10 p-b-10">
                                    <button type="button" id="end-quiz" class="btn btn-white block h-center"> End Quiz </button> 
                                </div>'

                    events:
                        'click #end-quiz' :-> @trigger "end:quiz"

                    onShow:->

                        timeLeftOrElapsed =Marionette.getOption @,'timeLeftOrElapsed'
                        @display_mode = Marionette.getOption @, 'display_mode'

                        if @display_mode is 'replay'
                            @$el.find '#completed-quiz'
                            .show()

                        else
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
                        @trigger "quiz:time:up"
