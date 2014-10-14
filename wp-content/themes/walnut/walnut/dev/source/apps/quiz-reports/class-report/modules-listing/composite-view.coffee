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
                textbooksCollection : @textbooks
                chaptersCollection  : Marionette.getOption @, 'chaptersCollection'

            initialize : ->
                @textbooksCollection = Marionette.getOption @, 'textbooksCollection'
                @textbooks = new Array()
                @textbooksCollection.each (textbookModel, ind)=>
                    @textbooks.push
                        'name' : textbookModel.get('name')
                        'id' : textbookModel.get('term_id')

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