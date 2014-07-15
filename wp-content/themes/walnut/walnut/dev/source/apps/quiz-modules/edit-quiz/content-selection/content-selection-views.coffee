define ['app'
        'text!apps/quiz-modules/edit-quiz/content-selection/templates/content-selection.html'
], (App, contentSelectionTmpl)->
    App.module 'QuizModuleApp.EditQuiz.ContentSelection.Views', (Views, App)->
        class NoDataItemView extends Marionette.ItemView

            template : 'No Content Available'

            tagName : 'td'

            onShow : ->
                @$el.attr 'colspan', 4

        class DataContentItemView extends Marionette.ItemView

            template: '<td class="v-align-middle"><div class="checkbox check-default">
                                        <input class="tab_checkbox" type="checkbox" value="{{ID}}" id="checkbox{{ID}}">
                                        <label for="checkbox{{ID}}"></label>
                                      </div>
                                    </td>
                                    <td>{{post_excerpt}}</td>
                                    <td>{{post_author_name}}</td>
                                    <td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td>'

            tagName: 'tr'

            serializeData:->
                data= super()

                #this is for display purpose only
                data.modified_date= moment(data.post_modified).format("Do MMM YYYY")

                #for sorting the column date-wise
                data.sort_date= moment(data.post_modified).format "YYYYMMDD"

                data

        class Views.DataContentTableView extends Marionette.CompositeView

            template : contentSelectionTmpl

            className : 'tiles grey grid simple vertical blue animated slideInRight'

            emptyView : NoDataItemView

            itemView: DataContentItemView

            itemViewContainer : '#dataContentTable tbody'

            events :
                'change .filters' : (e)->
                    console.log 'change'
                    @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

            onShow : ->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @fullCollection = Marionette.getOption @, 'fullCollection'
                textbookFiltersHTML = $.showTextbookFilters textbooks : @textbooksCollection
                @$el.find('#textbook-filters').html textbookFiltersHTML

                @$el.find("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter").select2()

                @$el.find('#dataContentTable').tablesorter()

                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                @$el.find('#dataContentTable').tablesorterPager pagerOptions

            onFetchChaptersOrSectionsCompleted : (filteredCollection, filterType) ->
                switch filterType
                    when 'textbooks-filter' then $.populateChapters filteredCollection, @$el
                    when 'chapters-filter' then $.populateSections filteredCollection, @$el
                    when 'sections-filter' then $.populateSubSections filteredCollection, @$el

                filtered_data = $.filterTableByTextbooks(@)

                @collection.set filtered_data

                @$el.find("#dataContentTable").trigger "updateCache"
                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                @$el.find('#dataContentTable').tablesorterPager pagerOptions