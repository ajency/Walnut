define ['app'
        'controllers/region-controller'], (App, RegionController)->
    App.module "SingleQuestionDisplayApp", (SingleQuestion, App)->
        class SingleQuestion.SingleQuestionController extends RegionController

            initialize: (opts)->
                {model,questionResponseModel,@timerObject, @display_mode} = opts

                @view = view = @_showQuestionView model,questionResponseModel

                @show view, (loading: true)

                @timerObject.setHandler "get:elapsed:time", ()=>
                    timerTime= $ @view.el
                                .find '.cpTimer'
                                .TimeCircles()
                                .getTime()

                    timeElapsed = 15 - timerTime

                    timeElapsed


            _showQuestionView: (model,questionResponseModel) =>
                new QuestionDisplayView
                    model: model
                    display_mode: @display_mode

                    templateHelpers:
                        timeLeftOrElapsed:=>
                            timeTaken= parseInt questionResponseModel.get 'time_taken'
                            timer= 15 - timeTaken




        class QuestionDisplayView extends Marionette.ItemView

            template: '<div class="tiles white grid simple vertical blue m-b-0">
                      <div class="grid-body no-border">
            							<div class="p-t-10">
            								<div class="row">
            									<div class="col-sm-9">
            									  <div class="row m-b-10">
            						                <div class="col-xs-4 b-grey b-r">
            						                  <label class="form-label bold small-text">Class</label>
            											4
            						                </div>
            						                <div class="col-xs-4 b-grey b-r">
            						                  <label class="form-label bold small-text">Subject</label>
            											Science
            						                </div>
            						                <div class="col-xs-4 b-grey b-r">
            						                  <label class="form-label bold small-text">Chapter</label>
            											Internal Organs of the Body
            						                </div>
            						              </div>
            						              <div class="row">
            						                <div class="col-xs-4 b-grey b-r">
            						                  <label class="form-label bold small-text">Section</label>
            											Internal & External
            						                </div>
            						                <div class="col-xs-4 b-grey b-r">
            						                  <label class="form-label bold small-text">Sub-Section</label>
            											-
            						                </div>
            						                <div class="col-xs-4 b-grey b-r">
            						                  <label class="form-label bold small-text">Type</label>
            											Difficult
            						                </div>
            						              </div>
            				          			</div>
            						        	<div class="col-sm-3">
            						        		<div class="cpTimer" data-timer="{{timeLeftOrElapsed}}"></div>
            						        	</div>
            						    	</div>
            				          	</div>
            				        </div>
                    </div>
                    <div class="tiles blue p-l-15 p-r-15">
                      <div class="tiles-body no-border">
                        <div class="row">
                                <div class="col-md-3 col-sm-3">
                                  <h3 class="text-white m-t-0 m-b-0 semi-bold time timedisplay"> <i class="fa fa-clock-o"></i> </h3>
                                </div>
                                <div class="col-md-3 col-sm-3 text-center">
                                  <a href="#" class="hashtags transparent"> <i class="fa fa-question"></i> View Info </a>
                                </div>
                                <div class="col-md-3 col-sm-3 text-center">
                                  <a href="#" class="hashtags transparent"> <i class="fa fa-eye"></i> View Answer </a>
                                </div>
                                <div class="col-md-3 col-sm-3 text-right">
                                  <a href="#" class="hashtags transparent"> <i class="fa fa-check"></i> Done </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="teacherCanvas ">
            						<div class="grid-body p-t-20 p-b-15 no-border"></div>
            					</div>

            					<div class="tiles grey text-grey p-t-10 p-l-15 p-r-10 p-b-10 b-grey b-b">
            				    	<p class="bold small-text">Question Info: </p>
            				    	<p class="">{{post_title}}</p>
            				    </div>'

            onShow:->
                console.log Marionette.getOption @, 'display_mode'
                if Marionette.getOption(@, 'display_mode') is 'class_mode'
                    qTimer = @$el.find 'div.cpTimer'

                    qTime= qTimer.data 'timer'
                    timerColor = '#1ec711'

                    if qTime <10
                        timerColor = '#f8a616'

                    if qTime <0
                        timerColor = '#ea0d0d'

                    qTimer.TimeCircles
                        time:
                            Days:
                                show:false
                            Hours:
                                show:false
                            Minutes:
                                color: timerColor
                            Seconds:
                                color: timerColor

                        circle_bg_color: "#EBEEF1"
                        bg_width: 0.2

                    .addListener (unit,value,total)->
                        if total is 10
                            qTimer.data 'timer',10
                            qTimer.TimeCircles
                                time:
                                    Days:
                                        show:false
                                    Hours:
                                        show:false
                                    Minutes:
                                        color: '#f8a616'
                                    Seconds:
                                        color: '#f8a616'
                        else if total is 5
                            alert 'The expected time for this question is almost over.'

                        else if total is -1
                                qTimer.TimeCircles
                                    time:
                                        Days:
                                            show:false
                                        Hours:
                                            show:false
                                        Minutes:
                                            color: '#ea0d0d'
                                        Seconds:
                                            color: '#ea0d0d'



        # set handlers
        App.commands.setHandler "show:single:question:app", (opt = {})->
            new SingleQuestion.SingleQuestionController opt

