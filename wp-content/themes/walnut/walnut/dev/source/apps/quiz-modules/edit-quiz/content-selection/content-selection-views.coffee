define ['app'
        'text!apps/quiz-modules/edit-quiz/content-selection/templates/content-selection.html'
], (App, contentSelectionTmpl)->
    App.module 'QuizModuleApp.EditQuiz.QuizContentSelection.Views', (Views, App)->
        class NoDataItemView extends Marionette.ItemView

            template : 'No Content Available'

            tagName : 'td'

            onShow : ->
                @$el.attr 'colspan', 4

        class DataContentItemView extends Marionette.ItemView

            template : '<td class="v-align-middle"><div class="checkbox check-default">
                                                    <input class="tab_checkbox" type="checkbox" value="{{ID}}" id="checkbox{{ID}}">
                                                    <label for="checkbox{{ID}}"></label>
                                                  </div>
                                                </td>
                                                <td>{{post_excerpt}}</td>
                                                <td>{{post_author_name}}</td>
                                                <td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td>'

            tagName : 'tr'

            serializeData : ->
                data = super()

                #this is for display purpose only
                data.modified_date = moment(data.post_modified).format("Do MMM YYYY")

                #for sorting the column date-wise
                data.sort_date = moment(data.post_modified).format "YYYYMMDD"

                data

        class Views.DataContentTableView extends Marionette.CompositeView

            template : contentSelectionTmpl

            className : 'tiles grey grid simple vertical blue animated slideInRight'

            emptyView : NoDataItemView

            itemView : DataContentItemView

            itemViewContainer : '#dataContentTable tbody'

            events :->
                'change .filters' : (e)->
                    @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

                'click #addContent a' : (e)->
                    e.preventDefault()
                    $(e.target).tab('show')

                'change #check_all'     : 'checkAll'

                'change .level-selection input' : '_onSpinEditValueChanged'
                'click #add-set-button' : '_addSet'
                'click #add-content-pieces' : '_addContentPieces'
                'change #selectAll' : '_selectAllForSet'

            initialize : ->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @fullCollection = Marionette.getOption @, 'fullCollection'

            onShow : ->

                textbookFiltersHTML = $.showTextbookFilters textbooks : @textbooksCollection
                @$el.find('#textbook-filters').html textbookFiltersHTML

                @$el.find("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter").select2()

                @$el.find('#dataContentTable').tablesorter()

                @_setLevelCount()

                @_updatePager()

            # when item as added on delete from the quiz
            onAfterItemAdded: (options)=>
                @fullCollection.add options.model
                @$el.find("#dataContentTable").trigger "updateCache"
                @_updatePager()


            onFetchChaptersOrSectionsCompleted : (filteredCollection, filterType, currItem) ->
                switch filterType
                    when 'textbooks-filter' then $.populateChapters filteredCollection, @$el
                    when 'chapters-filter' then $.populateSections filteredCollection, @$el
                    when 'sections-filter' then $.populateSubSections filteredCollection, @$el

                @setFilteredContent()


            setFilteredContent : ->
                filtered_data = $.filterTableByTextbooks(@)

                @collection.set filtered_data

                @_setLevelCount()
                @$el.find('#selectAll').prop 'checked',false

                @$el.find("#dataContentTable").trigger "updateCache"

                @_updatePager()



            _setLevelCount : ->
                levelCount = @collection.countBy 'difficulty_level'
                console.log levelCount

                for i in [ 1..3 ]
                    count = levelCount["#{i}"] ? 0
                    @$el.find("#lvl#{i}").find(" input, .spinedit").remove()
                    @$el.find("#lvl#{i}").append "<input type='text'  />"
                    @$el.find("#lvl#{i} input").spinedit
                        minimum : 0
                        maximum : count
                        value : 0
                    @$el.find("#lvl#{i} span").text count

            _onSpinEditValueChanged : =>
                total = 0
                _.each @$el.find(".level-selection input.spinedit"), (num)->
                    total += parseInt $(num).val()
                console.log total
                @$el.find('#total-questions').val total


            _updatePager : ->
                console.log 'update pager'
                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                @$el.find('#dataContentTable').tablesorterPager pagerOptions

            _selectAllForSet : (e)->
                if $(e.target).is(':checked')
                    levelCount = @collection.countBy 'difficulty_level'
                    @$el.find("#lvl1 input").val(levelCount["1"] ? 0)
                    @$el.find("#lvl2 input").val(levelCount["2"] ? 0)
                    @$el.find("#lvl3 input").val(levelCount["3"] ? 0)
                    @_onSpinEditValueChanged()
                else
                    @$el.find("#lvl1 input").val( 0)
                    @$el.find("#lvl2 input").val( 0)
                    @$el.find("#lvl3 input").val( 0)
                    @_onSpinEditValueChanged()

            _addSet : ->
                terms_id =
                    textbook : @$el.find('#textbooks-filter').val()
                    chapter : @$el.find('#chapters-filter').val()
                    section : @$el.find('#sections-filter').val()
                    subsection : @$el.find('#subsections-filter').val()
                data =
                    terms_id : terms_id
                    textbook : @$el.find('#textbooks-filter :selected').text()
                    chapter : @$el.find('#chapters-filter :selected').text()
                    section : @$el.find('#sections-filter :selected').text()
                    'sub-section' : @$el.find('#subsections-filter :selected').text()
                    lvl1 : @$el.find("#lvl1 input").val()
                    lvl2 : @$el.find("#lvl2 input").val()
                    lvl3 : @$el.find("#lvl3 input").val()
                    post_type : 'content_set'

                _.each ['textbook','chapter','section','sub-section'],(attr)->
                    console.log data[attr]

                    x= _.slugify data[attr]
                    if not data[attr]? or data[attr] is '' or _.slugify(data[attr]) is _.slugify("All #{attr}s")
                        data[attr] = "ALL"

                @trigger "add:new:set",data

                @$el.find("#addSet input[type='text']").val 0
                @$el.find('#selectAll').prop 'checked',false


            checkAll: (e)->
                if $(e.target).is ':checked'
                    console.log 'dd'
                    @$el.find '#dataContentTable .tab_checkbox'
                    .trigger 'click'
                        .prop 'checked', true

                else
                    @$el.find '#dataContentTable .tab_checkbox'
                    .removeAttr 'checked'

            _addContentPieces : =>

                content_pieces = _.pluck(@$el.find('#dataContentTable .tab_checkbox:checked'), 'value')
                if content_pieces
                    @trigger "add:content:pieces", content_pieces
                    @fullCollection.remove(id) for id in content_pieces
                    @$el.find("#dataContentTable").trigger "updateCache"
                    @_updatePager()


