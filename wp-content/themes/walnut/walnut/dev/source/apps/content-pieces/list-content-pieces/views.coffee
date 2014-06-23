define ['app'
        'text!apps/content-pieces/list-content-pieces/templates/content-pieces-list-tpl.html'], (App, contentListTpl, listitemTpl, notextbooksTpl)->
    App.module "ContentPiecesApp.ContentList.Views", (Views, App)->
        class ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className: 'gradeX odd'

            template:   '<td>{{&post_excerpt}}</td>
                        <td>{{post_author_name}}</td>
                        <td>{{modified_date}}</td>
                        <td class="text-center"><a target="_blank" href="{{view_url}}">View</a> <span class="nonDevice">|</span>
                            <a target="_blank" href="{{edit_url}}" class="nonDevice">Edit</a></td>'

            serializeData:->
                data= super()
                data.modified_date= moment(@model.get('post_modified')).format("Do MMM YYYY")
                data.view_url = SITEURL + '/#content-piece/'+@model.get 'ID'
                data.edit_url = SITEURL + '/content-creator/#edit-content/'+@model.get 'ID'
                data

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

            events:
                'change .filters' :(e)->
                    @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

            onShow:->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @fullCollection = Marionette.getOption @, 'fullCollection'
                textbookFiltersHTML= $.showTextbookFilters @textbooksCollection
                @$el.find '#textbook-filters'
                .html textbookFiltersHTML

                $ "#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter"
                .select2();

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

                filtered_data= $.filterTableByTextbooks(@)

                @collection.set filtered_data

                $("#content-pieces-table").trigger "updateCache"
                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                $('#content-pieces-table').tablesorterPager pagerOptions