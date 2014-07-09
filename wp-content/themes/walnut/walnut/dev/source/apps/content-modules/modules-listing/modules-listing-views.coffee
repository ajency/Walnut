define ['app'
        'text!apps/content-modules/modules-listing/templates/content-modules-list-tmpl.html'
], (App, contentListTpl)->
    App.module "ContentModulesApp.GroupListing.Views", (Views, App, Backbone, Marionette, $, _)->
        class ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className : 'gradeX odd'

            template : '<!--<td class="v-align-middle"><div class="checkbox check-default">
                            <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}">
                            <label for="checkbox{{id}}"></label>
                          </div>
                        </td>-->
                        <td>{{name}}</td>
                        <td>{{textbookName}}</td>
                        <td>{{chapterName}}</td>
                        <td>{{durationRounded}} {{minshours}}</td>
                        <td>{{&statusMessage}}</td>
                        <td><a target="_blank" href="{{view_url}}">View</a> <span class="nonDevice">|</span>
                            <a target="_blank" href="{{edit_url}}" class="nonDevice">Edit</a>
                        {{#archivedModule}}<span class="nonDevice">|</span><a target="_blank"  class="nonDevice cloneModule">Clone</a>{{/archivedModule}}</td>'

            serializeData : ->
                data = super()
                data.view_url = SITEURL + "/#view-group/#{data.id}"
                data.edit_url = SITEURL + "/#edit-module/#{data.id}"
                data.textbookName = =>
                    textbook = _.findWhere @textbooks, "id" : data.term_ids.textbook
                    textbook.name if textbook?

                data.chapterName = =>
                    chapter = _.chain @chapters.findWhere "id" : data.term_ids.chapter
                    .pluck 'name'
                        .compact()
                        .value()
                    chapter

                data.durationRounded = ->
                    if data.minshours is 'hrs'
                        _.numberFormat parseFloat(data.duration), 2
                    else
                        data.duration

                data.statusMessage = ->
                    if data.status is 'underreview'
                        return '<span class="label label-important">Under Review</span>'
                    else if data.status is 'publish'
                        return '<span class="label label-info">Published</span>'
                    else if data.status is 'archive'
                        return '<span class="label label-success">Archived</span>'

                data.archivedModule = true if data.status in ['publish', 'archive']

                data

            events:
                'click a.cloneModule' : 'cloneModule'

            initialize : (options)->
                @textbooks = options.textbooksCollection
                @chapters = options.chaptersCollection

            cloneModule :->
                if @model.get('status') in ['publish','archive']
                    if confirm("Are you sure you want to clone '#{@model.get('name')}' ?") is true
                        @cloneModel = App.request "new:content:group"
                        groupData = @model.toJSON()
                        @clonedData = _.omit groupData,
                          ['id', 'last_modified_on', 'last_modified_by', 'created_on', 'created_by']
                        @clonedData.name = "#{@clonedData.name} clone"
                        @clonedData.status = "underreview"

                        App.execute "when:fetched", @cloneModel, =>
                            @cloneModel.save @clonedData,
                                wait : true
                                success : @successSaveFn
                                error : @errorFn

            successSaveFn : (model)=>
                model.set('content_pieces', @clonedData.content_pieces)
                model.save 'changed' : 'content_pieces' ,
                    wait : true
                    success : @successUpdateFn
                    error : @errorFn

            successUpdateFn : (model)=>
                App.navigate "edit-module/#{model.get('id')}",
                    trigger : true

            errorFn : ->
                console.log 'error'


        class EmptyView extends Marionette.ItemView

            template: 'No Content Available'

            tagName: 'td'

            onShow:->
                @$el.attr 'colspan',3

        class Views.GroupsListingView extends Marionette.CompositeView

            template : contentListTpl

            className : 'tiles white grid simple vertical green'

            itemView : ListItemView

            emptyView : EmptyView

            itemViewContainer : '#list-content-pieces'

            itemViewOptions : ->
                textbooksCollection : @textbooks
                chaptersCollection  : Marionette.getOption @, 'chaptersCollection'

            events :
                'change .textbook-filter' :(e)->
                    @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

                'change #check_all_div'     : 'checkAll'
                'change #content-status-filter'  : 'setFilteredContent'

            initialize : ->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @textbooks = new Array()
                @textbooksCollection.each (textbookModel, ind)=>
                    @textbooks.push
                        'name' : textbookModel.get('name')
                        'id' : textbookModel.get('term_id')

            onShow : ->

                textbookFiltersHTML= $.showTextbookFilters textbooks: @textbooksCollection
                @fullCollection = Marionette.getOption @, 'fullCollection'

                @$el.find '#textbook-filters'
                .html textbookFiltersHTML

                @$el.find ".select2-filters"
                .select2()

                $('#content-pieces-table').tablesorter();

                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

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

                $("#content-pieces-table").trigger "updateCache"
                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                $('#content-pieces-table').tablesorterPager pagerOptions

            checkAll: ->
                if @$el.find '#check_all'
                .is ':checked'
                    @$el.find '.table-striped .tab_checkbox'
                    .trigger 'click'
                        .prop 'checked', true

                else
                    @$el.find '.table-striped .tab_checkbox'
                    .removeAttr 'checked'