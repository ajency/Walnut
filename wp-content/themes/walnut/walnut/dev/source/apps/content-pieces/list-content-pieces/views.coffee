define ['app'
        'text!apps/content-pieces/list-content-pieces/templates/content-pieces-list-tpl.html'], (App, contentListTpl, listitemTpl, notextbooksTpl)->
    App.module "ContentPiecesApp.ContentList.Views", (Views, App)->
        class ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className: 'gradeX odd'

            template:   '<td class="cpHeight">{{&post_excerpt}}</td>
                                    <td class="cpHeight">{{&present_in_str}}</td>
                                    <td>{{textbookName}}</td>
                                    <td>{{chapterName}}</td>
                                    <td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td>
                                    <td>{{&statusMessage}}</td>
                                    <td class="text-center"><a target="_blank" href="{{view_url}}">View</a>
                                        {{&edit_link}}
                                    {{#archivedModule}}<span class="nonDevice">|</span><a target="_blank"  class="nonDevice cloneModule">Clone</a>{{/archivedModule}}</td>'

            serializeData:->
                data= super()

                #this is for display purpose only
                data.modified_date= moment(data.post_modified).format("Do MMM YYYY")

                #for sorting the column date-wise
                data.sort_date= moment(data.post_modified).format "YYYYMMDD"

                data.view_url = SITEURL + '/#content-piece/'+data.ID
                edit_url = SITEURL + '/content-creator/#edit-content/'+data.ID
                data.edit_link= ''

                if data.post_status is 'pending'
                    data.edit_link= ' <span class="nonDevice">|</span> <a target="_blank" href="'+edit_url+'" class="nonDevice">Edit</a>'

                data.textbookName = =>
                    if data.term_ids.textbook
                        textbook = _.findWhere @textbooks, "id" : data.term_ids.textbook
                        textbook.name

                data.chapterName = =>
                    if data.term_ids.chapter
                        chapter = _.chain @chapters.findWhere "id" : data.term_ids.chapter
                        .pluck 'name'
                            .compact()
                            .value()
                        chapter

                data.statusMessage = ->
                    if data.post_status is 'pending'
                        return '<span class="label label-important">Under Review</span>'
                    else if data.post_status is 'publish'
                        return '<span class="label label-info">Published</span>'
                    else if data.post_status is 'archive'
                        return '<span class="label label-success">Archived</span>'

                data.archivedModule = true if data.post_status in ['publish', 'archive']

                modules=[]
                _.each data.present_in_modules, (ele,index)->
                    modules.push "<a target='_blank' href='#view-group/"+ ele.id+"'>"+ ele.name+"</a>"

                data.present_in_str=
                    if _.size(modules)>0
                    then _.toSentence(modules)
                    else 'Not added to a module yet'

                data

            events:
                'click a.cloneModule' : 'cloneModule'

            initialize : (options)->
                @textbooks = options.textbooksCollection
                @chapters = options.chaptersCollection

            cloneModule :->
                if @model.get('post_status') in ['publish','archive']
                    if confirm("Are you sure you want to clone '#{@model.get('post_excerpt')}' ?") is true
                        @cloneModel = App.request "new:content:piece"
                        contentPieceData = @model.toJSON()
                        console.log 'contentpiecedata'
                        console.log @model.toJSON()

                        @clonedData = _.omit contentPieceData,
                                      ['ID', 'guid', 'last_modified_by', 'post_author',
                                       'post_author_name', 'post_date', 'post_date_gmt', 'published_by']

                        @clonedData.post_status = "pending"
                        @clonedData.clone_id =@model.id

                        App.execute "when:fetched", @cloneModel, =>
                            @cloneModel.save @clonedData,
                                wait : true
                                success : @successSaveFn
                                error : @errorFn

            successSaveFn : (model)=>
                document.location = SITEURL+ "/content-creator/#edit-content/#{model.id}"

        class EmptyView extends Marionette.ItemView

            template: 'No Content Available'

            tagName: 'td'

            onShow:->
                @$el.attr 'colspan',3

        class Views.ListView extends Marionette.CompositeView

            template: contentListTpl

            className: 'tiles white grid simple vertical green'

            itemView: ListItemView

            emptyView: EmptyView

            itemViewContainer: '#list-content-pieces'

            itemViewOptions : ->
                textbooksCollection : @textbooks
                chaptersCollection  : Marionette.getOption @, 'chaptersCollection'

            events:
                'change #content-post-status-filter, #difficulty-level-filter'  : 'setFilteredContent'

                'change .textbook-filter' :(e)->
                    @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

                'change .content-type-filter' : (e)->
                    if $(e.target).val() is 'student_question'
                        @$el.find('.difficulty-level-filter').show()
                    else
                        @$el.find('.difficulty-level-filter').hide()
                    @setFilteredContent()


            initialize : ->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @textbooks = new Array()
                @textbooksCollection.each (textbookModel, ind)=>
                    @textbooks.push
                        'name' : textbookModel.get('name')
                        'id' : textbookModel.get('term_id')
            onShow:->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @fullCollection = Marionette.getOption @, 'fullCollection'
                textbookFiltersHTML= $.showTextbookFilters  textbooks: @textbooksCollection
                @$el.find '#textbook-filters'
                .html textbookFiltersHTML

                @$el.find ".select2-filters"
                .select2()

                $('#content-pieces-table').tablesorter()

                pagerOptions =
                    container: $(".pager")
                    output: '{startRow} to {endRow} of {totalRows}'

                $('#content-pieces-table').tablesorterPager pagerOptions

            onFetchChaptersOrSectionsCompleted :(filteredCollection, filterType) ->

                switch filterType
                    when 'textbooks-filter' then $.populateChapters filteredCollection, @$el
                    when 'chapters-filter' then $.populateSections filteredCollection, @$el
                    when 'sections-filter' then $.populateSubSections filteredCollection, @$el

                @setFilteredContent()


            setFilteredContent:->
                filtered_data= $.filterTableByTextbooks(@)

                @collection.set filtered_data

                $('#content-pieces-table').trigger "updateCache"
                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                $('#content-pieces-table').tablesorterPager pagerOptions