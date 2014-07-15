define ['app'
        'controllers/region-controller'
        'text!apps/content-modules/edit-module/content-selection/templates/content-selection.html'
], (App, RegionController, contentSelectionTpl)->
    App.module "ContentSelectionApp.Controller.SearchResults", (SearchResults, App, Backbone, Marionette, $, _)->
        class SearchResults.Controller extends RegionController
            initialize: (opts) ->

                {@model,@contentGroupCollection}=opts

                @searchCollection = App.request "get:content:pieces"

                @view = view = @_getContentSelectionView @searchCollection
                @show @view,
                    loading: true

                @listenTo @view, "search:content", @_searchContent

            _searchContent:(searchStr)=>

                newCollection = App.request "get:content:pieces",
                    content_type    : ['teacher_question','content_piece']
                    post_status     : 'publish'
                    search_str      : searchStr
                    exclude         : @contentGroupCollection.pluck 'ID'


                App.execute "when:fetched", newCollection, =>

                    @searchCollection.reset newCollection.models

                    @view.triggerMethod "search:complete", @searchCollection

                @listenTo @view, "add:content:pieces": (contentIDs) =>

                    _.each contentIDs, (ele, index)=>
                        @contentGroupCollection.add @searchCollection.get ele
                        @searchCollection.remove ele


                @listenTo @contentGroupCollection, 'content:pieces:of:group:removed', @contentPieceRemoved

            contentPieceRemoved: (model)=>
                @searchCollection.add model
                @view.triggerMethod "content:piece:removed", model

            _getContentSelectionView: (collection)=>
                new DataContentTableView
                    collection: collection
                    fullCollection : collection.clone()
                    contentGroupModel : @model


            class DataContentItemView extends Marionette.ItemView

                template: '<td class="v-align-middle"><div class="checkbox check-default">
                                                                            <input class="tab_checkbox" type="checkbox" value="{{ID}}" id="checkbox{{ID}}">
                                                                            <label for="checkbox{{ID}}"></label>
                                                                          </div>
                                                                        </td>
                                                                        <td class="cpHeight">{{&post_excerpt}}</td>
                                                                        <td>{{content_type_str}}</td>
                                                                        <td class="cpHeight">
                                                                            {{&present_in_str}}
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

                    modules=[]
                    _.each data.present_in_modules, (ele,index)->
                        modules.push "<a target='_blank' href='#view-group/"+ ele.id+"'>"+ ele.name+"</a>"

                    data.present_in_str=
                        if _.size(modules)>0
                        then _.toSentence(modules)
                        else 'Not added to a module yet'

                    data

            class NoDataItemView extends Marionette.ItemView

                template: 'No Content Available'

                tagName: 'td'

                onShow:->
                    @$el.attr 'colspan',5

            class DataContentTableView extends Marionette.CompositeView

                template: 'Search Questions: <input type="text" class="search-box" id="search-box"> <br><br>' +
                contentSelectionTpl

                emptyView: NoDataItemView

                itemView: DataContentItemView

                itemViewContainer: '#dataContentTable tbody'

                events:
                    'keypress #search-box' : 'searchContent'

                    'change #check_all_div'     : 'checkAll'

                    'click #add-content-pieces' : 'addContentPieces'

                onShow:->
                    @$el.find '#data-content-area'
                    .hide()
                    @fullCollection= Marionette.getOption @, 'fullCollection'

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

                    @updatePager()

                onContentPieceRemoved: (model)=>
                    @fullCollection.add model
                    @updatePager()

                searchContent:(e)=>
                    p = e.which
                    if p is 13
                        searchStr= _.trim $(e.target).val()
                        @trigger("search:content", searchStr) if searchStr

                onSearchComplete:=>

                    @$el.find '#data-content-area'
                    .show()

                    @updatePager()

                updatePager:->

                    @$el.find "#dataContentTable"
                    .trigger "updateCache"
                    pagerOptions =
                        container : @$el.find ".pager"
                        output : '{startRow} to {endRow} of {totalRows}'

                    @$el.find "#dataContentTable"
                    .tablesorter()
                    .tablesorterPager pagerOptions

        # set handlers
        App.commands.setHandler "show:content:search:results:app", (opt = {})->
            new SearchResults.Controller opt