define ["app", 'backbone'], (App, Backbone) ->

        App.module "Entities.Elements", (Elements, App, Backbone, Marionette, $, _)->

            # Generic element model
            class Elements.ElementModel extends Backbone.Model

                # custom id attribute as we will be using post_meta table for saving this 
                # element details
                idAttribute : 'meta_id'

                defaults:->
                    style       : ''
                    draggable   : true
                
                name : 'element'

                
            # PUBLIC API FOR ENitity
            API =
                createElement: (data = {})->
                    
                    element = new Elements.ElementModel                        
                    element.set data    
                    if element.get('element') isnt 'Row' and element.get('element') isnt 'Column' 
                        if element.isNew()
                            element.save null,
                                     wait : true
                                
                    element


            # REQUEST HANDLERS
            App.reqres.setHandler "create:new:element",(data) ->
                API.createElement data