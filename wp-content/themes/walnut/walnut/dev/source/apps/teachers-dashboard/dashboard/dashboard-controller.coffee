define ['app'
        'controllers/region-controller'
        'text!apps/teachers-dashboard/dashboard/templates/teachers-dashboard.html'
], (App, RegionController, teachersDashboardTpl)->
    App.module "TeachersDashboardApp.View", (View, App)->
        class View.DashboardController extends RegionController

            initialize: ->
                divisionsCollection = App.request "get:divisions"

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                @view = view = @_getTeachersDashboardView divisionsCollection

                @show view, (loading: true)



            _getTeachersDashboardView: (divisions) ->
                new TeachersDashboardView
                    collection: divisions


        class TeachersDashboardView extends Marionette.ItemView

            template: teachersDashboardTpl

            className: 'teacher-app'

            events:
                'click #teacherOptns a': 'changeTab'

            mixinTemplateHelpers:->
                data = super data
                data.divisions = _.chain @collection.toJSON()
                                .groupBy 'class_id'
                                .toArray()
                                .value();

                classes=[]
                class_ids = _.unique @collection.pluck 'class_id'
                for class_id in class_ids
                    c=[]
                    c.id= class_id
                    c.label = CLASS_LABEL[class_id]
                    classes.push c

                data.classes = classes
                data

            changeTab: (e)->
                e.preventDefault()

                @$el.find '#teacherOptns a'
                .removeClass 'active'

                $(e.target)
                .addClass 'active'
                .tab 'show'




