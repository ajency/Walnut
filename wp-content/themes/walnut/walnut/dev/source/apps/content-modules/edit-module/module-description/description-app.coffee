define ['app'
        'controllers/region-controller'
        'text!apps/content-modules/edit-module/module-description/templates/collection-details.html'], (App, RegionController, collectionDetailsTpl)->
    App.module "CollecionDetailsApp.Controller", (Controller, App)->
        class Controller.EditCollecionDetailsController extends RegionController

            initialize : (opts)->
                {@model}= opts

                @textbooksCollection = App.request "get:textbooks"

                App.execute "when:fetched", [@textbooksCollection], @showView

            showView : =>
                @view = view = @_getCollectionDetailsView @model

                @show view, (loading : true, entities : [@textbooksCollection])

                term_ids = @model.get 'term_ids'

                @listenTo @view, "show",=>
                    if term_ids
                        textbook_id = term_ids['textbook']

                        chapter_id = term_ids['chapter'] if term_ids['chapter']?

                        section_ids = _.flatten(term_ids['sections']) if term_ids['sections']?

                        #fetch chapters based on the current content piece's textbook
                        @_fetchChapters(textbook_id, chapter_id) if textbook_id?

                        #fetch sections based on chapter id
                        @_fetchSections(chapter_id) if chapter_id?

                        #fetch sections based on chapter id
                        @_fetchSubsections(section_ids) if section_ids?


                ## end of fetching of edit content piece

                ## listening to change in textbook to fetch new list of chapters
                # and sections
                @listenTo @view, "fetch:chapters", @_fetchChapters

                @listenTo @view, "fetch:sections", @_fetchSections

                @listenTo @view, "fetch:subsections", @_fetchSubsections

                @listenTo @view, "save:content:collection:details" : (data) =>
                    @model.set 'changed' : 'module_details'
                    @model.save(data, { wait : true, success : @successFn, error : @errorFn })
                    @region.trigger "close:content:selection:app" if data.status isnt 'underreview'

            ##fetch chapters based on textbook id, current_chapter refers to the chapter to be selected by default
            _fetchChapters: (term_id, current_chapter)=>
                chaptersCollection = App.request "get:chapters", ('parent': term_id)

                App.execute "when:fetched", chaptersCollection, =>
                    @view.triggerMethod 'fetch:chapters:complete',
                        chaptersCollection, current_chapter

            #fetch all sections beloging to the chapter id passed as term_id
            _fetchSections: (term_id)=>
                @subSectionsList = null
                @allSectionsCollection = App.request "get:subsections:by:chapter:id",
                    ('child_of': term_id)

                App.execute "when:fetched", @allSectionsCollection, =>
                    #make list of sections directly belonging to chapter ie. parent=term_id
                    sectionsList = @allSectionsCollection.where 'parent': term_id

                    #all the other sections are listed as subsections
                    @subSectionsList = _.difference(@allSectionsCollection.models, sectionsList);

                    @view.triggerMethod 'fetch:sections:complete', sectionsList


            #fetch all sub sections beloging to the section id passed as term_id
            _fetchSubsections: (term_id)=>
                App.execute "when:fetched", @allSectionsCollection, =>
                    subSectionList = null
                    subSectionList = _.filter @subSectionsList, (subSection)->
                        _.contains term_id, subSection.get 'parent'

                    @view.triggerMethod 'fetch:subsections:complete', subSectionList



            successFn : (model)=>
                App.navigate "edit-module/#{model.get('id')}"
                @view.triggerMethod 'saved:content:group', model

            errorFn : ->
                console.log 'error'


            _getCollectionDetailsView : (model)->
                new CollectionDetailsView
                    model : model
                    templateHelpers :
                        textbooksFilter : =>
                            textbooks = []
                            _.each @textbooksCollection.models, (el, ind)->
                                textbooks.push
                                    'name' : el.get('name')
                                    'id' : el.get('term_id')

                            textbooks


        class CollectionDetailsView extends Marionette.ItemView

            template : collectionDetailsTpl

            className : 'tiles white grid simple vertical green animated fadeIn'

            events :
                'change #textbooks' : (e)->
                    @trigger "fetch:chapters", $(e.target).val()

                'change #chapters' : (e)->
                    @trigger "fetch:sections", $(e.target).val()

                'change #secs' : (e)->
                    @trigger "fetch:subsections", $(e.target).val()

                'click #save-content-collection' : 'save_content'

            modelEvents :
                'change:status' : 'statusChanged'

            mixinTemplateHelpers : (data)->
                data = super data

                # add status values
                data.statusOptions = [
                    (
                        name : 'Under Review'
                        value : 'underreview'
                    )
                    (
                        name : 'Published'
                        value : 'publish'
                    )
                    (
                        name : 'Archived'
                        value : 'archive'
                    )
                ]

                data.textBookSelected = ->
                    return 'selected' if parseInt(@id) is parseInt(data.term_ids['textbook'])

                data.statusSelected = ->
                    return 'selected' if @value is data.status

                data


            onShow : ->
                $("#textbooks, #chapters, #minshours, select").select2()

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

                    @trigger "save:content:collection:details", data


            onSavedContentGroup : (model) ->
                @$el.find('#saved-success').remove();

                @$el.find '.grid-title'
                .prepend '<div id="saved-success">Saved Successfully. Click here to <a href="#view-group/' + model.get('id') + '">view your module</a><hr></div>'

        # set handlers
        App.commands.setHandler "show:editgroup:content:group:detailsapp", (opt = {})->
            new Controller.EditCollecionDetailsController opt

