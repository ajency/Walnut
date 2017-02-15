define ['app'
        'text!apps/edit-module/module-description/templates/collection-details.html'
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

                'click .checkbox.perm' : 'permissionSelected'

            modelEvents :
                'change:post_status' : 'statusChanged'
                #'change:content_layout' : '_changeLayout'

            mixinTemplateHelpers : (data)->
                data = super data

                data.heading = if @model.isNew() then 'Create a' else 'Edit a'

                data.isModule = true if data.type is 'teaching-module'

                data.isQuiz = true if data.type is 'quiz'

                data.type = _.titleize _.humanize data.type

                if data.isQuiz and data.permissions
                    #display value is allow_skip which is opposite of single_attempt so the value is negated and shown
                    data.permissions['single_attempt'] = ! data.permissions['single_attempt'] 

                # add status values

                data.textBookSelected = ->
                    return 'selected' if parseInt(@id) is parseInt(data.term_ids['textbook'])

                data.defaultRandomize = =>
                    return 'checked="checked"' if data.isQuiz and @model.isNew()

                data

            permissionSelected:(e)=>
                permName= $(e.target)
                .closest '.checkbox.perm' 
                .find 'input' 
                .attr 'id'

                switch permName
                    when 'resubmit' then @unSelectCheckbox 'answer'

                    when 'answer' then @unSelectCheckbox 'resubmit'

            unSelectCheckbox:(checkboxID)->
                @$el.find 'input#'+checkboxID
                .attr 'checked', false



            onShow : ->

                @$el.find '#replayhours'
                .datetimepicker
                    #useCurrent:false
                    #minDate:today
                    format:'HH:mm:ss'
                    debug:true

                Backbone.Syphon.deserialize @, @model.toJSON()
                #console.log @model.toJSON()

                @$el.find('#qType').val @model.get 'quiz_type' if @model.get('type') is 'quiz'

                if @model.get('type') is 'quiz'

                    @_toggleNegativeMarks @$el.find 'input[name="negMarksEnable"]:checked'

                @$el.find('select:not(#qType,#status)').select2()

                #Multi Select
                @$el.find("#secs,#subsecs").val([]).select2()

                if @model.isNew()

                    @$el.find 'select#status option[value="publish"]'
                    .prop 'disabled', true

                    @$el.find 'select#status option[value="archive"]'
                    .prop 'disabled', true


                @statusChanged()
                @_getAdditionaLayout() if @model.get('type') is 'quiz'

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

                @$el.find('#saved-success').remove();
                e.preventDefault()

                $('#s2id_textbooks .select2-choice,#s2id_chapters .select2-choice')
                .removeClass 'error'

                required_fields = true

                if _.isEmpty @$el.find('#textbooks').val()
                    $('#s2id_textbooks .select2-choice')
                    .addClass 'error'

                    required_fields= false

                if _.isEmpty @$el.find('#chapters').val()
                    $('#s2id_chapters .select2-choice')
                    .addClass 'error'

                    required_fields= false
                

                if @$el.find('form').valid() and required_fields

                    @$el.find '#save-content-collection i'
                    .addClass 'fa-spin fa-spinner'

                    data = Backbone.Syphon.serialize (@)
                    #data.term_ids= _.compact(data.term_ids)

                    if @model.get('type') is 'quiz'
                        single_attempt=data.permissions['single_attempt']

                        #display value is allow_skip which is opposite of single_attempt so the value is negated and saved
                        data.permissions['single_attempt'] = !single_attempt

                        data.negMarks = 0 if data.negMarksEnable is 'true' and data.negMarks is '' and @model.get('type') is 'quiz'

                    if data.post_status is 'publish'
                        if @model.get('type') is 'quiz' and _.isEmpty @model.get 'content_layout'
                            @_cannotPublish()
                            return false

                        if @model.get('type') is 'teaching-module' and _.isEmpty @model.get 'content_pieces'
                            @_cannotPublish()
                            return false

                    @trigger "save:content:collection:details", data

            _cannotPublish:->

                item = if @model.get('type') is 'quiz' then 'questions' else 'Content Pieces'

                module = _.titleize _.humanize @model.get 'type'

                @$el.find('.grid-title').prepend '<div id="saved-success" class="text-error">
                        Cannot Publish '+module+'. No '+item+' Added.
                    </div>'

                $("html, body").animate scrollTop: 0 , 700

                @$el.find '#save-content-collection i'
                .removeClass 'fa-spin fa-spinner'

            _toggleNegativeMarks : (el)->

                    if $(el).val() is 'true'
                        @$el.find("#negPercent").removeClass("none").addClass "inline"
                    else
                        @$el.find("#negPercent").addClass("none").removeClass "inline"

            _openCustomMsgPopup : (e)->
                e.stopPropagation()
                @trigger 'show:custom:msg:popup',
                    slug : $(e.target).closest('.customMsgLink').attr 'data-slug'

            # added to auto calculate the time marks and total questions
            _getAdditionaLayout:->
                contentGroupCollection = Marionette.getOption @, 'contentGroupCollection'

                totalQuestions = 0
                _.each @model.get('content_layout'), (content)=>
                    #console.log content
                    if content.type is 'content-piece'
                        totalQuestions += 1
                    else
                        totalQuestions += parseInt content.data.lvl1
                        totalQuestions += parseInt content.data.lvl2
                        totalQuestions += parseInt content.data.lvl3
                @$el.find('#total-question-number').val totalQuestions

                marks = 0
                time = 0

                contentGroupCollection.each (m)->
                    if m.get('post_type') is 'content_set'

                        if m.get 'avg_marks'
                            marks+= parseInt m.get 'avg_marks'

                        if m.get 'avg_duration'
                            time += parseInt m.get 'avg_duration'

                    else
                        if m.get 'marks'
                            marks+= parseInt m.get 'marks'

                        if m.get 'duration'
                            time += parseInt m.get 'duration'

                @$el.find('#total-marks').val marks   
                @$el.find('#total-time').val time

            onChangeLayout : ->
                console.log 'onChangeLayout'
                contentGroupCollection = Marionette.getOption @, 'contentGroupCollection'

                totalQuestions = 0
                _.each @model.get('content_layout'),(content)=>
                    if content.type is 'content-piece'
                        totalQuestions += 1
                    else
                        totalQuestions += parseInt content.data.lvl1
                        totalQuestions += parseInt content.data.lvl2
                        totalQuestions += parseInt content.data.lvl3
                @$el.find('#total-question-number').val totalQuestions

                marks=0
                time=0

                contentGroupCollection.each (m)->
                    if m.get('post_type') is 'content_set'

                        if m.get 'avg_marks'
                            marks+= parseInt m.get 'avg_marks'

                        if m.get 'avg_duration'
                            time += parseInt m.get 'avg_duration'

                    else
                        if m.get 'marks'
                            marks+= parseInt m.get 'marks'

                        if m.get 'duration'
                            time += parseInt m.get 'duration'

                @$el.find('#total-marks').val marks
                if $("#total-time-marks-set").val()==0
                    $("#total-time-marks-set").val(1);
                else
                    @.$el.find('#total-marks-final').val(marks);#added by kapil for auto calculation of total marks(Editable) 
                    @.$el.find('#total-time-final').val(time);#added by kapil for auto calculation of total time(Editable)   
                        
                @$el.find('#total-time').val time


            onSavedContentGroup : (model) ->
                @$el.find('#saved-success').remove();

                @$el.find 'select#status option'
                .prop 'disabled', false

                if @model.get('post_status') in ['publish', 'archive']
                    @$el.find 'select#status option[value="underreview"]'
                    .prop 'disabled', true

                @$el.find '#save-content-collection i'
                .removeClass 'fa-spin fa-spinner' 
                .addClass 'fa-check'

                attrs= model.changedAttributes()

                msg= if attrs.id then 'saved' else 'updated'

                if model.get('type') is 'teaching-module'
                    @$el.find('.grid-title').prepend '<div id="saved-success">Training module '+msg+'.
                        Click here to <a href="#view-group/' + model.get('id') + '">view module</a><hr></div>'

                if model.get('type') is 'quiz'
                    @$el.find('.grid-title').prepend '<div id="saved-success">Quiz '+msg+'. Click here
                        to <a href="#view-quiz/' + model.get('id') + '">view the Quiz</a><hr></div>'


                $("html, body").animate({ scrollTop: 0 }, 700);
