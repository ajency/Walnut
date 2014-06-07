define ['app'
        'controllers/region-controller'
        'text!apps/teachers-dashboard/teacher-teaching-module/chorus-options/templates/chorus-options-template.html'], (App, RegionController, chorusOptionsTemplate)->
    App.module "SingleQuestionChorusOptionsApp", (ChorusOptions, App)->
        class ChorusOptionsController extends RegionController

            initialize: (opts)->
                {@questionResponseModel,@display_mode,@timerObject} = opts

                @view = view = @_showChorusOptionsView @questionResponseModel

                @show view, (loading: true)

                @listenTo view, "save:question:response", @_saveQuestionResponse

                @listenTo view, "question:completed", @_changeQuestion

            _changeQuestion:=>
                @region.trigger "goto:next:question", @questionResponseModel.get 'content_piece_id'

            _showChorusOptionsView: (model)=>
                console.log JSON.stringify @questionResponseModel.toJSON()
                new ChorusOptionsView
                    model: model
                    responsePercentage: @questionResponseModel.get 'question_response'
                    display_mode: @display_mode

            _saveQuestionResponse: (studResponse)=>

                elapsedTime= @timerObject.request "get:elapsed:time"
                #status changes to completed only when we navigate to next question
                @questionResponseModel.set
                    'question_response' : studResponse
                    'status'            : 'paused'
                    'time_taken'        : elapsedTime

                @questionResponseModel.save()

        class ChorusOptionsView extends Marionette.ItemView

            className: 'studentList m-t-35'

            template: chorusOptionsTemplate

            events:
                'click .tiles.single.selectable': 'selectStudent'
                'click #question-done': 'questionCompleted'

            onShow: ->
                if Marionette.getOption(@, 'display_mode') is 'class_mode'
                    $(ele).addClass 'selectable' for ele in @$el.find '.tiles.single'

                console.log @
                responsePercentage = Marionette.getOption @, 'responsePercentage'
                if responsePercentage?
                    responsePercentage = if responsePercentage is '' then 'few' else responsePercentage
                    @$el.find '#' + responsePercentage
                    .find '.default'
                        .removeClass 'default'
                        .addClass 'green'

            selectStudent: (e)->
                @$el.find '.green'
                .removeClass 'green'
                    .addClass 'default'

                dataValue = $(e.target).closest '.tiles.single'
                .attr 'id'

                $(e.target).closest('.tiles.single')
                .find '.default'
                    .removeClass 'default'
                    .addClass 'green'
                        .find 'i'
                            .removeClass 'fa-minus-circle'
                                .addClass 'fa-check-circle'

                @trigger "save:question:response", dataValue

            questionCompleted: =>
                selectedAnswer = @$el.find '.tiles.single .green'

                if (_.size(selectedAnswer) is 0) and (Marionette.getOption(@, 'display_mode') is 'class_mode')
                    if confirm 'Are you sure no one answered correctly?'
                        @trigger "question:completed", "no_answer"
                else
                    @trigger "question:completed"

        # set handlers
        App.commands.setHandler "show:single:question:chorus:options:app", (opt = {})->
            new ChorusOptionsController opt
				