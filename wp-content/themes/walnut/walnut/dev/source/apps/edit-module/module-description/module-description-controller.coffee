define ['app'
        'controllers/region-controller'
        'apps/edit-module/module-description/module-description-views'
], (App, RegionController)->
    App.module "EditCollecionDetailsApp", (EditCollecionDetailsApp, App)->

        class EditCollecionDetailsApp.Controller extends RegionController

            initialize : (opts)->
                {@model,@contentGroupCollection}= opts

                @textbooksCollection = App.request "get:textbooks", "fetch_all":true

                App.execute "when:fetched", [@textbooksCollection], @showView

            showView : =>
                @view = view = @_getCollectionDetailsView @model


                if @model.get('type') is 'quiz'

                    if not @model.get('message')? or @model.get('message') is '' 
                        @model.set 'message' ,{}

                    @message = @model.get('message')

                    @listenTo @view, 'show:custom:msg:popup',(options)=>
                        slug = options.slug
                        if not @message[slug]? then  @message[slug]=''

                        App.execute 'show:single:edit:popup',
                            title :  slug
                            textArray : @message


                term_ids = @model.get 'term_ids'

                @listenTo @view, "show",=>
                    if _.size(term_ids) >0
                        textbook_id = term_ids['textbook']

                        chapter_id = term_ids['chapter'] if term_ids['chapter']?

                        section_ids = _.flatten(term_ids['sections']) if term_ids['sections']?

                        #fetch chapters based on the current content piece's textbook
                        fetchChapters= @_fetchChapters(textbook_id, chapter_id)

                        #fetch sections based on chapter id
                        fetchChapters.done =>
                            @_fetchSections(chapter_id) if chapter_id?

                            #fetch sections based on chapter id
                            @_fetchSubsections(section_ids) if section_ids?


                ## end of fetching of edit content piece

                ## listening to change in textbook to fetch new list of chapters
                # and sections
                @listenTo @view, "fetch:chapters", @_fetchChapters

                @listenTo @view, "fetch:sections", @_fetchSections

                @listenTo @view, "fetch:subsections", @_fetchSubsections

                @listenTo @view, "save:content:collection:details" , (data) =>
                    @model.set 'changed' : 'module_details'
                    @model.save(data, { wait : true, success : @successFn, error : @errorFn })
                    @region.trigger "close:content:selection:app" if data.post_status isnt 'underreview'

                @show view, (loading : true, entities : [@textbooksCollection])

            successFn : (model)=>
                App.navigate "edit-module/#{model.get('id')}" if @model.get('type') is 'teaching-module'
                App.navigate "edit-quiz/#{model.get('id')}" if @model.get('type') is 'quiz'
                @view.triggerMethod 'saved:content:group', model

            errorFn : ->
                console.log 'error'

            ##fetch chapters based on textbook id, current_chapter refers to the chapter to be selected by default
            _fetchChapters: (term_id, current_chapter)=>
                defer = $.Deferred();
                chaptersCollection = App.request "get:chapters", ('parent': term_id)

                App.execute "when:fetched", chaptersCollection, =>
                    @view.triggerMethod 'fetch:chapters:complete',
                      chaptersCollection, current_chapter
                    defer.resolve()
                defer.promise()

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






            _getCollectionDetailsView : (model)->
                new EditCollecionDetailsApp.Views.CollectionDetailsView
                    model : model
                    contentGroupCollection: @contentGroupCollection
                    templateHelpers :
                        textbooksFilter : =>
                            textbooks = []
                            _.each @textbooksCollection.models, (el, ind)->
                                textbooks.push
                                    'name' : el.get('name')
                                    'id' : el.get('term_id')

                            textbooks


        # set handlers
        App.commands.setHandler "show:editgroup:content:group:detailsapp", (opt = {})->
            new  EditCollecionDetailsApp.Controller opt