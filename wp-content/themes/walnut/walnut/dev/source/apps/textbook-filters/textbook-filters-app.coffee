define ['app'
        'controllers/region-controller'
        'apps/textbook-filters/views'
], (App, RegionController)->
    App.module "TextbookFiltersApp", (TextbookFilters, App, Backbone, Marionette, $, _)->
        class TextbookFilters.Controller extends RegionController
            initialize: (opts) ->

                {@collection,@model,@filters,@selectedFilterParamsObject}=opts

                @filters = ['textbooks', 'chapters','sections','subsections'] if not @filters
                @textbooksCollection = App.request "get:textbooks", "fetch_all":true

                @selectedFilterParamsObject.setHandler "get:selected:parameters", =>
                    textbook_filters= $(@view.el).find 'select.textbook-filter'
                    for ele in textbook_filters
                        if $(ele).val()?
                            term_id =
                                id : $(ele).val()
                                text : $(ele).find(':selected').text()
#                        console.log ele.id
#                        console.log term_id

                @selectedFilterParamsObject.setHandler "get:parameters:for:search", =>
                    
                    #checks for selected id based on the following order.
                    #the final term id is returned
                    
                    ele= $(@view.el).find '#textbooks-filter'
                    term_id= $(ele).val() if $(ele).val()
                    
                    ele= $(@view.el).find '#chapters-filter'
                    term_id= $(ele).val() if $(ele).val()
                    
                    ele= $(@view.el).find '#sections-filter'
                    term_id= $(ele).val() if $(ele).val()
                    
                    ele= $(@view.el).find '#subsections-filter'
                    term_id= $(ele).val() if $(ele).val()
                    
                    ele= $(@view.el).find '#content-post-status-filter'
                    post_status= $(ele).val()

                    ele= $(@view.el).find '#content-type-filter'
                    content_type= $(ele).val()
                    
                    data=
                      'term_id': term_id
                      'post_status': post_status
                      'content_type': content_type


                App.execute "when:fetched", @textbooksCollection,=>
                    @view = view = @_getTextbookFiltersView @collection
                    @show @view,
                        loading: true

                    @listenTo @view, "update:pager", => @region.trigger "update:pager"

                    @listenTo @view, "show",=>
                        if @model
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
                new TextbookFilters.Views.TextbookFiltersView
                    collection: collection
                    fullCollection : collection.clone()
                    contentGroupModel : @model
                    textbooksCollection : @textbooksCollection
                    filters             : @filters



        # set handlers
        App.commands.setHandler "show:textbook:filters:app", (opt = {})->
            new TextbookFilters.Controller opt