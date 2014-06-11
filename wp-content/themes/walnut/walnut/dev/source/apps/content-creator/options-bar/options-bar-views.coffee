define ['app',
        'text!apps/content-creator/options-bar/templates/options-bar.html'], (App, optionsBarTpl)->
    App.module "ContentCreator.OptionsBar.Views", (Views, App)->

        class Views.OptionsBarView extends Marionette.ItemView

            template: optionsBarTpl

            events:
                'change #subs': (e)->
                    @$el.find '#chaps, #secs, #subsecs'
                    .select2 'data', null

                    @$el.find '#chaps, #secs, #subsecs'
                    .html ''

                    @trigger "fetch:chapters", $(e.target).val()

                'change #chaps': (e)->

                    @$el.find '#secs, #subsecs'
                    .select2 'data', null

                    @$el.find '#secs, #subsecs'
                    .html ''

                    @trigger "fetch:sections:subsections", $(e.target).val()

            onShow:->
                $ "#subs, #chaps, #qType, #status, #secs, #subsecs "#,#negativeMarks"
                .select2();

                $('input.tagsinput').tagsinput()

                $('#subProps a').click (e)->
                    e.preventDefault();
                    $(this).tab('show');

                if @model.get 'ID'
                    qType= @model.get 'question_type'
                    $('#qType').select2().select2('val',qType)

                    postStatus= @model.get 'post_status'
                    $('#status').select2().select2('val',postStatus)

#                    negativeMarks= parseInt @model.get 'negative_marks'
#                    $('#negativeMarks').select2().select2('val',negativeMarks)

                if @model.get('content_type') is 'content_piece'
                    @$el.find '#question_type_column'
                    .remove()

            onFetchChaptersComplete: (chaps, curr_chapter)->
                if _.size(chaps) > 0
                    @$el.find('#chaps').html('');
                    _.each chaps.models, (chap, index)=>
                        @$el.find '#chaps'
                        .append '<option value="' + chap.get('term_id') + '">' + chap.get('name') + '</option>'

                    $('#chaps').select2().select2 'val',curr_chapter

                else
                    $('#chaps').select2().select2 'data', null

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

                        $('#secs').select2().select2 'val',sectionIDs

                    else
                        $('#secs').select2().select2 'data', null

                    if _.size(allsections.subsections) > 0
                        @$el.find('#subsecs').html('');
                        _.each allsections.subsections, (section, index)=>
                            @$el.find '#subsecs'
                            .append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'
                        $('#subsecs').select2().select2 'val',subSectionIDs
                    else
                        $('#subsecs').select2().select2 'data', null
                else
                    $('#subsecs,#secs').select2().select2 'data', null



            onSaveQuestionSettings:->
                if @$el.find('form').valid()
                    data = Backbone.Syphon.serialize (@)
                    @trigger "save:data:to:model", data