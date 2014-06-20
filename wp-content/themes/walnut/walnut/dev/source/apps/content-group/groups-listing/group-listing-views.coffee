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
                                    {{#archivedModule}}<span class="nonDevice">|</span><a target="_blank" id="cloneModule" class="nonDevice">Clone</a>{{/archivedModule}}</td>'

            serializeData : ->
                data = super()
                data.view_url = SITEURL + "/#view-group/#{data.id}"
                data.edit_url = SITEURL + "/#edit-module/#{data.id}"
                data.textbookName = =>
                    console.log @textbooks
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

                data.archivedModule = true if data.status is 'archive'

                data

            initialize : (options)->
                @textbooks = options.textbooksCollection
                console.log options

            onShow : ->
                if @model.get('status') is 'archive'
                    @$el.find('td a#cloneModule').on 'click', =>
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
                                    success : @successFn
                                    error : @errorFn

            successFn : (model)=>
                model.set('content_pieces', @clonedData.content_pieces)
                model.save({ 'changed' : 'content_pieces' }, { wait : true })
                App.navigate "edit-module/#{model.get('id')}",
                    trigger : true

            errorFn : ->
                console.log 'error'


        class EmptyView extends Marionette.ItemView

            template : 'No content pieces available'

        class Views.GroupsListingView extends Marionette.CompositeView

            template : contentListTpl

            className : 'tiles white grid simple vertical green'

            itemView : ListItemView

            emptyView : EmptyView

            itemViewContainer : '#list-content-pieces'

            itemViewOptions : ->
                textbooksCollection : @textbooks



            events :
                'change .filters' : 'filterTableData'
                'change #textbooks-filter' : 'changeTextbook'
                'change #chapters-filter' : 'changeChapter'
                'change #sections-filter' : 'changeSection'

            mixinTemplateHelpers : (data)->
                data = super data
                data.textbooksFilter = @textbooks
                data


            initialize : ->
                textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @textbooks = new Array()
                textbooksCollection.each (textbookModel, ind)=>
                    @textbooks.push
                        'name' : textbookModel.get('name')
                        'id' : textbookModel.get('term_id')

                console.log @textbooks


            onShow : ->
                @$el.find "#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter"
                .select2()

                $('#content-pieces-table').tablesorter();

                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                $('#content-pieces-table').tablesorterPager pagerOptions

            changeTextbook : (e)=>
                @$el.find '#chapters-filter, #sections-filter, #subsections-filter'
                .select2 'data', ''

                @trigger "fetch:chapters", $(e.target).val()

            changeChapter : (e)=>
                console.log 'in change chapter'
                @$el.find '#sections-filter, #subsections-filter'
                .select2 'data', ''

                @trigger "fetch:sections", $(e.target).val()

            changeSection : (e)=>
                @$el.find ' #subsections-filter'
                .select2 'data', ''

                @trigger "fetch:subsections", $(e.target).val()

            onFetchChaptersComplete : (chapterCollection)->
                if _.size(chapterCollection) > 0

                    @$el.find '#chapters-filter'
                    .select2 'data', { 'text' : 'Select Chapter' }

                    _.each chapterCollection, (chap, index)=>
                        @$el.find '#chapters-filter'
                        .append "<option value='#{chap.get('term_id')}'>#{chap.get('name')}</option>"

                else
                    @$el.find '#chapters-filter'
                    .select2 'data', 'text' : 'No chapters'
                        .html '<option value="">All Chapters</option>'

                    @$el.find '#sections-filter'
                    .select2 'data', 'text' : 'No Sections'
                        .html '<option value="">All Sections</option>'

                    @$el.find '#subsections-filter'
                    .select2 'data', 'text' : 'No Subsections'
                        .html '<option value="">All Sub Sections</option>'

            onFetchSectionsComplete : (sectionList)->
                if _.size(sectionList) > 0

                    @$el.find '#sections-filter'
                    .select2 'data', { 'text' : 'Select Section' }

                    _.each sectionList, (section, index)=>
                        @$el.find '#sections-filter'
                        .append "<option value='#{section.get('term_id')}'>#{section.get('name')}</option>"

                else
                    @$el.find '#sections-filter'
                    .select2 'data', 'text' : 'No Sections'
                        .html '<option value="">All Sections</option>'

                    @$el.find '#subsections-filter'
                    .select2 'data', 'text' : 'No Subsections'
                        .html '<option value="">All Sub Sections</option>'

            onFetchSubsectionsComplete : (subSectionList)->
                if _.size(subSectionList) > 0
                    @$el.find '#subsections-filter'
                    .select2 'data', { 'text' : 'Select Subsection' }

                    _.each subSectionList, (subSection)=>
                        @$el.find '#subsections-filter'
                        .append "<option value='#{subSection.get('term_id')}'>#{subSection.get('name')}</option>"

                else
                    @$el.find '#subsections-filter'
                    .select2 'data', 'text' : 'No Subsections'
                        .html '<option value="">All Sub Sections</option>'




            filterTableData : (e)=>
                filter_ids = _.map @$el.find('select.terms-filter'), (ele, index)->
                    item = ''
                    if not isNaN ele.value
                        item = ele.value
                    item
                filter_ids = _.compact filter_ids


                fullCollection = Marionette.getOption @, 'fullCollection'

                filtered_data = fullCollection.models

                if _.size(filter_ids) > 0
                    filtered_data = _.filter filtered_data, (item)=>
                        filtered_item = ''
                        term_ids = _.flatten item.get 'term_ids'
                        console.log term_ids
                        if _.size(_.intersection(term_ids, filter_ids)) == _.size(filter_ids)
                            filtered_item = item
                        filtered_item


                @collection.set filtered_data
                console.log @collection


                $("#content-pieces-table").trigger "updateCache"
                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                $('#content-pieces-table').tablesorterPager pagerOptions


