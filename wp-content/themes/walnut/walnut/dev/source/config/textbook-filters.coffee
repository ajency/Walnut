define ['jquery', 'underscore'], ($, _)->

    ##
    # eg. $.showTextbookFilters textbooks: textbookCollection
    #
    # OR $.showTextbookFilters chapters: chaptersCollection // incase you dont need the textbook filter
    #
    ##

    $.showTextbookFilters =(opts={}) ->

        divHtml= ''

        if opts.textbooks
            textbookItems= ''
            opts.textbooks.each (t) ->
                textbookItems += '<option value='+t.get('term_id')+'>'+t.get('name')+'</option>'

            divHtml +='<select class="textbook-filter select2-filters" id="textbooks-filter">
                <option value="">All Textbooks</option>'+textbookItems +
            '</select>
            <select class="textbook-filter select2-filters" id="chapters-filter">
                <option value="">All Chapters</option>
            </select>'

        if opts.chapters
            ChapterItems= ''
            opts.chapters.each (t) ->
                ChapterItems += '<option value='+t.get('term_id')+'>'+t.get('name')+'</option>'

            divHtml +='<select class="textbook-filter select2-filters" id="chapters-filter">
                            <option value="">All Chapters</option>'+ChapterItems +
            '</select>'

        divHtml += '<select class="textbook-filter select2-filters" id="sections-filter">
                            <option value="">All Sections</option>
                        </select>
                        <select class="textbook-filter select2-filters" id="subsections-filter">
                            <option value="">All Sub Sections</option>
                        </select>'

    # populate chapters/sections/subsections
    # items is either the collection or individual models
    # ele is the DOM element which will get populated
    # curr_item is the current value for the model in edit mode
    # ie. values which must be selected by default

    $.populateTextbooks = (items, ele)->
        ele.find '#textbooks-filter, #chapters-filter,#sections-filter,#subsections-filter'
        .html ''
        
        textbookElement= ele.find '#textbooks-filter'
        #console.log textbookElement

        chapterElement= ele.find '#chapters-filter'

        if items instanceof Backbone.Collection
            items= items.models

        if _.size(items) > 0

            _.each items, (item, index)=>
                #name = item.get('name')
                #name = name.split('(')
                #text = name[0]
                textbookElement.append '<option value="' + item.get('term_id') + '">' + item.get('name') + '</option>'

            textbookElement.select2().select2 'val', _.first(items).get 'term_id'
        else 
            textbookElement.select2 'data', null

    $.populateChapters = (items, ele, curr_item='' )->

        ele.find '#chapters-filter,#sections-filter,#subsections-filter'
        .html ''

        chapterElement= ele.find '#chapters-filter'
        selectedTextbook= ele.find("#textbooks-filter").val()

        if items instanceof Backbone.Collection
            items= items.models

        if _.size(items) > 0 and selectedTextbook
            chapterElement.select2 'data', 'text' : 'Select Chapter'
            chapterElement.append '<option value="">All Chapters</option>'

            _.each items, (item, index)=>
                chapterElement.append '<option value="' + item.get('term_id') + '">' + item.get('name') + '</option>'

            if curr_item
                chapterElement.select2().select2 'val', curr_item

        else
            txt = 'All' ? not selectedTextbook : 'No'

            chapterElement.select2 'data', 'text' : txt+ ' chapters'

            ele.find '#sections-filter'
            .select2 'data', 'text' :  txt+ ' Sections'

            ele.find '#subsections-filter'
            .select2 'data', 'text' :  txt+ ' Sub Sections'



    $.populateSections = (items, ele, curr_item=[] )->

        ele.find '#sections-filter,#subsections-filter'
        .html ''

        sectionElement= ele.find '#sections-filter'
        selectedChapter= ele.find("#chapters-filter").val()

        if items instanceof Backbone.Collection
            items= items.models

        if _.size(items) > 0 and selectedChapter
            sectionElement.select2 'data', 'text' : 'Select Section'
            sectionElement.append '<option value="">All Sections</option>'

            _.each items, (item, index)=>
                sectionElement.append '<option value="' + item.get('term_id') + '">' + item.get('name') + '</option>'

            curr_item = _.flatten _.compact curr_item if _.isArray curr_item
            if not _.isEmpty curr_item
                sectionElement.select2().select2 'val', curr_item

        else
            txt = 'All' ? not selectedChapter : 'No'

            sectionElement.select2 'data', 'text' :  txt+ ' Sections'

            ele.find '#subsections-filter'
            .select2 'data', 'text' :  txt+ ' Sub Sections'

    $.populateSubSections = (items, ele, curr_item=[] )->

        subsectionsElement= ele.find '#subsections-filter'

        subsectionsElement.html ''
        selectedSection= ele.find("#sections-filter").val()

        if items instanceof Backbone.Collection
            items= items.models

        if _.size(items) > 0 and selectedSection
            subsectionsElement.select2 'data', 'text' : 'Select Sub Section'
            subsectionsElement.append '<option value="">All Sections</option>'

            _.each items, (item, index)=>
                subsectionsElement.append '<option value="' + item.get('term_id') + '">' + item.get('name') + '</option>'

            curr_item = _.flatten _.compact curr_item if _.isArray curr_item
            if not _.isEmpty curr_item
                subsectionsElement.select2().select2 'val', curr_item

        else
            txt = 'All' ? not selectedSection : 'No'
            subsectionsElement.select2 'data', 'text' : txt+ ' Sub Sections'


    #For add/edit module where 'select sections/all section n all should not be displayed'
    $.populateChaptersOrSections = (items, ele, curr_item=[] )->

        ele.html ''

        if items instanceof Backbone.Collection
            items= items.models

        if _.size(items) > 0
            _.each items, (item, index)=>
                ele.append '<option value="' + item.get('term_id') + '">' + item.get('name') + '</option>'

            curr_item = _.flatten _.compact curr_item if _.isArray curr_item

            ele.select2().select2 'val', curr_item


    $.filterTableByTextbooks = (_this, dataType)->
        filter_elements= _this.$el.find('select.textbook-filter')
        
        if dataType is 'teaching-modules'
            filterCollection = App.request "get:content:modules:repository"
            
        else if dataType is 'student-training'
            filterCollection = App.request "get:student:training:modules:repository"

        else if dataType is 'quiz'
            #console.log dataType
            filterCollection = App.request "get:quiz:repository"

        else 
            filterCollection = App.request "get:content:pieces:repository"


        filter_ids =_.map filter_elements, (ele,index)->
            item = ''
            if not isNaN ele.value
                item= ele.value
            item
        filter_ids = _.compact filter_ids
        textbk_ids = $('#textbooks-filter').val()
        if typeof textbk_ids == 'string'  
            text_multi = false
        else
            text_multi = true

        content_type = _this.$el.find('#content-type-filter').val()

        content_status = _this.$el.find('#content-status-filter').val()

        content_post_status = _this.$el.find('#content-post-status-filter').val()
        content_post_status = '' if content_post_status is 'any'

        quiz_type = _this.$el.find('#quiz-type-filter').val()


        difficulty_level = parseInt _this.$el.find('#difficulty-level-filter').val()

        if content_type
            filterCollection.reset  filterCollection.where 'content_type': content_type

        if content_status
            filterCollection.reset  filterCollection.where 'status': content_status

        if content_post_status
            filterCollection.reset  filterCollection.where 'post_status': content_post_status

        if quiz_type
            filterCollection.reset  filterCollection.where 'quiz_type': quiz_type            

        if difficulty_level
            filterCollection.reset filterCollection.where 'difficulty_level' : difficulty_level

        filtered_models= filterCollection.models

        if _.size(filter_ids) > 0
            filtered_data = _.filter filtered_models, (item)=>
                filtered_item = ''
                term_ids = _.flatten item.get 'term_ids'

                if text_multi == false
                    if _.size(_.intersection(term_ids, filter_ids)) == _.size(filter_ids)
                        filtered_item = item
                else
                    filtered_item = item

                filtered_item

        else
            filtered_data = filtered_models

        filtered_data