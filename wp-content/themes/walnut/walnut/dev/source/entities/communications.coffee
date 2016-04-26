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

            getRecipients:->
                url     = AJAXURL + '?action=get-communication-recipients'
                data    = @.toJSON()

                defer = $.Deferred()

                $.post url, 
                    data, (response) =>
                        console.log response
                        defer.resolve response
                    'json'
                    
                defer.promise()


            getPreview:(recipient)->
                console.log recipient
                console.log @.toJSON()
                url     = AJAXURL + '?action=get-communication-preview'
                data    = @.toJSON()
                data.additional_data.preview_recipient = recipient.toJSON()

                defer = $.Deferred()

                $.post url, 
                    data, (response) =>
                        console.log response
                        defer.resolve response
                    'json'
                    
                defer.promise()

        # Communications collection class
        class Communications.ItemCollection extends Backbone.Collection

            model : Communications.ItemModel

            url: ->
                AJAXURL + '?action=get-communications'

            parse: (resp)->
                resp.data


        API =

            createCommunication: (data)->
                CommunicationsModel = new Communications.ItemModel()
                CommunicationsModel.set data
                CommunicationsModel

        App.reqres.setHandler "create:communication" ,(data)->
            API.createCommunication data
