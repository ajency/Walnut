define ['app'
        'controllers/region-controller'
        'text!apps/content-group/edit-group/content-selection/templates/content-selection.html'], (App, RegionController, contentSelectionTpl)->
    App.module "ContentSelectionApp.Controller", (Controller, App)->
        class Controller.ContentSelectionController extends RegionController

            initialize: (opts) ->

                @textbooksCollection = App.request "get:textbooks"
                @contentPiecesCollection = App.request "get:content:pieces", content_type: ['teacher_question','content_piece']

                {@model,@contentGroupCollection}= opts

                App.execute "when:fetched", [@contentPiecesCollection,@contentGroupCollection, @textbooksCollection], =>
                    @contentPiecesCollection.remove model for model in @contentGroupCollection.models
                    @view = view = @_getContentSelectionView(@contentPiecesCollection)
                    @show @view,
                        loading: true


                    @listenTo @view, "fetch:chapters:or:sections", (parentID, filterType) =>
                        chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
                        App.execute "when:fetched", chaptersOrSections, =>
                            @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType

                    @listenTo @view, "add:content:pieces": (contentIDs) =>

                        _.each contentIDs, (ele, index)=>
                            @contentGroupCollection.add @contentPiecesCollection.get ele
                            @contentPiecesCollection.remove ele


                    @listenTo @contentGroupCollection, 'content:pieces:of:group:removed', @contentPieceRemoved

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
                        <td>{{post_excerpt}}</td>
                        <td>{{post_author_name}}</td>
                        <td>{{post_modified}}</td>'

            tagName: 'tr'

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
                textbookFiltersHTML= $.showTextbookFilters @textbooksCollection
                @$el.find '#textbook-filters'
                .html textbookFiltersHTML

                $ "#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter"
                .select2();

                $('#dataContentTable').tablesorter();

                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                $('#dataContentTable').tablesorterPager pagerOptions

            onFetchChaptersOrSectionsCompleted :(filteredCollection, filterType) ->

                switch filterType
                    when 'textbooks-filter' then $.populateChapters filteredCollection, @$el
                    when 'chapters-filter' then $.populateSections filteredCollection, @$el
                    when 'sections-filter' then $.populateSubSections filteredCollection, @$el

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
