define ['app'
        'text!apps/content-modules/edit-module/module-description/templates/collection-details.html'
],(App,collectionDetailsTpl)->

    App.module 'EditCollecionDetailsApp.Views',(Views,App)->

        class Views.CollectionDetailsView extends Marionette.ItemView

            template : collectionDetailsTpl

            className : 'grid simple vertical green animated fadeIn'

            events :
                'change #textbooks' : (e)->
                    @trigger "fetch:chapters", $(e.target).val()

                'change #chapters' : (e)->
                    @trigger "fetch:sections", $(e.target).val()

                'change #secs' : (e)->
                    @trigger "fetch:subsections", $(e.target).val()

                'click #save-content-collection' : 'save_content'
                'click .customMsgLink' : '_openCustomMsgPopup'

                'change input[name="negMarksEnable"]' : (e)->
                    e.stopPropagation()
                    @_toggleNegativeMarks $(e.target)
                'change #msgs' : (e)->
                    @_showCustomMessages $(e.target)

                'click .checkbox.perm' : 'checkboxSelected'

            modelEvents :
                'change:post_status' : 'statusChanged'
                'change:content_layout' : '_changeLayout'

            mixinTemplateHelpers : (data)->
                data = super data

                data.heading = if @model.isNew() then 'Create a' else 'Edit a'

                data.isModule = true if data.type is 'teaching-module'

                data.isQuiz = true if data.type is 'quiz'

                data.type = _.titleize _.humanize data.type

                # add status values

                data.textBookSelected = ->
                    return 'selected' if parseInt(@id) is parseInt(data.term_ids['textbook'])

                data

            permissionSelected:(e)=>
                permName= $(e.target)
                .closest '.checkbox.perm' 
                .find 'input' 
                .attr 'id'

                switch permName
                    when 'attempt'      then @unSelectCheckbox 'resubmit'
                    when 'resubmit'     then @unSelectCheckbox 'attempt'
                    when 'check'        then @unSelectCheckbox 'answer'
                    when 'answer'       then @unSelectCheckbox 'check'

            unSelectCheckbox:(checkboxID)->
                @$el.find 'input#'+checkboxID
                .attr 'checked', false

            onShow : ->
                Backbone.Syphon.deserialize @, @model.toJSON()
                console.log @$el.find('#qType').val()
                console.log @model.toJSON()

                @$el.find('#qType').val @model.get 'quiz_type' if @model.get('type') is 'quiz'

                if @model.get('type') is 'quiz'
                    @_showCustomMessages @$el.find('#msgs')

                    @_toggleNegativeMarks @$el.find 'input[name="negMarksEnable"]:checked'

                @$el.find('select:not(#qType,#status)').select2()

                #Multi Select
                @$el.find("#secs,#subsecs").val([]).select2()

                @statusChanged()
                @_changeLayout() if @model.get('type') is 'quiz'

            statusChanged : ->
                if @model.get('post_status') in ['publish', 'archive']
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

            markSelected : (element, sections)->
                return '' if @model.isNew()
                $("#" + element).val(@model.get('term_ids')[sections]).select2()


            save_content : (e)->
                e.preventDefault()

                $('#s2id_textbooks .select2-choice')
                .removeClass 'error'

                if @$el.find('#textbooks').val() is ''
                    $('#s2id_textbooks .select2-choice')
                    .addClass 'error'

                if @$el.find('form').valid()
                    data = Backbone.Syphon.serialize (@)
                    #data.term_ids= _.compact(data.term_ids)
                    data.negMarks = 0 if data.negMarksEnable is 'true' and data.negMarks is '' and @model.get('type') is 'quiz'

                    @trigger "save:content:collection:details", data

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


            _changeLayout : ->
                totalQuestions = 0
                _.each @model.get('content_layout'),(content)=>
                    if content.type is 'content-piece'
                        totalQuestions += 1
                    else
                        totalQuestions += parseInt content.data.lvl1
                        totalQuestions += parseInt content.data.lvl2
                        totalQuestions += parseInt content.data.lvl3
                @$el.find('#total-question-number').val totalQuestions


            onSavedContentGroup : (model) ->
                @$el.find('#saved-success').remove();

                attrs= model.changedAttributes()

                msg= if attrs.id then 'saved' else 'updated'

                if model.get('type') is 'teaching-module'
                    @$el.find('.grid-title').prepend '<div id="saved-success">Training module '+msg+'.
                        Click here to <a href="#view-group/' + model.get('id') + '">view module</a><hr></div>'

                if model.get('type') is 'quiz'
                    @$el.find('.grid-title').prepend '<div id="saved-success">Quiz '+msg+'. Click here
                        to <a href="#view-quiz/' + model.get('id') + '">view the Quiz</a><hr></div>'



