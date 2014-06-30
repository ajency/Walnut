define ['app'
        'text!apps/content-pieces/list-content-pieces/templates/content-pieces-list-tpl.html'], (App, contentListTpl, listitemTpl, notextbooksTpl)->
    App.module "ContentPiecesApp.ContentList.Views", (Views, App)->
        class ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className: 'gradeX odd'

            template:   '<td>{{&post_excerpt}}</td>
                                    <td>{{post_author_name}}</td>
                                    <td>{{textbookName}}</td>
                                    <td>{{chapterName}}</td>
                                    <td>{{modified_date}}</td>
                                    <td>{{&statusMessage}}</td>
                                    <td class="text-center"><a target="_blank" href="{{view_url}}">View</a>
                                        {{&edit_link}}</td>'

            serializeData:->
                data= super()
                data.modified_date= moment(data.post_modified).format("Do MMM YYYY")
                data.view_url = SITEURL + '/#content-piece/'+data.ID
                edit_url = SITEURL + '/content-creator/#edit-content/'+data.ID
                data.edit_link= ''

                if data.post_status is 'pending'
                    data.edit_link= ' <span class="nonDevice">|</span> <a target="_blank" href="'+edit_url+'" class="nonDevice">Edit</a>'

                data.textbookName = =>
                    textbook = _.findWhere @textbooks, "id" : data.term_ids.textbook
                    textbook.name

                data.chapterName = =>
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

                data.archivedModule = true if data.status in ['publish', 'archive']

                data


            initialize : (options)->
                @textbooks = options.textbooksCollection
                @chapters = options.chaptersCollection


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
                'change #content-post-status-filter, .content-type-filter'  :->
                    @setFilteredContent()

                'change .textbook-filter' :(e)->
                    @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

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
                textbookFiltersHTML= $.showTextbookFilters @textbooksCollection
                @$el.find '#textbook-filters'
                .html textbookFiltersHTML

                @$el.find ".select2-filters"
                .select2()

                $('#content-pieces-table').tablesorter();

                pagerOptions =
                    container: $(".pager"),
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