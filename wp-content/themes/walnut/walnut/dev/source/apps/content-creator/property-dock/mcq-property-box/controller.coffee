define ['app'
        'controllers/region-controller'
        'apps/content-creator/property-dock/mcq-property-box/views'
        'apps/content-creator/property-dock/mcq-property-box/marksview']
, (App, RegionController)->
    App.module "ContentCreator.PropertyDock.McqPropertyBox",
    (McqPropertyBox, App, Backbone, Marionette, $, _)->
        class McqPropertyBox.Controller extends RegionController

            initialize: (options)->
                @model = options.model

                App.execute "close:question:elements"
                App.execute "close:question:element:properties"


                @layout = @_getView @model

                @listenTo @layout, "change:option:number", (number)=>
                    @model.set 'optioncount', parseInt number

                @listenTo @layout, "show:individual:marks:table", =>
                    marksView = @_getMarksView @model
                    @layout.individualMarksRegion.show marksView

                @listenTo @layout, "hide:individual:marks:table", =>
                    @layout.individualMarksRegion.close()

                @show @layout

            _getView: (model)->
                new McqPropertyBox.Views.PropertyView
                    model: model

            _getMarksView: (model)->
                new McqPropertyBox.Views.MarksView
                    collection: model.get 'options'
                    mcq_model: model

            onClose: ->
                    if @model.get('marks') > 0 and @model.get('correct_answer').length 
                        @model.set 'complete',true
                    else                
                        @model.set 'complete',false

                    models= this.model.get('options').models

                    elements= _.map models, (m)-> m.toJSON()

                    @model.set 'options': elements
                    optionElements = @model.get 'elements'
                    @model.unset 'elements'

                    

                    @model.save()

                    @model.set 'elements',optionElements

                    optionCollection = App.request "create:new:option:collection", models
                    @model.set 'options', optionCollection

        App.commands.setHandler "show:mcq:properties", (options)->
            new McqPropertyBox.Controller
                region: options.region
                model: options.model

