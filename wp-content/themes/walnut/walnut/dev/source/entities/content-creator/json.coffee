define ["app", 'backbone'], (App, Backbone) ->
    App.module "Entities.BuilderJSON", (BuilderJSON, App, Backbone, Marionette, $, _)->
        class PageJson extends Backbone.Model

            idAttribute: 'ID'

            name: 'content-piece'
            layout: ''
            elements: []

        API =
            getPageJSON: (id='151')->
                jsonModel = new PageJson
                    ID: parseInt id
                jsonModel.fetch()

                jsonModel


        # handlers
        App.reqres.setHandler "get:page:json", (id)->
            API.getPageJSON(id)