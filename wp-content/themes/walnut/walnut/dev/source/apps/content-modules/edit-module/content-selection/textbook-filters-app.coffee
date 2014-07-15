define ['app'
        'controllers/region-controller'
], (App, RegionController)->
    App.module "TextbookFiltersApp", (TextbookFilters, App, Backbone, Marionette, $, _)->
        class TextbookFilters.Controller extends RegionController
            initialize: (opts) ->

                {@contentPiecesCollection,@model,@textbooksCollection}=opts

                @view = view = @_getTextbookFiltersView @contentPiecesCollection
                @show @view,
                    loading: true

                @listenTo @view, "show",=>
                    term_ids = @model.get 'term_ids'

                    if term_ids
                        textbook_id = term_ids['textbook']

                        chapter_id = term_ids['chapter'] if term_ids['chapter']?

                        section_id = _.first _.flatten(term_ids['sections']) if term_ids['sections']?

                        subsection_id = _.first _.flatten(term_ids['subsections']) if term_ids['subsections']?

                        #fetch chapters based on the current content piece's textbook
                        fetchChapters=@fetchSectionOrSubsection(textbook_id, 'textbooks-filter', chapter_id) if textbook_id?
                        fetchSections=@fetchSectionOrSubsection(chapter_id, 'chapters-filter', section_id) if chapter_id?

                        fetchChapters.done =>
                            #fetch sections based on chapter id
                            @fetchSectionOrSubsection(chapter_id, 'chapters-filter',section_id) if chapter_id?

                            fetchSections.done =>
                                #fetch sub sections based on chapter id
                                @fetchSectionOrSubsection(section_id, 'sections-filter',subsection_id) if section_id?

                @listenTo @view, "fetch:chapters:or:sections", @fetchSectionOrSubsection

            fetchSectionOrSubsection:(parentID, filterType, currItem) =>
                defer = $.Deferred()

                chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
                App.execute "when:fetched", chaptersOrSections, =>
                    @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType,currItem
                    defer.resolve()

                defer.promise()

            _getTextbookFiltersView: (collection)=>
                new TextbookFiltersView
                    collection: collection
                    fullCollection : collection.clone()
                    contentGroupModel : @model
                    textbooksCollection : @textbooksCollection

            class TextbookFiltersView extends Marionette.ItemView

                template: '<div class="col-xs-11">
                            <div class="filters">
                                <div class="table-tools-actions">
                                    <span id="textbook-filters"></span>
                                    <select class="content-type-filter" id="content-type-filter" style="width:150px">
                                        <option value="">All</option>
                                        <option value="teacher_question">Teacher Question</option>
                                        <option value="content_piece">Content Piece</option>
                                    </select>

                                </div>
                            </div>
                        </div>
                        <div class="col-xs-1"></div>
                        <div class="clearfix"></div>
                        <div class="col-sm-12"></div>'

                className: 'row'

                events:
                    'change .filters' :(e)->
                        @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

                    'change #check_all_div'     : 'checkAll'

                    'click #add-content-pieces' : 'addContentPieces'

                onShow:->
                    @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                    @fullCollection= Marionette.getOption @, 'fullCollection'
                    textbookFiltersHTML= $.showTextbookFilters  textbooks: @textbooksCollection
                    @$el.find '#textbook-filters'
                    .html textbookFiltersHTML

                    $ "#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter"
                    .select2();

                    $('#dataContentTable').tablesorter();

                    @contentGroupModel = Marionette.getOption @, 'contentGroupModel'

                    term_ids= @contentGroupModel.get 'term_ids'
                    $ "#textbooks-filter"
                    .select2().select2 'val', term_ids['textbook']

                    @setFilteredContent()


                onFetchChaptersOrSectionsCompleted :(filteredCollection, filterType, currItem) ->

                    switch filterType
                        when 'textbooks-filter' then $.populateChapters filteredCollection, @$el, currItem
                        when 'chapters-filter' then $.populateSections filteredCollection, @$el, currItem
                        when 'sections-filter' then $.populateSubSections filteredCollection, @$el, currItem

                    @setFilteredContent()


                setFilteredContent:->

                    filtered_data= $.filterTableByTextbooks(@)

                    @collection.set filtered_data

                    $("#dataContentTable").trigger "updateCache"
                    pagerOptions =
                        container : $(".pager")
                        output : '{startRow} to {endRow} of {totalRows}'

                    $('#dataContentTable').tablesorterPager pagerOptions

        # set handlers
        App.commands.setHandler "show:textbook:filters:app", (opt = {})->
            new TextbookFilters.Controller opt