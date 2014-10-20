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

            initialize : ->
                @textbookNamesCollection = Marionette.getOption @, 'textbookNamesCollection'

            onShow : ->
                @$el.find '#content-pieces-table'
                .tablesorter();

                @onUpdatePager()

            onUpdatePager:->

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
                    @$el.find '#send-email, #send-sms'
                    .show()

                else
                    @$el.find '#send-email, #send-sms'
                    .hide()