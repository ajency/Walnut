define ['app'], (App)->
    App.module "TextbookFiltersApp.Views", (Views, App, Backbone, Marionette, $, _)->

        class Views.TextbookFiltersView extends Marionette.ItemView

            template: '<div class="col-xs-11">
                            <div class="filters">
                                <div class="table-tools-actions">

                                    {{#textbooks_filter}}
                                    <select class="textbook-filter select2-filters" id="textbooks-filter">
                                        <option value="">All Textbooks</option>
                                        {{#textbooks}}
                                           <option value="{{id}}">{{name}}</option>
                                        {{/textbooks}}
                                    </select>
                                    {{/textbooks_filter}}

                                    {{#chapters_filter}}
                                    <select class="textbook-filter select2-filters" id="chapters-filter">
                                        <option value="">All Chapters</option>
                                    </select>
                                    {{/chapters_filter}}

                                    {{#sections_filter}}
                                    <select class="textbook-filter select2-filters" id="sections-filter">
                                        <option value="">All Sections</option>
                                    </select>
                                    {{/sections_filter}}

                                    {{#subsections_filter}}
                                    <select class="textbook-filter select2-filters" id="subsections-filter">
                                        <option value="">All Sub Sections</option>
                                    </select>
                                    {{/subsections_filter}}

                                    {{#post_status_filter}}
                                    <select class="select2-filters selectFilter" id="content-post-status-filter">
                                        <option value="">All Status</option>
                                        <option value="pending">Under Review</option>
                                        <option value="publish">Published</option>
                                        <option value="archive">Archived</option>
                                    </select>
                                    {{/post_status_filter}}

                                    {{#module_status_filter}}
                                    <select class="select2-filters selectFilter" id="content-post-status-filter">
                                        <option value="">All Status</option>
                                        <option value="underreview">Under Review</option>
                                        <option value="publish">Published</option>
                                        <option value="archive">Archived</option>
                                    </select>
                                    {{/module_status_filter}}

                                    {{#content_type_filter}}
                                    <select class="content-type-filter select2-filters selectFilter" id="content-type-filter">
                                        <option value="">All Types</option>
                                        <option value="teacher_question">Teacher Question</option>
                                        {{#student_question}}
                                           <option value="student_question">Student Question</option>
                                        {{/student_question}}
                                        <option value="content_piece">Content Piece</option>
                                    </select>
                                    {{/content_type_filter}}

                                    <select class="select2-filters selectFilter difficulty-level-filter" style="display: none;" id="difficulty-level-filter">
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
                'change .filters' :(e)->
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

                data.textbooks= textbooks.map (m)->
                    t=[]
                    t.id = m.get 'term_id'
                    t.name= m.get 'name'
                    t

                filters= Marionette.getOption @, 'filters'

                data.textbooks_filter = true if _.contains filters, 'textbooks'
                data.chapters_filter = true if _.contains filters, 'chapters'
                data.sections_filter = true if _.contains filters, 'sections'
                data.subsections_filter = true if _.contains filters, 'subsections'
                data.post_status_filter = true if _.contains filters, 'post_status'
                data.module_status_filter = true if _.contains filters, 'module_status'

                data.content_type_filter = true if _.contains filters, 'content_type'

                data.student_question = true if _.contains filters, 'student_question'

                data.status_filter = true if _.contains filters, 'status'

                data


            onShow:->

                @fullCollection= Marionette.getOption @, 'fullCollection'

                $ ".filters select"
                .select2();

                @contentGroupModel = Marionette.getOption @, 'contentGroupModel'

                if @contentGroupModel
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

                @trigger "update:pager"