define ['app'
        'controllers/region-controller'
        'text!apps/take-module-item/chorus-options/templates/chorus-options-template.html'], (App, RegionController, chorusOptionsTemplate)->
    App.module "SingleQuestionChorusOptionsApp", (ChorusOptions, App)->
        class ChorusOptionsController extends RegionController

            initialize: (opts)->
                {@questionResponseModel,@display_mode,@timerObject} = opts

                @view = view = @_showChorusOptionsView @questionResponseModel

                @show view, (loading: true)

                @listenTo view, "save:question:response", @_saveQuestionResponse

            _showChorusOptionsView: (model)=>
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

            onShow: ->
                if Marionette.getOption(@, 'display_mode') isnt 'readonly'
                    $(ele).addClass 'selectable' for ele in @$el.find '.tiles.single'

                responsePercentage = Marionette.getOption @, 'responsePercentage'

                if _.isString(responsePercentage) and responsePercentage.length > 0
                    @$el.find '#' + responsePercentage
                    .find '.unselected'
                        .removeClass 'unselected'
                        .addClass 'blue'

            selectStudent: (e)->

                @$el.find '#select-an-item'
                .remove()

                @$el.find '.blue'
                .removeClass 'blue'
                    .addClass 'unselected'

                dataValue = $(e.currentTarget).closest '.tiles.single'
                                                .attr 'id'

                $(e.target).closest('.tiles.single')
                            .find '.unselected'
                                .removeClass 'unselected'
                                .addClass 'blue'
                                    .find 'i'
                                        .removeClass 'fa-minus-circle'
                                            .addClass 'fa-check-circle'

                if Marionette.getOption(@, 'display_mode') is 'class_mode'
                    @trigger "save:question:response", dataValue

        # set handlers
        App.commands.setHandler "show:single:question:chorus:options:app", (opt = {})->
            new ChorusOptionsController opt
				