define ['jquery', 'underscore'], ($, _)->

    $.showTextbookFilters =(textbooks) ->

        textbookItems= ''
        textbooks.each (t) ->
            textbookItems += '<option value='+t.get('term_id')+'>'+t.get('name')+'</option>'

        divHtml= '<select class="textbook-filter select2-filters" id="textbooks-filter" style="width:150px">
                            <option value="">All Textbooks</option>'+textbookItems +
        '</select>
                        <select class="textbook-filter select2-filters" id="chapters-filter" style="width:150px">
                            <option value="">All Chapters</option>
                        </select>
                        <select class="textbook-filter select2-filters" id="sections-filter" style="width:150px">
                            <option value="">All Sections</option>
                        </select>
                        <select class="textbook-filter select2-filters" id="subsections-filter" style="width:200px">
                            <option value="">All Sub Sections</option>
                        </select>'

    # populate chapters/sections/subsections
    # items is either the collection or individual models
    # ele is the DOM element which will get populated
    # curr_item is the current value for the model in edit mode
    # ie. values which must be selected by default

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


    $.filterTableByTextbooks = (_this)->
        filter_elements= _this.$el.find('select.textbook-filter')

        fullCollection = _this.fullCollection

        filter_ids=_.map filter_elements, (ele,index)->
            item = ''
            if not isNaN ele.value
                item= ele.value
            item
        filter_ids= _.compact filter_ids

        content_type = _this.$el.find('#content-type-filter').val()
        content_status = _this.$el.find('#content-status-filter').val()

        content_post_status = _this.$el.find('#content-post-status-filter').val()

        filtered_models= fullCollection.models

        if content_type
            filtered_models =  fullCollection.where 'content_type': content_type

        if content_status
            filtered_models =  fullCollection.where 'status': content_status

        if content_post_status
            filtered_models =  fullCollection.where 'post_status': content_post_status

        if _.size(filter_ids) > 0
            filtered_data = _.filter filtered_models, (item)=>
                filtered_item = ''
                term_ids = _.flatten item.get 'term_ids'

                if _.size(_.intersection(term_ids, filter_ids)) == _.size(filter_ids)
                    filtered_item = item
                filtered_item
        else
            filtered_data = filtered_models

        filtered_data