define ['app'
        'controllers/region-controller'
        'text!apps/teachers-dashboard/dashboard/templates/teachers-dashboard.html',
        'apps/teachers-dashboard/dashboard/dashboard-take-class-app',
        'apps/teachers-dashboard/dashboard/dashboard-start-training-app',
        'apps/teachers-dashboard/dashboard/class-progress-app'
], (App, RegionController, teachersDashboardTpl)->
    App.module "TeachersDashboardApp.View", (View, App)->
        class View.DashboardController extends RegionController

            initialize: ->
                @divisionsCollection = App.request "get:divisions"

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                @layout = @_getTeachersDashboardLayout()
                @show @layout, loading:true

                @listenTo @layout, 'show', =>
                    App.execute "show:dashboard:takeclass:app",
                        region: @layout.take_class_region
                        divisionsCollection: @divisionsCollection

                    App.execute "show:dashboard:start:training:app",
                        region: @layout.start_training_region
                        divisionsCollection: @divisionsCollection

                    App.execute "show:dashboard:class:progress:app",
                        region: @layout.class_progress_region


            _getTeachersDashboardLayout:  ->
                new TeachersDashboardLayout()

        class TeachersDashboardLayout extends Marionette.Layout

            template: teachersDashboardTpl

            className: 'teacher-app'

            regions:
                take_class_region: '#take-class-region'
                start_training_region: '#start-training-region'
                class_progress_region: '#class-progress-region'

            events:
                'click #teacherOptns a': 'changeTab'

            changeTab: (e)->
                e.preventDefault()

                @$el.find '#teacherOptns a'
                .removeClass 'active'

                $(e.target)
                .addClass 'active'
                    .tab 'show'




