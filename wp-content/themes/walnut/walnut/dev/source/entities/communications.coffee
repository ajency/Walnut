define ["app", 'backbone'], (App, Backbone) ->

    #entity for sms and email communications
    App.module "Entities.Communications", (Communications, App, Backbone, Marionette, $, _)->

        # Communications model
        class Communications.ItemModel extends Backbone.Model

            defaults:
                component           : ''  # eg. teaching_modules, registration etc
                communication_type  : ''  # eg. taught_in_class_student_mail (subtype under component)
                recipients    	    : []
                status        	    : ''
                date      	   	    : ''
                priority            : 0
                communication_mode 	: ''  # sms or email (stored in meta table)
                additional_data     : []  # additional data to be stored in meta table

            name: 'communications'

        # Communications collection class
        class Communications.ItemCollection extends Backbone.Collection

            model : Communications.ItemModel

            url: ->
                AJAXURL + '?action=get-communications'

            parse: (resp)->
                resp.data

        API =
            saveCommunications : (data)->
                CommunicationsModel = new Communications.ItemModel()
                CommunicationsModel.set data
                CommunicationsModel.save()
                CommunicationsModel


        App.reqres.setHandler "save:communications" ,(data)->

            API.saveCommunications data
