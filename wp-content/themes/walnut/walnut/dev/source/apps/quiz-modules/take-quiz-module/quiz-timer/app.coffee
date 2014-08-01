define ['app'
        'controllers/region-controller'],
        (App, RegionController)->

            App.module "TakeQuizApp.QuizTimer", (QuizTimer, App)->
                class QuizTimer.Controller extends RegionController

                    initialize: (opts)->
                        {@model,@display_mode} = opts

                        @durationInSeconds = @model.get('duration') * 60

                        @view = view = @_showQuizTimerView @model

                        @show view,
                            loading: true

                        @listenTo view, 'end:quiz', -> @region.trigger 'end:quiz'

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
                                <div class="endQuiz b-grey b-t p-t-10 p-b-10">
                                    <button type="button" id="end-quiz" class="btn btn-white block h-center"> End Quiz </button> 
                                </div>'

                    events:
                        'click #end-quiz' :-> @trigger "end:quiz"

                    onShow:->

                        timeLeftOrElapsed =Marionette.getOption @,'timeLeftOrElapsed'
                        @display_mode = Marionette.getOption @, 'display_mode'

                        if @display_mode is 'quiz_mode'
                            if timeLeftOrElapsed < 0
                                @countUp timeLeftOrElapsed
                            else @countDown timeLeftOrElapsed

                    countDown:(time)=>

                        @$el.find '#downUpTimer'
                        .attr 'timerdirection','countDown'
                        .countdown 'destroy'
                        .countdown
                            until: time
                            format: 'MS'
                            onExpiry: @countUp

                    countUp:(time=0)=>

                        @$el.find '#downUpTimer'
                        .attr 'timerdirection','countUp'
                        .addClass 'negative'
                        .countdown 'destroy'
                        .countdown since: time, format: 'MS'
