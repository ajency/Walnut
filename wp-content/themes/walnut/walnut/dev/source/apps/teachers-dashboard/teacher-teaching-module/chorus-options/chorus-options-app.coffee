define ['app'
        'controllers/region-controller'
        'text!apps/teachers-dashboard/teacher-teaching-module/chorus-options/templates/chorus-options-template.html'], (App, RegionController, chorusOptionsTemplate)->
    App.module "SingleQuestionChorusOptionsApp", (ChorusOptions, App)->
        class ChorusOptionsController extends RegionController

            initialize: (opts)->
                {@questionResponseModel,@display_mode} = opts

                @view = view = @_showChorusOptionsView @questionResponseModel

                @show view, (loading: true)

                @listenTo view, "save:question:response", @_saveQuestionResponse

                @listenTo view, "question:completed", @_changeQuestion

                @listenTo @view, "goto:previous:route", =>
                    @region.trigger "goto:previous:route"

            _changeQuestion: (resp)=>
                @_saveQuestionResponse '' if resp is 'no_answer'

                @region.trigger "goto:next:question", @questionResponseModel.get 'content_piece_id'

            _showChorusOptionsView: (model)=>
                new ChorusOptionsView
                    model: model
                    responsePercentage: @questionResponseModel.get 'question_response'
                    display_mode: @display_mode

                    templateHelpers:
                        showPauseBtn: =>
                            if @display_mode is 'class_mode'
                                buttonStr = '<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10">
                                									  <button type="button" id="pause-session" class="btn btn-primary btn-xs btn-sm">
                                									    <i class="fa fa-pause"></i> Pause
                                									  </button>
                                									</div>'
                            buttonStr

            _saveQuestionResponse: (studResponse)=>
                @questionResponseModel.set
                    'question_response': studResponse

                @questionResponseModel.save()


        class ChorusOptionsView extends Marionette.ItemView

            className: 'studentList m-t-35'

            template: chorusOptionsTemplate

            events:
                'click .tiles.single.selectable': 'selectStudent'
                'click #question-done': 'questionCompleted'
                'click #pause-session': ->
                    @trigger "goto:previous:route"

            onShow: ->
                if Marionette.getOption(@, 'display_mode') is 'class_mode'
                    $(ele).addClass 'selectable' for ele in @$el.find '.tiles.single'

                responsePercentage = Marionette.getOption @, 'responsePercentage'
                if responsePercentage?
                    @$el.find '#' + responsePercentage
                    .find '.default'
                        .addClass 'green'

            selectStudent: (e)->
                @$el.find '.green'
                .removeClass 'green'

                dataValue = $(e.target).closest '.tiles.single'
                .attr 'id'

                $(e.target).closest('.tiles.single')
                .find '.default'
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
				