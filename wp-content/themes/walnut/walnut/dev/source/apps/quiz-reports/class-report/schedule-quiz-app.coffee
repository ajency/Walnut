define ['app'
        'controllers/region-controller'
],(App,RegionController)->
    App.module 'ScheduleQuizPopup', (ScheduleQuizPopup,App)->

        class ScheduleQuizPopup.Controller extends RegionController

            initialize : (options)->

                {@division, @quizModel} = options

                @view = @_getScheduleQuizView()

                @show @view

                @listenTo @view, 'close:popup:dialog',->
                    @region.closeDialog()     

                @listenTo @view, 'save:quiz:schedule', (from,to)->

                    @quizModel.set
                        'schedule':
                            'from' : from
                            'to'   : to

                    data = 
                        quiz_id     : @quizModel.id
                        division    : @division
                        schedule    :
                            from    : from
                            to      : to

                    schedule = App.request "save:quiz:schedule", data

                    schedule.done (response)=>
                        @view.triggerMethod "schedule:saved", response



            _getScheduleQuizView :=>
                new ScheduleQuizView
                    model        : @quizModel

        class ScheduleQuizView extends Marionette.ItemView

            template: '<form>
            <!--div id="datetimepicker3" class="input-append">
    <input data-format="hh:mm:ss" type="text"></input>
    <span class="add-on">
      <i data-time-icon="icon-time" data-date-icon="icon-calendar">
      </i>
    </span>
  </div-->
                        <div class="row">
                            
                            <div class="input-daterange">
                                  <div class="col-md-6">
                                    From: <br>
                                    <div class="input-append success date">
                                          <input id="scheduleFrom" name="scheduleFrom" type="text" required="required" value="{{schedule.from}}" placeholder="Select Date" class="input-small span12">
                                            <span class="add-on"><span class="arrow"></span><i class="fa fa-calendar"></i></span>
                                            </span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    To:  <br>
                                    <div class="input-append success date">
                                      <input id="scheduleTo" name="scheduleTo" type="text" required="required" value="{{schedule.to}}" placeholder="Select Date" class="input-small span12">
                                      <span class="add-on"><span class="arrow"></span><i class="fa fa-calendar"></i></span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <button type="button" class="clear btn btn-success m-t-20 pull-left">Schedule Quiz</button>
                                    <div class=" p-l-10 p-t-30 pull-left success-msg"></div>
                                </div>
                            </div>
                        </div>
                    </form>'

            events:
                'click .btn-success'    : 'saveScheduled'

            initialize:->
                @dialogOptions = 
                    modal_title : 'Schedule Quiz'
                    modal_size  : 'small'

            onShow: ->

                today = new Date();
                console.log today
                #@$el.find '#datetimepicker3'
                #.datetimepicker
                #    language:'pt-BR'

                #@$el.find '.input-daterange'
                @$el.find '#scheduleFrom'
                .datetimepicker
                    #dayOfWeekStart : 1
                    #lang:'en'
                    format: 'Y-m-d H:i'
                    #setStartDate: 
                    minDate:0
                    startDate: today
                    #todayHighlight  : true
                    #formatTime: 'g:i A'
                    formatTime: 'H:i'

                .on 'hide', (e)=>
                    if e.target.id is 'scheduleFrom'
                        #console.log "datte"
                        @$el.find('#scheduleTo').datetimepicker 'startDate', e.date

                @$el.find '#scheduleTo'
                .datetimepicker
                    #dayOfWeekStart : 1
                    #lang:'en'
                    format: 'Y-m-d H:i'
                    #startDate: @$el.find '#scheduleFrom'
                    #.val()
                    #formatTime: 'g:i A'
                    formatTime: 'H:i'


            saveScheduled: (e)=>
                if @$el.find('form').valid()


                    scheduleFrom = @$el.find '#scheduleFrom'
                    .val()
                    #console.log scheduleFrom
                    scheduleTo = @$el.find '#scheduleTo'
                    .val()
                    console.log (scheduleFrom < scheduleTo)
                    if (scheduleFrom < scheduleTo) == 'false'
                        @$el.find '.success-msg'
                        .html 'From has to be less than To'
                        .addClass 'text-error'
                    else     
                    #console.log scheduleTo
                        @trigger "save:quiz:schedule", scheduleFrom, scheduleTo

            onScheduleSaved:(response)->
                @$el.find '.success-msg'
                .html ''
                .removeClass 'text-success, text-error'

                if response.code is 'ERROR'
                    @$el.find '.success-msg'
                    .html 'Failed to save schedule'
                    .addClass 'text-error'

                else
                    @$el.find '.success-msg'
                    .html 'Saved Successfully'
                    .addClass 'text-success'

                    setTimeout =>
                        @trigger 'close:popup:dialog'
                    ,500

        App.commands.setHandler 'show:schedule:quiz:popup',(options)->
            new ScheduleQuizPopup.Controller options
