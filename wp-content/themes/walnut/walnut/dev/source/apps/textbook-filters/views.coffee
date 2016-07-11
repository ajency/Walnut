define ['app'], (App)->
    App.module "TextbookFiltersApp.Views", (Views, App, Backbone, Marionette, $, _)->

        class Views.TextbookFiltersView extends Marionette.ItemView

            template: '<div class="col-xs-11">
                            <div class="filters new-filter">
                                <div class="table-tools-actions">
                                    {{#divisions_filter}}
                                        <select class="select2-filters div-filters" id="divisions-filter">
                                        {{#divisions}}
                                           <option value="{{id}}">{{&name}}</option>
                                        {{/divisions}}
                                    </select>
                                    {{/divisions_filter}}

                                    {{#textbooks_multi_filter}}
                                    <select id="textbooks-filter" class="textbook-filter select2-filters multi-textbook-filter" multiple="multiple" data-placeholder="Select Textbook">
                                            <!--option value="-1" selected>Select Textbook</option-->
                                    {{#textbooks}}
                                           <option value="{{id}}">{{&name}}</option>
                                        <{{/textbooks}}
                                    </select>
                                    <button type="button" class="multi-filters">Go</button>
                                    {{/textbooks_multi_filter}}
                                    
                                    {{#textbooks_filter}}
                                    <select class="textbook-filter select2-filters div-filters" id="textbooks-filter">
                                        {{#textbooks}}
                                           <option value="{{id}}" >{{&name}}</option>
                                        {{/textbooks}}
                                    </select>
                                    {{/textbooks_filter}}

                                    {{#chapters_filter}}
                                    <select class="textbook-filter select2-filters div-filters" id="chapters-filter">
                                        <option value="">All Chapters</option>
                                    </select>
                                    {{/chapters_filter}}

                                    {{#sections_filter}}
                                    <select class="textbook-filter select2-filters div-filters" id="sections-filter">
                                        <option value="">All Sections</option>
                                    </select>
                                    {{/sections_filter}}

                                    {{#subsections_filter}}
                                    <select class="textbook-filter select2-filters div-filters" id="subsections-filter">
                                        <option value="">All Sub Sections</option>
                                    </select>
                                    {{/subsections_filter}}

                                    {{#post_status_filter}}
                                    <select class="select2-filters selectFilter div-filters" id="content-post-status-filter">
                                        <option value="any">All Status</option>
                                        <option value="pending">Under Review</option>
                                        <option value="publish">Published</option>
                                        <option value="archive">Archived</option>
                                    </select>
                                    {{/post_status_filter}}

                                    {{#post_status_report_filter}}
                                    <select class="select2-filters selectFilter div-filters" id="content-post-status-filter">
                                        <option value="any">All Status</option>
                                        <!--option value="pending">Under Review</option-->
                                        <option value="publish" selected>Published</option>
                                        <option value="archive">Archived</option>
                                    </select>
                                    {{/post_status_report_filter}}

                                    {{#module_status_filter}}
                                    <select class="select2-filters selectFilter div-filters" id="content-post-status-filter">
                                        <option value="any">All Status</option>
                                        <option value="underreview">Under Review</option>
                                        <option value="publish">Published</option>
                                        <option value="archive">Archived</option>
                                    </select>
                                    {{/module_status_filter}}

                                    {{#content_type_filter}}
                                    <select class="content-type-filter select2-filters selectFilter div-filters" id="content-type-filter">
                                        <option value="">All Types</option>
                                        {{#teacher_question}}
                                            <option value="teacher_question">Teacher Question</option>
                                        {{/teacher_question}}
                                        {{#student_question}}
                                           <option value="student_question">Student Question</option>
                                        {{/student_question}}
                                        <option value="content_piece">Content Piece</option>
                                    </select>
                                    {{/content_type_filter}}

                                    <select class="select2-filters selectFilter difficulty-level-filter div-filters" style="display: none;" id="difficulty-level-filter">
                                        <option value="">All Levels</option>
                                        <option value="1">Level 1</option>
                                        <option value="2">Level 2</option>
                                        <option value="3">level 3</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-1"></div>
                        <div class="clearfix"></div>
                        <div class="col-sm-12"></div>'

            className: 'row'

            events:
                'change #textbooks-filter.div-filters':(e)->
                    console.log "textbooks-filter"
                    @trigger "fetch:new:content", $(e.target).val()


                'click .multi-filters':->
                    console.log "multi-textbooks-filter"
                    console.log $('.multi-textbook-filter').select2("val")
                    @trigger "fetch:new:content", $('.multi-textbook-filter').select2("val")

                #'change #textbooks-multi-filter':(e)->
                #    textbookIDs = [638,636]
                #    @trigger "fetch:new:content", textbookIDs

                'change #divisions-filter':(e)->
                    console.log 'divisions-filter'
                    @trigger "fetch:textbooks:by:division", $(e.target).val()

                'change .filters.new-filter .div-filters' :(e)->
                    console.log "DIV Filters"
                    if e.target.id isnt 'divisions-filter'
                        @$el.find '.filters .table-tools-actions'
                        .append '<span class="loading-collection small">Loading... <i class="fa fa-spinner fa-spin"> </i></span>'
                        @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

                'change .filters.new-filter .multi-filters' :(e)->
                    console.log "MULTI Filters"
                    if e.target.id isnt 'divisions-filter'
                        @$el.find '.filters .table-tools-actions'
                        .append '<span class="loading-collection small">Loading... <i class="fa fa-spinner fa-spin"> </i></span>'
                        @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

                'change .content-type-filter' : (e)->
                    if $(e.target).val() is 'student_question'
                        @$el.find('.difficulty-level-filter').show()
                    else
                        @$el.find('.difficulty-level-filter').hide()
                    @setFilteredContent()
                    @trigger "update:pager"

            mixinTemplateHelpers:->
                data=super data
                textbooks = Marionette.getOption @, 'textbooksCollection'
                divisions = Marionette.getOption @, 'divisionsCollection'

                data.textbooks= textbooks.map (m)->
                    t=[]
                    t.id = m.get 'term_id'
                    t.name= m.get 'name'
                    #name= m.get 'name'
                    #name = name.split('(');
                    #t.name = name[0]
                    #console.log t.name
                    t

                if divisions
                    data.divisions = divisions.map (m)->
                        d=[]
                        d.id = m.get 'id'
                        d.name= m.get 'division'
                        d

                filters= Marionette.getOption @, 'filters'

                data.divisions_filter = true if _.contains filters, 'divisions'
                data.textbooks_multi_filter = true if _.contains filters, 'multi_textbooks'
                data.textbooks_filter = true if _.contains filters, 'textbooks'
                data.chapters_filter = true if _.contains filters, 'chapters'
                data.sections_filter = true if _.contains filters, 'sections'
                data.subsections_filter = true if _.contains filters, 'subsections'
                data.post_status_filter = true if _.contains filters, 'post_status'
                data.post_status_report_filter = true if _.contains filters, 'post_status_report'
                data.module_status_filter = true if _.contains filters, 'module_status'

                data.content_type_filter = true if _.contains filters, 'content_type'

                data.student_question = true if _.contains filters, 'student_question'
                data.teacher_question = true if _.contains filters, 'teacher_question'

                data.status_filter = true if _.contains filters, 'status'

                data


            onShow:->
                console.log "onShow"
                $ ".filters select"
                .select2();
                console.log @
                @contentGroupModel = Marionette.getOption @, 'contentGroupModel'

                console.log @contentGroupModel

                if @contentGroupModel
                    term_ids= @contentGroupModel.get 'term_ids'
                    $ "#textbooks-filter"
                    .select2().select2 'val', term_ids['textbook']

                    #@setFilteredContent()
                    @setFilteredContent()


            onFetchChaptersOrSectionsCompleted :(filteredCollection, filterType, currItem) ->

                console.log currItem
                switch filterType
                    when 'divisions-filter' then $.populateTextbooks filteredCollection, @$el, currItem
                    when 'textbooks-filter' then $.populateChapters filteredCollection, @$el, currItem
                    when 'chapters-filter' then $.populateSections filteredCollection, @$el, currItem
                    when 'sections-filter' then $.populateSubSections filteredCollection, @$el, currItem

                @setFilteredContent() if filterType not in ['divisions-filter','textbooks-filter']


            setFilteredContent:->
                console.log "setFilteredContent"
                console.log @
                dataType= Marionette.getOption @, 'dataType'
                #console.log dataType
                filtered_data= $.filterTableByTextbooks(@,dataType)
                console.log filtered_data

                @collection.reset filtered_data
                @trigger "update:pager"
                @$el.find '.loading-collection'
                .remove()

            onNewContentFetched:->
                @setFilteredContent()

            onDivisionChanged:(textbooksCollection)->
