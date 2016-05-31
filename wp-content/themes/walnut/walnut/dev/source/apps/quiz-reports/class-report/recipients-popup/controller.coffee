define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/class-report/recipients-popup/composite-view'
],(App,RegionController)->
    App.module 'QuizRecipientsPopup', (QuizRecipientsPopup,App)->

        class QuizRecipientsPopup.Controller extends RegionController

            initialize : (options)->
                console.log options

                {@communicationModel} = options

                recipients = @communicationModel.getRecipients()
                data = recipients
                #console.log recipients
                recipients.done (result)=>
                    recipientsCollection= new Backbone.Collection result
                    if options.communicationModel.attributes.communication_type == 'quiz_published_parent_mail' || options.communicationModel.attributes.communication_type == 'quiz_summary_parent_mail'
                        recipientsCollection= new Backbone.Collection result[0]
                    recipientsCollection.each (m,index)->m.set 'id':index+1
                    console.log recipientsCollection

                    @view = @_getSelectRecipientsView recipientsCollection

                    #recipientsCollection= new Backbone.Collection result
                    #recipientsCollection.each (m,index)->m.set 'id':index+1

                    @show @view

                    @listenTo @view, 'close:popup:dialog',->
                        @region.closeDialog()  

                    @listenTo @view, 'itemview:preview:email',(itemview, id)->
                        recipient = recipientsCollection.get id
                        preview= @communicationModel.getPreview recipient
                        preview.done (content)=>
                            itemview.triggerMethod "show:preview",content.html

            _getSelectRecipientsView :(recipients, data)=>
                new QuizRecipientsPopup.Views.RecipientsView
                    model        : @communicationModel
                    collection   : recipients
                    data         : data

        App.commands.setHandler 'show:quiz:select:recipients:popup',(options)->
            new QuizRecipientsPopup.Controller options