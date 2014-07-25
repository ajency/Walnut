define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/edit-quiz/quiz-description/quiz-description-views'
], (App, RegionController, collectionDetailsTpl)->
    App.module "QuizModuleApp.EditQuiz.QuizDetails", (QuizDetails, App)->

        class QuizDetails.Controller extends RegionController

            initialize : (opts)->
                {@model,@textbooksCollection}= opts
                @message = @model.get('message')

                @view = @_getQuizDetailsView()

                @listenTo @view, 'show:custom:msg:popup',(options)=>
                    slug = options.slug
                    if not @message[slug]? then  @message[slug]=''

                    App.execute 'show:single:edit:popup',
                        title :  slug
                        textArray : @message

                term_ids = @model.get 'term_ids'

                @listenTo @view, "show",=>
                    if term_ids
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


                @listenTo @view, "fetch:chapters", @_fetchChapters

                @listenTo @view, "fetch:sections", @_fetchSections

                @listenTo @view, "fetch:subsections", @_fetchSubsections

                @listenTo @view, "save:quiz:details" , (data) =>
                    @model.set 'changed' , 'quiz_details'
                    @model.save(data, { wait : true, success : @successFn, error : @errorFn })
                    @region.trigger "close:content:selection:app" if data.status isnt 'underreview'

                @show @view,
                    loading : true

            successFn : (model)=>
                App.navigate "edit-quiz/#{model.get('id')}"
                @view.triggerMethod 'saved:quiz', model

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




            _getQuizDetailsView : ->
                new QuizDetails.Views.DeatailsView
                    model : @model
                    templateHelpers :
                        textbooksFilter : =>
                            textbooks = []
                            _.each @textbooksCollection.models, (el, ind)->
                                textbooks.push
                                    'name' : el.get('name')
                                    'id' : el.get('term_id')

                            textbooks



        # set handlers
        App.commands.setHandler "show:edit:quiz:details", (opt = {})->
            new QuizDetails.Controller opt

