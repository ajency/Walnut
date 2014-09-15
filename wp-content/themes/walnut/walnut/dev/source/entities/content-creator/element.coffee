define ["app", 'backbone'], (App, Backbone) ->
    App.module "Entities.Elements", (Elements, App, Backbone, Marionette, $, _)->
        # Generic element model
        class Elements.ElementModel extends Backbone.Model

            # custom id attribute as we will be using post_meta table for saving this
            # element details
            idAttribute: 'meta_id'

            defaults: ->
                style: ''
                draggable: true

            name: 'element'

        class Elements.ElementCollection extends Backbone.Collection

            model : Elements.ElementModel

        elementsCollection = new Elements.ElementCollection

        # PUBLIC API FOR ENitity
        API =
            createElement: (data = {})->
                if data.meta_id? and data.element not in ['Row','TeacherQuestion'] and  elementsCollection.get(data.meta_id)?
                    element = elementsCollection.get(data.meta_id)
                else
                    element = new Elements.ElementModel
#
                    element.set data

                if element.get('element') not in ['Row','TeacherQuestion'] and element.get('element') isnt 'Column'

                    if element.isNew()
                        element.save null,
                            wait: true

                elementsCollection.add element

                element


        # REQUEST HANDLERS
        App.reqres.setHandler "create:new:element", (data) ->
            elementsCollection
            API.createElement data
