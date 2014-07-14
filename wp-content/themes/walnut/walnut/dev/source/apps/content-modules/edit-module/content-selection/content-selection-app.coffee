define ['app'
        'controllers/region-controller'
        'text!apps/content-modules/edit-module/content-selection/templates/content-selection.html'], (App, RegionController, contentSelectionTpl)->
    App.module "ContentSelectionApp.Controller", (Controller, App)->
        class Controller.ContentSelectionController extends RegionController

            initialize: (opts) ->

                @textbooksCollection = App.request "get:textbooks"
                @contentPiecesCollection = App.request "get:content:pieces",
                    post_status: 'publish',
                    content_type: ['teacher_question','content_piece']

                {@model,@contentGroupCollection}= opts

                App.execute "when:fetched", [@contentPiecesCollection,@contentGroupCollection, @textbooksCollection], =>
                    @contentPiecesCollection.remove model for model in @contentGroupCollection.models
                    @view = view = @_getContentSelectionView(@contentPiecesCollection)
                    @show @view,
                        loading: true

                    term_ids = @model.get 'term_ids'

                    @listenTo @view, "show",=>
                        if term_ids
                            textbook_id = term_ids['textbook']

                            chapter_id = term_ids['chapter'] if term_ids['chapter']?

                            section_id = _.first _.flatten(term_ids['sections']) if term_ids['sections']?

                            subsection_id = _.first _.flatten(term_ids['subsections']) if term_ids['subsections']?

                            #fetch chapters based on the current content piece's textbook
                            @fetchSectionOrSubsection(textbook_id, 'textbooks-filter', chapter_id) if textbook_id?

                            #fetch sections based on chapter id
                            @fetchSectionOrSubsection(chapter_id, 'chapters-filter',section_id) if chapter_id?

                            #fetch sub sections based on chapter id
                            @fetchSectionOrSubsection(section_id, 'sections-filter',subsection_id) if section_id?


                    @listenTo @view, "fetch:chapters:or:sections", @fetchSectionOrSubsection

                    @listenTo @view, "add:content:pieces": (contentIDs) =>

                        _.each contentIDs, (ele, index)=>
                            @contentGroupCollection.add @contentPiecesCollection.get ele
                            @contentPiecesCollection.remove ele


                    @listenTo @contentGroupCollection, 'content:pieces:of:group:removed', @contentPieceRemoved

            fetchSectionOrSubsection:(parentID, filterType, currItem) =>
                chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
                App.execute "when:fetched", chaptersOrSections, =>
                    @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType,currItem

            contentPieceRemoved: (model)=>
                @contentPiecesCollection.add model
                @view.triggerMethod "content:piece:removed", model

            _getContentSelectionView: (collection)=>
                new DataContentTableView
                    collection: collection
                    fullCollection : collection.clone()
                    contentGroupModel : @model
                    textbooksCollection : @textbooksCollection

        class DataContentItemView extends Marionette.ItemView

            template: '<td class="v-align-middle"><div class="checkbox check-default">
                            <input class="tab_checkbox" type="checkbox" value="{{ID}}" id="checkbox{{ID}}">
                            <label for="checkbox{{ID}}"></label>
                          </div>
                        </td>
                        <td class="cpHeight">{{&post_excerpt}}</td>
                        <td>{{content_type_str}}</td>
                        <td>
                            {{#present_in_modules}}
                                <a href="#view-group/{{id}}">{{name}}</a> |
                            {{/present_in_modules}}
                         </td>
                        <td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td>'

            tagName: 'tr'

            serializeData:->
                data= super()

                #this is for display purpose only
                data.modified_date= moment(data.post_modified).format("Do MMM YYYY")

                #for sorting the column date-wise
                data.sort_date= moment(data.post_modified).format "YYYYMMDD"

                data.content_type_str=
                    _ data.content_type
                    .chain()
                    .humanize()
                    .titleize()
                    .value()

                data

        class NoDataItemView extends Marionette.ItemView

            template: 'No Content Available'

            tagName: 'td'

            onShow:->
                @$el.attr 'colspan',4

        class DataContentTableView extends Marionette.CompositeView

            template: contentSelectionTpl

            className: 'tiles white grid simple vertical green'

            emptyView: NoDataItemView

            itemView: DataContentItemView

            itemViewContainer: '#dataContentTable tbody'

            events:
                'change .filters' :(e)->
                    @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

                'change #check_all_div'     : 'checkAll'

                'click #add-content-pieces' : 'addContentPieces'

            onShow:->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @fullCollection= Marionette.getOption @, 'fullCollection'
                textbookFiltersHTML= $.showTextbookFilters  textbooks: @textbooksCollection
                @$el.find '#textbook-filters'
                .html textbookFiltersHTML

                $ "#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter"
                .select2();

                $('#dataContentTable').tablesorter();

                @contentGroupModel = Marionette.getOption @, 'contentGroupModel'

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

                $("#dataContentTable").trigger "updateCache"
                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                $('#dataContentTable').tablesorterPager pagerOptions

            checkAll: ->
                if @$el.find '#check_all'
                .is ':checked'
                    @$el.find '#dataContentTable .tab_checkbox'
                    .trigger 'click'
                    .prop 'checked', true

                else
                    @$el.find '#dataContentTable .tab_checkbox'
                    .removeAttr 'checked'

            addContentPieces: =>
                content_pieces = _.pluck(@$el.find('#dataContentTable .tab_checkbox:checked'), 'value')
                if content_pieces
                    @trigger "add:content:pieces", content_pieces
                    @fullCollection.remove(id) for id in content_pieces

            onContentPieceRemoved: (model)=>
                @fullCollection.add model

        # set handlers
        App.commands.setHandler "show:content:selectionapp", (opt = {})->
            new Controller.ContentSelectionController opt
