define ['app'
        'controllers/region-controller'
        'text!apps/teachers-dashboard/teacher-teaching-module/module-description/templates/module-description-template.html'], (App, RegionController, moduleDescriptionTemplate)->
    App.module "TeacherTeachingApp.ModuleDescription", (ModuleDescription, App)->
        class ModuleDescriptionController extends RegionController

            initialize: (opts)->
                {model,@questionResponseModel,@questionResponseCollection,@timerObject} = opts

                @view = view = @_showModuleDescriptionView model

                @show view, (loading: true)

                @listenTo @view, "goto:previous:route", =>
                    if @questionResponseModel.get('status') isnt 'completed'
                        elapsedTime = @timerObject.request "get:elapsed:time"

                        @questionResponseModel.set
                            'time_taken': elapsedTime
                            'status': 'paused'

                        @questionResponseModel.save()

                    @region.trigger "goto:previous:route"


            _showModuleDescriptionView: (model) =>
                terms = model.get 'term_ids'

                numOfQuestionsCompleted = _.size @questionResponseCollection.where "status": "completed"
                totalNumofQuestions = _.size model.get 'content_pieces'
                totalTimeTakenForModule =   _.reduce @questionResponseCollection.pluck('time_taken'), (memo, num)-> parseInt memo + parseInt num

                console.log totalTimeTakenForModule
                new ModuleDescriptionView
                    model: model

                    templateHelpers:
                        getProgressData:->
                            numOfQuestionsCompleted + '/'+ totalNumofQuestions

                        getProgressPercentage:->
                            parseInt (numOfQuestionsCompleted / totalNumofQuestions)*100

                        moduleTime:->
                            hours=0
                            time= totalTimeTakenForModule
                            mins=parseInt(time/60)
                            if mins >59
                                hours = parseInt mins/60
                                mins= mins%60
                            seconds = time%60

                            time =hours+'h ' +mins + 'm '+ seconds+'s'


        class ModuleDescriptionView extends Marionette.ItemView

            className: 'pieceWrapper'

            template: moduleDescriptionTemplate

            events:
                'click #back-to-module, #pause-session': ->
                    @trigger "goto:previous:route"

            onShow: ->
                clock = setInterval @updateTime, 500

            updateTime: =>
                if _.size($('#timekeeper')) > 0
                    @$el.find '.timedisplay'
                    .html '<i class="fa fa-clock-o"></i> ' + $('#timekeeper').html()


        # set handlers
        App.commands.setHandler "show:teacher:teaching:module:description", (opt = {})->
            new ModuleDescriptionController opt