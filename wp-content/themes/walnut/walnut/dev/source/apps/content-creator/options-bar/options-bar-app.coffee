define ['app'
        'controllers/region-controller'
        'apps/content-creator/options-bar/options-bar-views'

], (App, RegionController)->
    App.module "ContentCreator.OptionsBar", (OptionsBar, App, Backbone, Marionette, $, _)->
        class OptionsBarController extends RegionController

            initialize: (options)->
                {@contentPieceModel}= options

                @view = @_getOptionsBarView()

                @textbooksCollection = App.request "get:textbooks"

                App.execute "when:fetched", [@textbooksCollection, @contentPieceModel], @showView

                @listenTo @view, "save:data:to:model", (data)=>
                    @contentPieceModel.set data
                    App.execute "save:question"

                @listenTo @view, 'show:grading:parameter',()=>
                    @region.trigger 'show:grading:parameter'

                @listenTo @view, 'close:grading:parameter',()=>
                    @region.trigger 'close:grading:parameter'




            showView: =>
                @show @view, (loading: true, entities: [@textbooksCollection])

                ## for edit content piece
                # fetching the correct textbook, chapters, sections & subsections
                # term_ids contain an array of textbook id, chapter id, section ids and subsection ids
                term_ids = @contentPieceModel.get 'term_ids'

                if term_ids
                    textbook_id = term_ids['textbook']

                    chapter_id = term_ids['chapter'] if term_ids['chapter']?

                    #fetch chapters based on the current content piece's textbook
                    @_fetchChapters(textbook_id, chapter_id) if textbook_id?

                    #fetch sections based on chapter id
                    @_fetchSections(chapter_id) if chapter_id?

                ## end of fetching of edit content piece

                ## listening to change in textbook to fetch new list of chapters
                # and sections
                @listenTo @view, "fetch:chapters", @_fetchChapters

                @listenTo @view, "fetch:sections", @_fetchSections

                @listenTo @view, "fetch:subsections", @_fetchSubsections

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

            _getOptionsBarView: =>
                new OptionsBar.Views.OptionsBarView
                    model: @contentPieceModel
                    templateHelpers: @_getTemplateHelpers()


            _getTemplateHelpers: ->
                textbooksFilter: =>
                    textbooks = new Array()

                    term_ids = @contentPieceModel.get 'term_ids'
                    textbook_id = term_ids['textbook'] if term_ids?

                    @textbooksCollection.each (el, ind)->
                        data =
                            'name': el.get('name')
                            'id': el.get('term_id')

                        if textbook_id and textbook_id is el.get('term_id')
                            data['selected'] = 'selected'

                        textbooks.push data

                    textbooks

        #                studentQuestion: if @contentPieceModel.get('content_type') is 'student_question'
        #                then true else false


        App.commands.setHandler "show:options:bar", (options)->
            new OptionsBarController options