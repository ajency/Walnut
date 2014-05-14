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
                    collection: model.get 'elements'
                    mcq_model: model

            onClose: ->
                    models= this.model.get('elements').models

                    elements= [
                        {optionNo: 1, class: 6, text: 'TTT'},
                        {optionNo: 2, class: 6, text: 'test 343'}
                    ]

                    elements= _.map models, (m)->
                                                console.log m.toJSON()
                                                m.toJSON()

                    elementsStr = JSON.stringify(elements)
                    console.log elementsStr

                    #@model.set 'elements': elements

                    #@model.save(null, wait:true)

                    #optionCollection = App.request "create:new:option:collection", elements
                    #@model.set 'elements', optionCollection





        #localStorage.setItem 'ele' + @model.get('meta_id'), JSON.stringify(@model.toJSON())


        App.commands.setHandler "show:mcq:properties", (options)->
            new McqPropertyBox.Controller
                region: options.region
                model: options.model