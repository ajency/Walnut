define ['app'
        'backbone'], (App, Backbone)->
    App.module "Entities.Option", (Option, App, Backbone, Marionette, $, _)->
        class Option.OptionModel extends Backbone.Model

            idAttribute: 'optionNo'

            defaults: ->
                marks: 0
                text: ''

            name: 'option-model'


        class Option.OptionCollection extends Backbone.Collection

            model: Option.OptionModel




        API =
            createOption: (data)->
                option = new Option.OptionModel

                option.set data

                option

            createOptionCollection: (data = {})->
                console.log 'option collection'
                console.log data
                optionCollection = new Option.OptionCollection
                optionCollection.set data



                optionCollection

        App.reqres.setHandler "create:new:option", (data)->
            API.createOption data


        App.reqres.setHandler "create:new:option:collection", (data)->
            API.createOptionCollection data
