define ['app'
        'controllers/region-controller'
        'text!apps/take-module-item/module-description/templates/module-description-template.html'], (App, RegionController, moduleDescriptionTemplate)->
    App.module "TeacherTeachingApp.ModuleDescription", (ModuleDescription, App)->
        class ModuleDescriptionController extends RegionController

            initialize: (opts)->
                {@model,@questionResponseModel,@questionResponseCollection,@timerObject,@display_mode} = opts

                @currentItemID = @questionResponseModel.get 'content_piece_id'

                @nextItemID = @_getNextItemID(@currentItemID)

                @view = view = @_showModuleDescriptionView @model

                @show view,
                    loading: true
                    entities: [@model,@questionResponseModel]

                @listenTo @view, "goto:previous:route", =>
                    @region.trigger "goto:previous:route"

                @listenTo view, "question:completed", @_changeQuestion

            _changeQuestion:=>
                @region.trigger "goto:next:question"
                @nextItemID= @_getNextItemID @nextItemID
                @view.triggerMethod "question:changed", @nextItemID

            _getNextItemID :(item_id) =>
                contentPieces = @model.get 'content_pieces'
                contentPieces = _.map contentPieces, (m)->
                    parseInt m

                pieceIndex = _.indexOf(contentPieces, item_id)

                nextItemID = parseInt contentPieces[pieceIndex + 1]

                if not nextItemID
                    nextItemID = false

                nextItemID

            _showModuleDescriptionView: (model) =>
                terms = model.get 'term_ids'

                numOfQuestionsCompleted = _.size @questionResponseCollection.where "status": "completed"
                totalNumofQuestions = _.size model.get 'content_pieces'
                timeTakenArray= @questionResponseCollection.pluck('time_taken');
                totalTimeTakenForModule=0
                if _.size(timeTakenArray)>0
                    totalTimeTakenForModule =   _.reduce timeTakenArray, (memo, num)-> parseInt memo + parseInt num

                new ModuleDescriptionView
                    model           : model
                    display_mode    : @display_mode
                    nextItemID      : @nextItemID

                    templateHelpers:
                        showPauseButton:=>
                            pauseBtn='';
                            if @display_mode is 'class_mode'
                                pauseBtn= '<button type="button" id="pause-session" class="btn btn-white
                                    action h-center block m-t-5"><i class="fa fa-pause"></i> Pause</button>'
                            pauseBtn

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
                                mins= parseInt mins%60
                            seconds = parseInt time%60
                            display_time=''

                            if hours >0
                                display_time= hours+'h '

                            display_time += mins + 'm '+ seconds+'s'


        class ModuleDescriptionView extends Marionette.ItemView

            className: 'pieceWrapper'

            template: moduleDescriptionTemplate

            mixinTemplateHelpers :(data)->
                data = super data
                data.isTraining = if @display_mode is 'training' then true else false
                data

            initialize : ->
                @display_mode = Marionette.getOption @, 'display_mode'


            events:
                'click #back-to-module, #pause-session': ->
                    @trigger "goto:previous:route"

                'click #question-done': 'questionCompleted'

            onShow:->
                if not Marionette.getOption(@, 'nextItemID')
                    @$el.find "#question-done"
                    .html '<i class="fa fa-forward"></i> Finish Module'

            questionCompleted: =>

                if Marionette.getOption(@, 'display_mode') is 'class_mode'
                    if confirm 'This item will be marked as complete. Continue?'
                            @trigger "question:completed"

                else @trigger "question:completed"

            onQuestionChanged: (nextItemID)->

                if not nextItemID
                    @$el.find "#question-done"
                    .html '<i class="fa fa-forward"></i> Finish Module'

            onShow: ->
                stickyHeaderTop = $("#module-details-region").height()
                $(window).scroll ->
                    if $(window).scrollTop() > stickyHeaderTop
                      $("#module-details-region").addClass "condensed"
                    else
                      $("#module-details-region").removeClass "condensed"
                    return

                  return



        # set handlers
        App.commands.setHandler "show:teacher:teaching:module:description", (opt = {})->
            new ModuleDescriptionController opt