define ['app',
        'text!apps/content-creator/options-bar/templates/options-bar.html'], (App, optionsBarTpl)->
    App.module "ContentCreator.OptionsBar.Views", (Views, App)->

        class Views.OptionsBarView extends Marionette.ItemView

            template: optionsBarTpl

            events:
                'change #subs': '_changeSubject'

                'change #chaps': '_changeChapter'

                'change #qType' : '_changeOfQuestionType'

                'click  #save-question': 'saveQuestionSettings'

                'click #preview-question' : 'previewQuestion'

                'click #subProps.nav-tabs' : '_changeTabs'

            mixinTemplateHelpers : (data)->
                data = super data
                data.isStudentQuestion = if @model.get('content_type') is 'student_question' then true else false
                data



            onShow:->
                @$el.find "#subs, #chaps, #qType, #status, #secs, #subsecs, #difficulty_level "#,#negativeMarks"
                .select2();

                @$el.find('input.tagsinput').tagsinput()

                $('#subProps a').click (e)->
                    e.preventDefault();
                    $(this).tab('show');

                if @model.get 'ID'
                    qType= @model.get 'question_type'
                    @$el.find('#qType').select2().select2('val',qType)

                    postStatus= @model.get 'post_status'
                    @$el.find('#status').select2().select2('val',postStatus)

                    @$el.find('#difficulty_level').select2().select2 'val',@model.get 'difficulty_level'

#                    negativeMarks= parseInt @model.get 'negative_marks'
#                    $('#negativeMarks').select2().select2('val',negativeMarks)

                if @model.get('content_type') isnt 'teacher_question'
                    @$el.find '#question_type_column'
                    .remove()

            _changeTabs : (e)->
                tabId = @$el.find('#subProps.nav-tabs li.active').attr 'id'
                tabPaneId = tabId+'-pane'
                console.log tabPaneId
                @$el.find('.tab-content .tab-pane').removeClass 'active'
                @$el.find(".tab-content ##{tabPaneId}.tab-pane").addClass 'active'


            _changeSubject : (e)->
                @$el.find '#chaps, #secs, #subsecs'
                .select2 'data', null

                @$el.find '#chaps, #secs, #subsecs'
                .html ''

                @trigger "fetch:chapters", $(e.target).val()

            _changeChapter : (e)->

                @$el.find '#secs, #subsecs'
                .select2 'data', null

                @$el.find '#secs, #subsecs'
                .html ''

                @trigger "fetch:sections:subsections", $(e.target).val()

            onFetchChaptersComplete: (chaps, curr_chapter)->
                if _.size(chaps) > 0
                    @$el.find('#chaps').html('');
                    _.each chaps.models, (chap, index)=>
                        @$el.find '#chaps'
                        .append "<option value='#{chap.get('term_id')}'>#{chap.get('name')}</option>"

                    @$el.find('#chaps').select2().select2 'val',curr_chapter

                else
                    @$el.find('#chaps').select2().select2 'data', null

            onFetchSubsectionsComplete: (allsections)=>
                term_ids= @model.get 'term_ids'

                sectionIDs = term_ids['sections'] if term_ids?

                subSectionIDs = term_ids['subsections'] if term_ids?

                if _.size(allsections) > 0
                    if _.size(allsections.sections) > 0
                        @$el.find('#secs').html('');
                        _.each allsections.sections, (section, index)=>
                            @$el.find('#secs')
                            .append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'

                        @$el.find('#secs').select2().select2 'val',sectionIDs

                    else
                        @$el.find('#secs').select2().select2 'data', null

                    if _.size(allsections.subsections) > 0
                        @$el.find('#subsecs').html('');
                        _.each allsections.subsections, (section, index)=>
                            @$el.find '#subsecs'
                            .append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'
                        @$el.find('#subsecs').select2().select2 'val',subSectionIDs
                    else
                        @$el.find('#subsecs').select2().select2 'data', null
                else
                    @$el.find('#subsecs,#secs').select2().select2 'data', null

            _changeOfQuestionType : (e)->
                if $(e.target).val() is 'multiple_eval'
                    @trigger 'show:grading:parameter'
                else
                    @trigger 'close:grading:parameter'

            saveQuestionSettings:->
                if @$el.find('form').valid()
                    data = Backbone.Syphon.serialize (@)
                    @trigger "save:data:to:model", data
                    @$el.find '#preview-question'
                    .show()

            previewQuestion:->
                window.open SITEURL + "/#content-piece/"+@model.id, 'target':'blank'