define ['app'
        'controllers/region-controller'
        'text!apps/content-group/edit-group/content-selection/templates/content-selection.html'], (App, RegionController, contentSelectionTpl)->
    App.module "ContentSelectionApp.Controller", (Controller, App)->
        class Controller.ContentSelectionController extends RegionController

            initialize: (opts) ->

                @textbooksCollection = App.request "get:textbooks"
                @contentPiecesCollection = App.request "get:content:pieces", content_type: ['teacher_question','content_piece']

                {@model,@contentGroupCollection}= opts

                tableConfig =
                    'data': [
                        {
                            'label': 'Question'
                            'value': 'post_excerpt'
                        }
                        {
                            'label': 'Author'
                            'value': 'post_author_name'
                        }
                        {
                            'label': 'Last Modified'
                            'value': 'post_modified'
                            'dateField': true
                        }
                    ]
                    'idAttribute': 'ID' # id attribute of the model # default = 'id'
                    'selectbox': true
                    'pagination': true

                @view = view = @_getContentSelectionView(@contentPiecesCollection, tableConfig)


                @show view, (loading: true, entities: [@textbooksCollection, @contentGroupCollection])

                @listenTo @view, "fetch:chapters": (term_id) =>
                    chaptersCollection = App.request "get:chapters", ('parent': term_id)
                    App.execute "when:fetched", chaptersCollection, =>
                        @view.triggerMethod 'fetch:chapters:complete', chaptersCollection

                @listenTo @view, "fetch:sections:subsections": (term_id) ->
                    allSectionsCollection = App.request "get:subsections:by:chapter:id", ('child_of': term_id)
                    App.execute "when:fetched", allSectionsCollection, =>
                        #make list of sections directly belonging to chapter ie. parent=term_id
                        sectionsList = allSectionsCollection.where 'parent': term_id

                        #all the other sections are listed as subsections
                        subsectionsList = _.difference(allSectionsCollection.models, sectionsList);
                        allSections =
                            'sections': sectionsList, 'subsections': subsectionsList

                        @view.triggerMethod 'fetch:subsections:complete', allSections

                @listenTo @view, "add:content:pieces": (contentIDs) =>

                    _.each contentIDs, (ele, index)=>
                        @contentGroupCollection.add @contentPiecesCollection.get ele


                @listenTo @contentGroupCollection, 'content:pieces:of:group:removed', @contentPieceRemoved

            contentPieceRemoved: (model)=>
                @view.triggerMethod "content:piece:removed", model

            _getContentSelectionView: (collection, tableConfig)=>

                new DataContentTableView
                    collection: collection
                    tableConfig: tableConfig
