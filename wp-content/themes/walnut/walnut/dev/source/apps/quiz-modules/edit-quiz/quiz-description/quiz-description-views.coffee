define ['app'
        'text!apps/quiz-modules/edit-quiz/quiz-description/templates/quiz-details.html'
], (App, quizDetailsTmpl)->
    App.module 'QuizModuleApp.EditQuiz.QuizDetails.Views', (Views, App)->
        class Views.DeatailsView extends Marionette.ItemView

            template : quizDetailsTmpl

            className : 'tiles white grid simple vertical green animated fadeIn'



            events :
                'click #save-quiz' : '_saveQuiz'
                'change input[name="negMarksEnable"]' : (e)->
                    e.stopPropagation()
                    @_toggleNegativeMarks $(e.target)
                'change #msgs' : (e)->
                    @_showCustomMessages $(e.target)
                'click .customMsgLink' : '_openCustomMsgPopup'

#
#            modelEvents :
#                'change:status' : 'statusChanged'

#            mixinTemplateHelpers : (data)->
#                data = super data

#                data.statusSelected = ->
#                    return 'selected' if @value is data.status
#
#                data

#
            onShow : ->
                Backbone.Syphon.deserialize @, @model.toJSON()

                @_showCustomMessages @$el.find('#msgs')

                @_toggleNegativeMarks @$el.find 'input[name="negMarksEnable"]:checked'

#                $(" #minshours, select").select2()



#                @statusChanged()

#            statusChanged : ->
#                if @model.get('status') in ['publish', 'archive']
#                    @$el.find 'input, textarea, select'
#                    .prop 'disabled', true
#
#                    @$el.find 'select#status'
#                    .prop 'disabled', false
#
#                    @$el.find 'select#status option[value="underreview"]'
#                    .prop 'disabled', true


#
#            markSelected : (element, sections)->
#                return '' if @model.isNew()
#                $("#" + element).val(@model.get('term_ids')[sections]).select2()
#
#
            _saveQuiz : (e)->
                e.preventDefault()

                if @$el.find('form').valid()
                    data = Backbone.Syphon.serialize (@)
                    #                    data.negMarksEnable = _.toBoolean data.negMarksEnable
                    if data.negMarksEnable is 'true' and data.negMarks is '' then data.negMarks = 0

                    @trigger "save:quiz:details", data

            _toggleNegativeMarks : (el)->
                console.log $(el).val()
                if $(el).val() is 'true'
                    @$el.find("#negPercent").removeClass("none").addClass "inline"
                else
                    @$el.find("#negPercent").addClass("none").removeClass "inline"

            _showCustomMessages : (el)->
                if $(el).prop 'checked'
                    @$el.find('#customMsg').show()

                else
                    @$el.find('#customMsg').hide()

            _openCustomMsgPopup : (e)->
                e.stopPropagation()
                @trigger 'show:custom:msg:popup',
                    slug : $(e.target).closest('.customMsgLink').attr 'data-slug'



            onSavedQuiz : (model) ->
                @$el.find('#saved-success').remove();

                @$el.find '.grid-title'
                .prepend '<div id="saved-success">Saved Successfully. Click here to <a href="#view-quiz/' + model.get('id') + '">view the Quiz</a><hr></div>'
