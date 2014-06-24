define ['app'
        'backbone'
],(App,Backbone)->
    App.module "Entities.GradingParameter",(GradingParameter,App,Backbone,Marionette,$,_)->
        class GradingParameter.ItemModel extends Backbone.Model

            defaults :
                parameter : ''
                attributes : []


        class GradingParameter.ItemCollection extends Backbone.Collection

            model : GradingParameter.ItemModel


        API =
            getGradingParameterCollections:(params)->
                parameterCollection = new GradingParameter.ItemCollection
                parameterCollection.set params
                parameterCollection

            getGradingParameter : (params)->
                parameterModel = new GradingParameter.ItemModel params

                parameterModel

        App.reqres.setHandler 'get:grading:parameter:collection',(params)->
            API.getGradingParameterCollections params

        App.reqres.setHandler 'get:grading:parameter',(params)->
            API.getGradingParameter params
