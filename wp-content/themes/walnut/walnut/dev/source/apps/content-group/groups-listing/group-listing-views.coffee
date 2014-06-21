define ['app'
        'text!apps/content-group/groups-listing/templates/content-group-list-tmpl.html'
], (App, contentListTpl)->
    App.module "ContentGroupApp.GroupListing.Views", (Views, App, Backbone, Marionette, $, _)->
        class ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className : 'gradeX odd'

            template : '<td>{{name}}</td>
                                    <td>{{textbookName}}</td>
                                    <td>{{durationRounded}} {{minshours}}</td>
                                    <td>{{&statusMessage}}</td>
                                    <td class="text-center"><a target="_blank" href="{{view_url}}">View</a> <span class="nonDevice">|</span>
                                        <a target="_blank" href="{{edit_url}}" class="nonDevice">Edit</a>
                                    {{#archivedModule}}<span class="nonDevice">|</span><a target="_blank"  class="nonDevice cloneModule">Clone</a>{{/archivedModule}}</td>'

            serializeData : ->
                data = super()
                data.view_url = SITEURL + "/#view-group/#{data.id}"
                data.edit_url = SITEURL + "/#edit-module/#{data.id}"
                data.textbookName = =>
                    textbook = _.findWhere @textbooks, "id" : data.term_ids.textbook
                    textbook.name

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

            events :
                'change .filters' :(e)->
                    @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

            mixinTemplateHelpers : (data)->
                data = super data
                data.textbooksFilter = @textbooks
                data

            initialize : ->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @textbooks = new Array()
                @textbooksCollection.each (textbookModel, ind)=>
                    @textbooks.push
                        'name' : textbookModel.get('name')
                        'id' : textbookModel.get('term_id')

            onShow : ->

                textbookFiltersHTML= $.showTextbookFilters @textbooksCollection
                @fullCollection = Marionette.getOption @, 'fullCollection'

                @$el.find '#textbook-filters'
                .html textbookFiltersHTML

                @$el.find "#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter"
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

                filtered_data= $.filterTableByTextbooks(@)

                @collection.set filtered_data

                $("#content-pieces-table").trigger "updateCache"
                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                $('#content-pieces-table').tablesorterPager pagerOptions