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

                'change #textbooks' : (e)->
                    @trigger "fetch:chapters", $(e.target).val()

                'change #chapters' : (e)->
                    @trigger "fetch:sections", $(e.target).val()

                'change #secs' : (e)->
                    @trigger "fetch:subsections", $(e.target).val()

                'click .customMsgLink' : '_openCustomMsgPopup'

#
#            modelEvents :
#                'change:status' : 'statusChanged'

            mixinTemplateHelpers : (data)->
                data = super data

                data.heading = if @model.isNew() then 'Add' else 'Edit'

                data.textBookSelected = ->
                    return 'selected' if parseInt(@id) is parseInt(data.term_ids['textbook'])

#                data.statusSelected = ->
#                    return 'selected' if @value is data.status

                data

#
            onShow : ->
                Backbone.Syphon.deserialize @, @model.toJSON()

                @_showCustomMessages @$el.find('#msgs')

                @_toggleNegativeMarks @$el.find 'input[name="negMarksEnable"]:checked'

                $("select:not(#qType,#status)").select2()

                #Multi Select
                $("#secs,#subsecs").val([]).select2()

                @statusChanged()

            statusChanged : ->
                if @model.get('status') in ['publish', 'archive']
                    @$el.find 'input, textarea, select'
                    .prop 'disabled', true

                    @$el.find 'select#status'
                    .prop 'disabled', false

                    @$el.find 'select#status option[value="underreview"]'
                    .prop 'disabled', true

            onFetchChaptersComplete : (chapters)->

                @$el.find '#chapters, #secs, #subsecs'
                .select2 'data', null

                @$el.find '#chapters, #secs, #subsecs'
                .html ''

                chapterElement= @$el.find '#chapters'
                termIDs= @model.get 'term_ids'
                currentChapter= termIDs['chapter']

                $.populateChaptersOrSections(chapters,chapterElement, currentChapter);


            setChapterValue : ->
                if @model.get('term_ids')['chapter']
                    @$el.find('#chapters').val @model.get('term_ids')['chapter']
                    @$el.find('#chapters').select2()
                    @$el.find('#chapters').trigger 'change'

            onFetchSectionsComplete : (sections)->

                @$el.find '#secs, #subsecs'
                .select2 'data', null

                @$el.find '#secs, #subsecs'
                .html ''

                term_ids= @model.get 'term_ids'

                sectionIDs = term_ids['sections'] if term_ids?

                sectionsElement     = @$el.find '#secs'

                $.populateChaptersOrSections(sections,sectionsElement, sectionIDs);

            onFetchSubsectionsComplete : (subsections)->

                @$el.find '#subsecs'
                .select2 'data', null

                @$el.find '#subsecs'
                .html ''

                term_ids= @model.get 'term_ids'

                subSectionIDs = term_ids['subsections'] if term_ids?

                subsectionsElemnet  = @$el.find '#subsecs'
                $.populateChaptersOrSections(subsections,subsectionsElemnet, subSectionIDs);

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
