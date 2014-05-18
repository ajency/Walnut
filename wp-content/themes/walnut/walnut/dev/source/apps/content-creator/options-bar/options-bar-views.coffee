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
                $ "#subs, #chaps, #qType, #status, #author, #secs, #subsecs"
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

                    author= @model.get 'post_author'
                    $('#author').select2().select2('val',author)

            onFetchChaptersComplete: (chaps, curr_chapter)->
                if _.size(chaps) > 0
                    @$el.find('#chaps').html('');
                    _.each chaps.models, (chap, index)=>
                        @$el.find '#chaps'
                        .append '<option value="' + chap.get('term_id') + '">' + chap.get('name') + '</option>'

                    $('#chaps').select2().select2('val',curr_chapter)

                else
                    @$el.find '#chaps'
                    .html '<option value="">No Chapters available</option>'

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

                        $('#secs').select2().select2('val',sectionIDs)

                    else
                        @$el.find('#secs').html('<option value="">No Sections available</option>');

                    if _.size(allsections.subsections) > 0
                        @$el.find('#subsecs').html('');
                        _.each allsections.subsections, (section, index)=>
                            @$el.find '#subsecs'
                            .append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'
                        $('#subsecs').select2().select2('val',subSectionIDs)
                    else
                        @$el.find('#subsecs').html '<option>No Sub Sections available</option>'
                else
                    @$el.find('#secs').html '<option value="">No Sections available</option>'
                    @$el.find('#subsecs').html '<option value="">No Sub Sections available</option>'



            onSaveQuestionSettings:->
                if @$el.find('form').valid()
                    data = Backbone.Syphon.serialize (@)
                    @trigger "save:data:to:model", data