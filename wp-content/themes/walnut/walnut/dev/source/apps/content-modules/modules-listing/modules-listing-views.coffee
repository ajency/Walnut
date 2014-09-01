define ['app'
        'text!apps/content-modules/modules-listing/templates/content-modules-list-tmpl.html'
], (App, contentListTpl)->
    App.module "ContentModulesApp.ModulesListing.Views", (Views, App, Backbone, Marionette, $, _)->
        class ListItemView extends Marionette.ItemView

            tagName : 'tr'
            className : 'gradeX odd'

            template : '<!--<td class="v-align-middle"><div class="checkbox check-default">
                            <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}">
                            <label for="checkbox{{id}}"></label>
                          </div>
                        </td>-->
                        <td>{{name}}</td>
                        {{#isQuiz}}<td>{{quiz_type}}</td>{{/isQuiz}}
                        <td>{{textbookName}}</td>
                        <td>{{chapterName}}</td>
                        <td>{{durationRounded}} {{minshours}}</td>
                        {{#isQuiz}}<td>{{marks}}</td>{{/isQuiz}}
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

                if @groupType is 'quiz'
                    data.quiz_type = _.capitalize data.quiz_type
                    data.view_url = SITEURL + "/#view-quiz/#{data.id}"
                    data.edit_url = SITEURL + "/#edit-quiz/#{data.id}"


                data.statusMessage = ->
                    if data.post_status is 'underreview'
                        return '<span class="label label-important">Under Review</span>'
                    else if data.post_status is 'publish'
                        return '<span class="label label-info">Published</span>'
                    else if data.post_status is 'archive'
                        return '<span class="label label-success">Archived</span>'

                data.archivedModule = true if data.post_status in ['publish', 'archive']

                data

            mixinTemplateHelpers : (data)->
                data = super data
                data.isQuiz = true if @groupType is 'quiz'
                data

            events:
                'click a.cloneModule' : 'cloneModule'

            initialize : (options)->
                @textbooks = options.textbooksCollection
                @chapters = options.chaptersCollection
                @groupType = options.groupType

            cloneModule :->
                if @model.get('post_status') in ['publish','archive']
                    if confirm("Are you sure you want to clone '#{@model.get('name')}' ?") is true

                        @cloneModel = App.request "new:content:group" if @groupType is 'teaching-module'

                        @cloneModel = App.request "new:quiz" if @groupType is 'quiz'

                        groupData = @model.toJSON()
                        @clonedData = _.omit groupData,
                          ['id', 'last_modified_on', 'last_modified_by', 'created_on', 'created_by']
                        @clonedData.name = "#{@clonedData.name} clone"
                        @clonedData.post_status = "underreview"

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
                if @groupType is 'teaching-module'
                    App.navigate "edit-module/#{model.get('id')}",
                        trigger : true

                else
                    App.navigate "edit-quiz/#{model.get('id')}",
                        trigger : true

            errorFn : ->
                console.log 'error'


        class EmptyView extends Marionette.ItemView

            template: 'No Content Available'

            tagName: 'td'

            onShow:->
                @$el.attr 'colspan',6

        class Views.ModulesListingView extends Marionette.CompositeView

            template : contentListTpl

            className : 'row'

            itemView : ListItemView

            emptyView : EmptyView

            itemViewContainer : '#list-content-pieces'

            itemViewOptions : ->
                textbooksCollection : @textbooks
                chaptersCollection  : Marionette.getOption @, 'chaptersCollection'
                groupType : @groupType

            mixinTemplateHelpers : (data)->
                data = super data
                data.isQuiz = true if @groupType is 'quiz'
                data.type = _.titleize _.humanize data.type
                console.log @groupType
                data

            events :
                'change .textbook-filter' :(e)->
                    @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

                'change #check_all_div'     : 'checkAll'
                'change #content-post-status-filter'  : 'setFilteredContent'

            initialize : ->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @groupType = Marionette.getOption @, 'groupType'
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

                @$el.find '#content-pieces-table'
                .tablesorter();

                @onUpdatePager()

            onFetchChaptersOrSectionsCompleted :(filteredCollection, filterType) ->

                switch filterType
                    when 'textbooks-filter' then $.populateChapters filteredCollection, @$el
                    when 'chapters-filter' then $.populateSections filteredCollection, @$el
                    when 'sections-filter' then $.populateSubSections filteredCollection, @$el

                @setFilteredContent()


            setFilteredContent:->

                filtered_data= $.filterTableByTextbooks(@)

                @collection.set filtered_data

                @onUpdatePager()

            checkAll: ->
                if @$el.find '#check_all'
                .is ':checked'
                    @$el.find '.table-striped .tab_checkbox'
                    .trigger 'click'
                        .prop 'checked', true

                else
                    @$el.find '.table-striped .tab_checkbox'
                    .removeAttr 'checked'


            onUpdatePager:->

                @$el.find "#content-pieces-table"
                .trigger "updateCache"
                pagerOptions =
                    container : @$el.find ".pager"
                    output : '{startRow} to {endRow} of {totalRows}'

                @$el.find "#content-pieces-table"
                .tablesorterPager pagerOptions