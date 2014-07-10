define ['app'
        'controllers/region-controller'], (App, RegionController)->

    App.module "DashboardClassProgressApp.Controller", (Controller, App)->

        class Controller.DashboardClassProgressController extends RegionController

            initialize :(opts) ->

                @view= view = @_getClassProgressView opts.divisionsCollection

                @show view,(loading:true)

            _getTakeClassView: (divisions) ->
                new TeachersTakeClassView
                    collection: divisions

        class TeachersTakeClassView extends Marionette.ItemView

            template: '<h1 class="text-center muted m-b-20">Select a <span class="bold">class</span> to begin</h1>
                                    <ul class="classes">
                                        {{#divisions}}
                                        {{#.}}
                                        <li><a href="#teachers/take-class/{{class_id}}/{{id}}"><div class="classesWrap">{{division}}</div></a></li>
                                        {{/.}}
                                        {{/divisions}}
                                    </ul>'

            className: 'animated fadeInUp'

            mixinTemplateHelpers:->
                data = super data
                data.divisions = _.chain @collection.toJSON()
                .groupBy 'class_id'
                    .toArray()
                    .value();
                data

            changeTab: (e)->
                e.preventDefault()

                @$el.find '#teacherOptns a'
                .removeClass 'active'

                $(e.target)
                .addClass 'active'
                    .tab 'show'


        # set handlers
        App.commands.setHandler "show:dashboard:class:progress:app", (opt = {})->
            new Controller.DashboardClassProgressController opt

