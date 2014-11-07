define ['app',
        'text!apps/content-creator/options-bar/templates/options-bar.html'], (App, optionsBarTpl)->
    App.module "ContentCreator.OptionsBar.Views", (Views, App)->

        class Views.OptionsBarView extends Marionette.ItemView

            template: optionsBarTpl

            events:
                'change #subs' : (e)->
                    @trigger "fetch:chapters", $(e.target).val()

                'change #chaps' : (e)->
                    @trigger "fetch:sections", $(e.target).val()

                'change #secs' : (e)->
                    @trigger "fetch:subsections", $(e.target).val()

                'change #qType' : '_changeOfQuestionType'

                'click  #save-question': 'saveQuestionSettings'

                'click #preview-question' : 'previewQuestion'

                'click a.tabs' : '_changeTabs'

                'change #hint_enable': '_hintEnable'

                'change #comment_enable' : '_commentEnable'

            modelEvents:
                'change:ID' :-> @$el.find('#preview-question').show()

            mixinTemplateHelpers : (data)->
                data = super data
                data.isStudentQuestion = if @model.get('content_type') is 'student_question' then true else false
                data.isTeacherQuestion = if @model.get('content_type') is 'teacher_question' then true else false
                data.isContentPiece = if @model.get('content_type') is 'content_piece' then true else false
                data.instructionsLabel = if @model.get('content_type') is 'content_piece' then 'Procedure Summary' else 'Instructions'

                data



            onShow:->
                ele = @$el.find ".instructions"

                $(ele).css 'height' : $(ele).prop('scrollHeight') + "px";

                Backbone.Syphon.deserialize @,@model.toJSON()

                @$el.find "#subs, #chaps, #qType, #status, #secs, #subsecs, #difficulty_level "#,#negativeMarks"
                .select2();

                @$el.find('input.tagsinput').tagsinput()

                if @model.get 'hint_enable'
                    console.log 'hint'
                    @$el.find('#hint_enable').trigger 'click'

                if @model.get 'comment_enable'
                    @$el.find('#comment_enable').trigger 'click'

                if @model.get('content_type') isnt 'teacher_question'
                    @$el.find '#question_type_column'
                    .remove()

                @$el.find('#preview-question').show() if not @model.isNew()

            _changeTabs : (e)->
                e.preventDefault()
                $(e.target).tab('show')

            _hintEnable : (e)=>
                if $(e.target).prop 'checked'
                    @$el.find('#question-hint').prop 'disabled',false
                    @$el.find('#question-hint').show()
                else
                    @$el.find('#question-hint').prop 'disabled',true
                    @$el.find('#question-hint').hide()

            _commentEnable : (e)=>
                if $(e.target).prop 'checked'
                    @$el.find('#question-comment').prop 'disabled',false
                    @$el.find('#question-comment').show()
                else
                    @$el.find('#question-comment').prop 'disabled',true
                    @$el.find('#question-comment').hide()

            onFetchChaptersComplete : (chapters)->

                @$el.find '#chaps, #secs, #subsecs'
                .select2 'data', null

                @$el.find '#chaps, #secs, #subsecs'
                .html ''

                chapterElement= @$el.find '#chaps'
                termIDs= @model.get 'term_ids'
                currentChapter= if termIDs then termIDs['chapter'] else ''

                $.populateChaptersOrSections(chapters,chapterElement, currentChapter);

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

            _changeOfQuestionType : (e)->
                if $(e.target).val() is 'multiple_eval'
                    @trigger 'show:grading:parameter'
                else
                    @trigger 'close:grading:parameter'

            saveQuestionSettings:->
                if @$el.find('form').valid()
                    data = Backbone.Syphon.serialize (@)
                    @trigger "save:data:to:model", data

            previewQuestion:->
                if @model.get('content_type') is 'student_question'
                    window.open SITEURL + "/#dummy-quiz/"+@model.id, 'target':'blank'
                else
                    window.open SITEURL + "/#dummy-module/"+@model.id, 'target':'blank'

