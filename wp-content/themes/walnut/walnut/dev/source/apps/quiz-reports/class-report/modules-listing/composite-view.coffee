 define ['app'
        'text!apps/quiz-reports/class-report/modules-listing/templates/outer-template.html'
        'apps/quiz-reports/class-report/modules-listing/item-views'
        ], (App, contentListTpl)->

    App.module "ClassQuizReportListing.Views", (Views)->       

        class Views.ModulesListingView extends Marionette.CompositeView

            template : contentListTpl

            className : 'row'

            itemView : Views.ListItemView

            emptyView : Views.EmptyView

            itemViewContainer : '#list-content-pieces'

            itemViewOptions : ->
                textbookNamesCollection : @textbookNamesCollection

            events:
                'change #check_all_div'                 :-> $.toggleCheckAll @$el.find '#content-pieces-table'
                'change .tab_checkbox,#check_all_div '  : 'showSubmitButton'
                'click .send-email, .send-sms'          : 'saveCommunications'
                'click .send-summary'                   : 'saveSummaryCommunication'

            initialize : ->
                @textbookNamesCollection = Marionette.getOption @, 'textbookNamesCollection'

            mixinTemplateHelpers:(data)->

                data.can_schedule = true if App.request 'current:user:can','schedule_quiz'                    

                data

            onShow : ->

                @$el.find '#start_date'
                .datetimepicker
                    useCurrent:false
                    #minDate:today
                    format:'YYYY-MM-DD'
                    #debug:true

                @$el.find '#end_date'
                .datetimepicker
                    useCurrent:false
                    #minDate:today
                    format:'YYYY-MM-DD'
                    #debug:true

                @$el.find '#start_date'
                .on 'dp.change', (e)=>
                    $('#end_date').data('DateTimePicker').minDate(e.date)

                @$el.find '#content-pieces-table'
                .tablesorter();

                @onUpdatePager()

            onUpdatePager:->

                @$el.find '.communication_sent'
                .remove()

                @$el.find "#content-pieces-table"
                .trigger "updateCache"
                pagerOptions =
                    container : @$el.find ".pager"
                    output : '{startRow} to {endRow} of {totalRows}'

                @$el.find "#content-pieces-table"
                .tablesorterPager pagerOptions

            onResetTextbookNames:(namesCollection)=>
                @textbookNamesCollection.reset namesCollection.models
                @collection.trigger 'reset'
                @onUpdatePager()

            showSubmitButton:->
                if @$el.find '.tab_checkbox'
                .is ':checked'
                    @$el.find '.send-email, .send-sms'
                    .show()

                else
                    @$el.find '.send-email, .send-sms, .communication_sent'
                    .hide()
            saveSummaryCommunication: (e) ->
                @$el.find '.communication_sent'
                    .hide()
                $start_date = @$el.find '#start_date'
                                .val()
                $end_date = @$el.find '#end_date'
                                .val()
                if($start_date == '' || $end_date == '')
                    @$el.find '.communication_sent'
                    .hide()
                    return @$el.find '.send-summary'
                    .after '<span class="m-l-40 text-error small communication_sent">
                        Select start and end date</span>'


                console.log $start_date
                console.log $end_date
                console.log "summary"
                data = []

                @$el.find '.communication-sent'
                .remove()

                allQuizIDs= _.map $.getAllItems(@$el.find('#content-pieces-table')), (m)-> parseInt m
                console.log allQuizIDs

                #allQuizIDs= _.map $.getCheckedItems(@$el.find('#content-pieces-table')), (m)-> parseInt m

                excludeIDs = _.chain @collection.where 'taken_by':0
                        .pluck 'id'
                        .value()

                data.quizIDs = _.difference allQuizIDs,excludeIDs 
                console.log data.quizIDs
                data.division = @$el.find '#divisions-filter'
                        .val()
                console.log data.division

                if $(e.target).hasClass 'send-summary'
                    data.communication_mode = 'email'
                else
                    data.communication_mode = 'sms'
                data.start_date = $start_date
                data.end_date = $end_date

                if _.isEmpty data.quizIDs
                    @$el.find '.send-summary'
                    .after '<span class="m-l-40 text-error small communication_sent">
                            Selected quizzes have not been taken by any student</span>'

                else
                    console.log data
                    @trigger "summary:communication", data

            saveCommunications:(e)->

                data = []

                @$el.find '.communication_sent'
                .remove()

                allQuizIDs= _.map $.getCheckedItems(@$el.find('#content-pieces-table')), (m)-> parseInt m

                excludeIDs = _.chain @collection.where 'taken_by':0
                        .pluck 'id'
                        .value()

                data.quizIDs = _.difference allQuizIDs,excludeIDs 
                console.log data.quizIDs
                data.division = @$el.find '#divisions-filter'
                        .val()
                console.log data.division

                if $(e.target).hasClass 'send-email'
                    data.communication_mode = 'email'
                else
                    data.communication_mode = 'sms'

                if _.isEmpty data.quizIDs
                    @$el.find '.send-email'
                    .after '<span class="m-l-40 text-error small communication_sent">
                            Selected quizzes have not been taken by any student</span>'

                else
                    @trigger "save:communications", data