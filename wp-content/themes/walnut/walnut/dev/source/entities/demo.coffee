define ["app", 'backbone'], (App, Backbone) ->

    App.module "Entities.Demo", (Demo, App, Backbone, Marionette, $, _)->

        # chapter model
        class Demo.ItemModel extends Backbone.Model

        # chapters collection class
        class Demo.ItemCollection extends Backbone.Collection
            model : Demo.ItemModel

        API =
            getDemoCollection : (data)->
                demoCollection = new Demo.ItemCollection
                demoCollection.set data
                demoCollection


        App.reqres.setHandler "get:demo:collection" ,(options)->

            API.getDemoCollection options
