define ['app'
        'controllers/region-controller'
        'text!apps/content-group/edit-group/group-details/templates/collection-details.html'], (App, RegionController, collectionDetailsTpl)->
    App.module "CollecionDetailsApp.Controller", (Controller, App)->
        class Controller.EditCollecionDetailsController extends RegionController

            initialize : (opts)->
                {@model}= opts

                @textbooksCollection = App.request "get:textbooks"

                App.execute "when:fetched", [@textbooksCollection], @showView

            showView : =>
                @view = view = @_getCollectionDetailsView @model

                @show view, (loading : true, entities : [@textbooksCollection])

                @listenTo @view, "fetch:chapters" : (term_id) =>
                    chaptersCollection = App.request "get:chapters", ('parent' : term_id)
                    App.execute "when:fetched", chaptersCollection, =>
                        @view.triggerMethod 'fetch:chapters:complete', chaptersCollection

                @listenTo @view, "fetch:sections:subsections" : (term_id) ->
                    allSectionsCollection = App.request "get:subsections:by:chapter:id", ('child_of' : term_id)
                    App.execute "when:fetched", allSectionsCollection, =>
                        #make list of sections directly belonging to chapter ie. parent=term_id
                        sectionsList = allSectionsCollection.where 'parent' : term_id

                        #all the other sections are listed as subsections
                        subsectionsList = _.difference(allSectionsCollection.models, sectionsList);
                        allSections =
                            'sections' : sectionsList
                            'subsections' : subsectionsList

                        @view.triggerMethod 'fetch:subsections:complete', allSections


                @listenTo @view, "save:content:collection:details" : (data) =>
                    @model.set 'changed' : 'module_details'
                    @model.save(data, { wait : true, success : @successFn, error : @errorFn })
                    @region.trigger "close:content:selection:app" if data.status isnt 'underreview'


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

            className : 'tiles white grid simple vertical green animated slideInRight'

            events :
                'change #textbooks' : (e)->
                    @$el.find '#secs, #subsecs'
                    .select2 'data', null

                    @$el.find '#chapters, #secs, #subsecs'
                    .html ''

                    @trigger "fetch:chapters", $(e.target).val()

                'change #chapters' : (e)->
                    @trigger "fetch:sections:subsections", $(e.target).val()

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

                if not @model.isNew()
                    @prepolateDropDowns()

                @statusChanged()




            statusChanged : ->
                if @model.get('status') in ['publish', 'archive']
                    @$el.find 'input, textarea, select'
                    .prop 'disabled', true

                    @$el.find 'select#status'
                    .prop 'disabled', false

                    @$el.find 'select#status option[value="underreview"]'
                    .prop 'disabled', true



            prepolateDropDowns : ->
                @$el.find('#textbooks').trigger 'change'

            onFetchChaptersComplete : (chapters)->

                chapterElement= @$el.find '#chapters'
                termIDs= @model.get 'term_ids'
                currentChapter= termIDs['chapter']

                $.populateChapters(chapters,chapterElement, currentChapter);

            setChapterValue : ->
                if @model.get('term_ids')['chapter']
                    @$el.find('#chapters').val @model.get('term_ids')['chapter']
                    @$el.find('#chapters').select2()
                    @$el.find('#chapters').trigger 'change'

            onFetchSubsectionsComplete : (allsections)->

                term_ids= @model.get 'term_ids'

                sectionIDs = term_ids['sections'] if term_ids?

                subSectionIDs = term_ids['subsections'] if term_ids?

                sectionsElement     = @$el.find '#secs'
                subsectionsEleemnt  = @$el.find '#subsecs'

                $.populateSections(allsections.sections,sectionsElement, sectionIDs);
                $.populateSubSections(allsections.subsections,subsectionsEleemnt, subSectionIDs);

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

