define ['app'
    'controllers/region-controller'
    'text!apps/quiz-reports/class-report/templates/class-report-layout.html'
    ], (App, RegionController,classReportLayoutTpl)->

    App.module "ClassReportApp.Layout", (Layout, App)->

        class Layout.ContentPiecesLayout extends Marionette.Layout
            template : classReportLayoutTpl

            className: 'tiles white grid simple vertical green'

            regions:
                studentFilterRegion : '#students-filter-region'
                filtersRegion       : '#filters-region'
                allContentRegion    : '#all-content-region'
                searchResultsRegion : '#search-results-region'

            events:
                'click #addContent a': 'changeTab'

            onShow : ->
                @onChangeDivision Marionette.getOption @,'students'

            onChangeDivision:(students)->
                @$el.find "#students-count"
                .html _.size students
                
            changeTab: (e)->
                e.preventDefault()

                @$el.find '#addContent a'
                .removeClass 'active'

                $(e.target).closest 'a'
                .addClass 'active'
                    .tab 'show'