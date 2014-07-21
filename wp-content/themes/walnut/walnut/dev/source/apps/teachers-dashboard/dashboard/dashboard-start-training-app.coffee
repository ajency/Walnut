define ['app'
        'controllers/region-controller'], (App, RegionController)->

    App.module "DashboardStartTrainingApp.Controller", (Controller, App)->

        class Controller.DashboardStartTrainingController extends RegionController

            initialize :(opts) ->

                @view= view = @_getStartTrainingView opts.divisionsCollection

                @show view,(loading:true)

            _getStartTrainingView: (divisions) ->
                new TeachersStartTrainingView
                    collection: divisions

        class TeachersStartTrainingView extends Marionette.ItemView

            template: '<h1 class="text-center muted m-b-20">Select a <span class="bold">class</span> to begin</h1>
                        <ul class="classes">
                            {{#classes}}
                            <li><a href="#teachers/start-training/{{id}}"><div class="classesWrap">{{label}}</div></a></li>
                            {{/classes}}
                        </ul>'

            className: 'animated fadeInUp'

            mixinTemplateHelpers:->
                data = super data
                classes=[]
                class_ids = _.unique @collection.pluck 'class_id'
                for class_id in class_ids
                    c=[]
                    c.id= class_id
                    c.label = CLASS_LABEL[class_id]
                    classes.push c

                data.classes = classes
                data

        # set handlers
        App.commands.setHandler "show:dashboard:start:training:app", (opt = {})->
            new Controller.DashboardStartTrainingController opt

