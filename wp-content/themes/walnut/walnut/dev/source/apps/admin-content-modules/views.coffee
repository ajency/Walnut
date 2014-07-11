define ['app',
        'text!apps/admin-content-modules/templates/outer-template.html'], (App,adminContentModulesTpl)->
    App.module "AdminContentModulesApp.View.AdminModulesView", (AdminModulesView, App)->
        class ModulesItemView extends Marionette.ItemView

            # duration variable can be in hours/minutes (eg. 1 hr or 25 mins) and cannot be used in sorting.
            # hence total_minutes is used. it is the duration in minutes.
            # kept hidden coz the display doesnt need it. only tablesorter does

            template : '<td class="v-align-middle"><div class="checkbox check-default">
                                        <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}">
                                        <label for="checkbox{{id}}"></label>
                                      </div>
                                    </td>
                                    <td class="v-align-middle"><a href="#"></a>{{name}}</td>
                                    <td>{{textbookName}}</td>
                                    <td>{{chapterName}}</td>
                                    <td class="v-align-middle"><span style="display: none;">{{total_minutes}}</span> <span class="muted">{{duration}} {{minshours}}</span></td>
                                   <td>
                                      <span class="muted status_label">{{&status_str}}</span>
                                    </td>'

            tagName : 'tr'


            onShow : ->
                @$el.attr 'id', 'row-' + @model.get 'id'
                @$el.attr 'data-id', @model.get 'id'

                if @model.get('status') isnt 'completed'
                    @$el.find '.tab_checkbox'
                    .attr 'disabled',true


            serializeData : ->
                data = super()
                data.textbookName = =>
                    textbook = @textbooks.get data.term_ids.textbook
                    .get 'name'

                    textbook

                data.chapterName = =>
                    chapter = _.chain @chapters.findWhere "id" : data.term_ids.chapter
                    .pluck 'name'
                        .compact()
                        .value()
                    chapter

                training_date = @model.get 'training_date'

                if training_date is ''
                    training_date = 'Schedule'

                else training_date = moment(training_date).format("Do MMM YYYY")

                status = @model.get 'status'

                if @model.get('post_status')? and @model.get('post_status') is 'archive'
                    console.log 'im here'
                    data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>'
                    data.status_str = '<span class="label label-success">Archived</span>'
                    data.action_str = '<i class="fa fa-repeat"></i> Replay'

                else
                    if status is 'started' or status is 'resumed'
                        data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>'
                        data.status_str = '<span class="label label-info">In Progress</span>'
                        data.action_str = '<i class="fa fa-pause"></i> Resume'

                    else if status is 'completed'
                        data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>'
                        data.status_str = '<span class="label label-success">Completed</span>'
                        data.action_str = '<i class="fa fa-repeat"></i> Replay'

                    else
                        data.status_str = '<span class="label label-important">Not Started</span>'
                        data.action_str = '<i class="fa fa-play"></i> Start'
                        data.training_date = '<button type="button" data-target="#schedule" data-toggle="modal" class="btn btn-white btn-small pull-right m-r-10 training-date">
                                                                                                <i class="fa fa-calendar"></i> ' + training_date + '</button>'

                data


            initialize : (options)->
                @textbooks = options.textbooksCollection
                @chapters = options.chaptersCollection

        class ModulesEmptyView extends Marionette.ItemView

            template: 'No items to display'

            tagName : 'td'

            onShow:->
                @$el.attr 'colspan', 6

        class AdminModulesView.ModulesView extends Marionette.CompositeView

            template : adminContentModulesTpl

            itemView : ModulesItemView

            itemViewContainer : 'tbody'

            emptyView: ModulesEmptyView

            itemViewOptions : ->
                textbooksCollection : Marionette.getOption @, 'textbooksCollection'
                chaptersCollection  : Marionette.getOption @, 'chaptersCollection'

            className : 'teacher-app moduleList'

            events :
                'click .start-training'     : 'startTraining'
                'click .training-date'      : 'scheduleTraining'
                'change #check_all_div'     : 'checkAll'
                'change .tab_checkbox,#check_all_div '       : 'showSubmitButton'
                'click #send-email, #send-sms'  : 'saveCommunications'

                'change #divisions-filter'  :(e)->
                    @trigger "division:changed", $(e.target).val()

                'change #content-status-filter'  : 'setFilteredContent'

                'change .textbook-filter' :(e)->
                    @trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

            mixinTemplateHelpers : (data)->
                data = super data
                divisionsCollection = Marionette.getOption @, 'divisionsCollection'
                divisionOptions = []
                divisionsCollection.each (model)->
                    d=[]
                    d.id= model.get 'id'
                    d.division = model.get 'division'
                    divisionOptions.push d

                data.divisionsFilter = divisionOptions
                data

            initialize : ->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @textbooks = new Array()
                @textbooksCollection.each (textbookModel, ind)=>
                    @textbooks.push
                        'name' : textbookModel.get('name')
                        'id' : textbookModel.get('term_id')

            startTraining : (e)=>
                dataID = $(e.currentTarget).attr 'data-id'
                currentRoute = App.getCurrentRoute()
                App.navigate currentRoute + "/module/" + dataID, true

            onScheduledModule : (id, date)->
                @$el.find 'tr#row-' + id + ' .training-date'
                .html '<i class="fa fa-calendar"></i> ' + moment(date).format("Do MMM YYYY")

            scheduleTraining : (e)->
                dataID = $ e.target
                .closest 'tr'
                    .attr 'data-id'

                @trigger "schedule:training", dataID

            onShow : =>
                if Marionette.getOption(@, 'mode') is 'training'
                    @$el.find '.status_label, .training-date, #status_header, .dateInfo'
                    .remove();

                textbookFiltersHTML= $.showTextbookFilters textbooks: @textbooksCollection

                @fullCollection = Marionette.getOption @, 'fullCollection'

                @$el.find '#textbook-filters'
                .html textbookFiltersHTML

                @$el.find ".select2-filters"
                .select2()

                @$el.find '#take-class-modules'
                .tablesorter()

                $("#pager").remove()

                pagerDiv = '<div id="pager" class="pager">
                                                              <i class="fa fa-chevron-left prev"></i>
                                                              <span style="padding:0 15px"  class="pagedisplay"></span>
                                                              <i class="fa fa-chevron-right next"></i>
                                                              <select class="pagesize">
                                                                  <option value="25" selected>25</option>
                                                                  <option value="50">50</option>
                                                                  <option value="100">100</option>
                                                              </select>
                                                            </div>'
                @$el.find('#take-class-modules').after(pagerDiv)
                pagerOptions =
                    container : $(".pager"),
                    output : '{startRow} to {endRow} of {totalRows}'


                $('#take-class-modules').tablesorterPager pagerOptions


            checkAll: ->

                completedModules= _.chain @collection.where 'status': 'completed'
                .pluck 'id'
                    .value()

                if @$el.find '#check_all'
                .is ':checked'
                    checkboxes= @$el.find '#take-class-modules .tab_checkbox'
                    for checkbox in checkboxes
                        if checkbox.value in completedModules
                            $(checkbox).trigger 'click'
                            .prop 'checked', true

                else
                    @$el.find '#take-class-modules .tab_checkbox'
                    .removeAttr 'checked'

            onNewCollectionFetched: (newCollection,fullCollection,textbooks)=>
                @textbooksCollection.reset textbooks.models
                @collection.reset newCollection.models
                @fullCollection.reset fullCollection.models
                $("#take-class-modules").trigger "updateCache"
                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                $('#take-class-modules').tablesorterPager pagerOptions

                @onShow()

            onFetchChaptersOrSectionsCompleted :(filteredCollection, filterType) ->

                switch filterType
                    when 'textbooks-filter' then $.populateChapters filteredCollection, @$el
                    when 'chapters-filter' then $.populateSections filteredCollection, @$el
                    when 'sections-filter' then $.populateSubSections filteredCollection, @$el

                @setFilteredContent()


            setFilteredContent:->
                filtered_data= $.filterTableByTextbooks(@)

                @collection.set filtered_data

                $("#take-class-modules").trigger "updateCache"
                pagerOptions =
                    container : $(".pager")
                    output : '{startRow} to {endRow} of {totalRows}'

                $('#take-class-modules').tablesorterPager pagerOptions

            showSubmitButton:->
                if @$el.find '.tab_checkbox'
                .is ':checked'
                    @$el.find '#send-email, #send-sms'
                    .show()

                else
                    @$el.find '#send-email, #send-sms'
                    .hide()

            saveCommunications:(e)->

                data = []
                data.moduleIDs= _.chain @$el.find('.tab_checkbox')
                                .map (checkbox)->
                                    if $(checkbox).is ':checked'
                                        $(checkbox).val()
                                .compact()
                                .value()

                data.division = @$el.find '#divisions-filter'
                        .val()

                if e.target.id is 'send-email'
                    data.communication_mode = 'email'
                else
                    data.communication_mode = 'sms'

                if data.moduleIDs
                    @trigger "save:communications", data

                    @$el.find '#communication_sent'
                    .remove()

                    @$el.find '#send-sms'
                    .after '<span class="m-l-40 small" id="communication_sent">
                            Your '+data.communication_mode+' has been queued successfully</span>'