#                    contentGroupModel : @model
                    templateHelpers:
                        textbooksFilter: ()=>
                            textbooks = []
                            _.each(@textbooksCollection.models, (el, ind)->
                                textbooks.push('name': el.get('name'), 'id': el.get('term_id'))
                            )
                            textbooks

        class DataContentTableView extends Marionette.ItemView

            template: contentSelectionTpl

            className: 'tiles white grid simple vertical green'

            events:
                'change #check_all_div': 'checkAll'
                'change .filters': 'filterTableData'
                'change #textbooks-filter': 'changeTextbooks'
                'change #chapters-filter': (e)->
                    @trigger "fetch:sections:subsections", $(e.target).val()
                'click #add-content-pieces': 'addContentPieces'



            serializeData: ->
                data = super()
                data.tableData = Marionette.getOption @, 'tableConfig'
                data



            onShow: =>
                @makeDataTable(@collection.models, Marionette.getOption @, 'tableConfig')
                $ "#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter"
                .select2();





            makeRow: (item, index, tableData)->
                td_ID = 'id';

                if tableData.idAttribute
                    td_ID = tableData.idAttribute

                row = '<tr id="row_' + item.get(td_ID) + '">'

                if tableData.selectbox
                    row += '<td class="v-align-middle"><div class="checkbox check-default">
                    							<input class="tab_checkbox" type="checkbox" value="' + item.get(td_ID) + '" id="checkbox' + index + '">
                    							<label for="checkbox' + index + '"></label>
                    						  </div>
                    						</td>'

                _.each tableData.data, (el, ind)->
                    if el.value
                        el_value = item.get el.value

                    else
                        slug = _.str.underscored(el.label)
                        el_value = item.get slug


                    if el.dateField
                        el_value = moment(el_value).format("Do MMM YYYY")

                    row += '<td> ' + el_value + ' </td>'


                row += '</tr>'

                row


            makeDataTable: (dataCollection, tableData)->
                @$el.find('#dataContentTable tbody').empty()

                _.each dataCollection, (item, index)=>
                    row = @makeRow item, index, tableData
                    @$el.find('#dataContentTable tbody').append(row)


                if _.size(dataCollection) is 0
                    colspan = _.size tableData.data
                    if tableData.selectbox
                        colspan++
                    @$el.find('#dataContentTable tbody').append('<td id="empty_row" colspan="' + colspan + '">No Data found</td>')

                $('#dataContentTable').tablesorter();

                if tableData.pagination
                    $("#dataContentTable").trigger("updateCache");
                    @$el.find('#pager').remove();
                    pagerDiv = '<div id="pager" class="pager">
                    								<i class="fa fa-chevron-left prev"></i>
                    								<span style="padding:0 15px"  class="pagedisplay"></span>
                    								<i class="fa fa-chevron-right next"></i>
                    								<select class="pagesize">
                                        <option selected value="25">25</option>
                    									  <option value="50">50</option>
                                        <option value="100">100</option>
                    								</select>
                    							</div>'
                    @$el.find('#dataContentTable').after(pagerDiv)
                    pagerOptions =
                        totalRows: _.size(dataCollection)
                        container: $(".pager"),
                        output: '{startRow} to {endRow} of {totalRows}'

                    $('#dataContentTable').tablesorterPager pagerOptions

            checkAll: ->
                if @$el.find('#check_all').is(':checked')
                    @$el.find('#dataContentTable .tab_checkbox').trigger('click').prop('checked', true);
                else
                    @$el.find('#dataContentTable .tab_checkbox').removeAttr('checked')

            filterTableData: (e)=>

                #filter_ids = @$el.find('.textbook-filter').val()

                filter_ids=_.map @$el.find('select.textbook-filter'), (ele,index)->
                                        item = ''
                                        if not isNaN ele.value
                                            item= ele.value
                                        item
                filter_ids= _.compact filter_ids

                content_type = @$el.find('#content-type-filter').val()

                filtered_models= @collection.models

                if content_type isnt ''
                    filtered_models = @collection.where 'content_type': content_type

                if _.size(filter_ids)>0
                    filtered_data = _.filter filtered_models, (item)=>
                                        filtered_item=''
                                        term_ids= _.flatten item.get 'term_ids'
                                        if _.size(_.intersection(term_ids, filter_ids)) == _.size(filter_ids)
                                            filtered_item=item
                                        filtered_item
                else
                    filtered_data = filtered_models

                @makeDataTable(filtered_data, Marionette.getOption @, 'tableConfig')

            filterContentType:(e)=>
                content_type = $(e.target).val()

                if content_type
                    filtered_data = @collection.where 'content_type': content_type

                else
                    filtered_data = @collection.models

                @makeDataTable(filtered_data, Marionette.getOption @, 'tableConfig')

            changeTextbooks: (e)=>

                @$el.find '#chapters-filter, #sections-filter, #subsections-filter'
                    .select2 'data', ''

                @trigger "fetch:chapters", $(e.target).val()

            onFetchChaptersComplete: (chapters)->

                if _.size(chapters) > 0

                    $ '#chapters-filter'
                        .select2 'data', {'text':'Select Chapter'}

                    _.each chapters.models, (chap, index)=>
                        @$el.find '#chapters-filter'
                            .append '<option value="' + chap.get('term_id') + '">' + chap.get('name') + '</option>'

                else
                    @$el.find '#chapters-filter,#sections-filter,#subsections-filter'
                        .html ''

                    @$el.find '#chapters-filter'
                        .select2 'data', 'text': 'No chapters'

                    @$el.find '#sections-filter'
                        .select2 'data', 'text': 'No Sections'

                    @$el.find '#subsections-filter'
                        .select2 'data', 'text': 'No Subsections'

            onFetchSubsectionsComplete: (allsections)->
                if _.size(allsections) > 0

                    if _.size(allsections.sections) > 0

                        $ '#sections-filter'
                            .select2 'data', {'text':'Select Section'}

                        _.each allsections.sections, (section, index)=>

                            @$el.find '#sections-filter'
                                .append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'

                    else
                        $ '#sections-filter'
                        .select2 'data', 'text': 'No Sections'
                            .html ''

                    if _.size(allsections.subsections) > 0

                        $ '#subsections-filter'
                            .select2 'data', {'text':'Select SubSection'}

                        _.each allsections.subsections, (section, index)=>
                            @$el.find '#subsections-filter'
                                .append '<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>'

                    else
                        $ '#subsections-filter'
                            .select2 'data', 'text': 'No Subsections'
                            .html ''

                else
                    $('#sections-filter,#subsections-filter')
                        .html ''

                    $ '#sections-filter'
                        .select2 'data', 'text': 'No Sections'

                    $ '#subsections-filter'
                        .select2 'data', 'text': 'No Subsections'

            addContentPieces: =>
                content_pieces = _.pluck($('#dataContentTable .tab_checkbox:checked'), 'value')
                if content_pieces
                    @trigger "add:content:pieces", content_pieces

                    for content_id in content_pieces

                        @$el.find("#dataContentTable tr#row_" + content_id).remove()

                        tableData = Marionette.getOption @, 'tableConfig'
                        if _.size(@$el.find("#dataContentTable tbody tr")) is 0
                            colspan = _.size tableData.data
                            if tableData.selectbox
                                colspan++
                            @$el.find('#dataContentTable tbody').append('<td id="empty_row" colspan="' + colspan + '">No Data found</td>')

                        @$el.find "#dataContentTable"
                            .trigger 'update'
                                .trigger "updateCache"

            onContentPieceRemoved: (model)=>
                @$el.find '#empty_row'
                    .remove()

                tableData = Marionette.getOption @, 'tableConfig'
                row_index = _.size @$el.find("#dataContentTable tbody tr")


                row = @makeRow model, row_index, tableData

                $row = $(row)
                @$el.find('#dataContentTable tbody').append($row)

                @$el.find("#dataContentTable").trigger 'addRows', [$row, true]
                    .trigger "updateCache"


        # set handlers
        App.commands.setHandler "show:content:selectionapp", (opt = {})->
            new Controller.ContentSelectionController opt
