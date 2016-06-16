define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/class-report/recipients-popup/composite-view'
],(App,RegionController)->
    App.module 'QuizRecipientsPopup', (QuizRecipientsPopup,App)->

        class QuizRecipientsPopup.Controller extends RegionController

            initialize : (options)->

                {@communicationModel} = options

                recipients = @communicationModel.getRecipients()

                recipients.done (result)=>
                    recipientsCollection= new Backbone.Collection result
                    if options.communicationModel.attributes.communication_type == 'quiz_summary_parent_mail'
                        recipientsCollection= new Backbone.Collection result[0]
                    recipientsCollection.each (m,index)->m.set 'id':index+1
                    console.log recipientsCollection

                    @view = @_getSelectRecipientsView recipientsCollection

                    @show @view

                    @listenTo @view, 'close:popup:dialog',->
                        @region.closeDialog()  

                    @listenTo @view, 'itemview:preview:email',(itemview, id)->
                        recipient = recipientsCollection.get id
                        preview= @communicationModel.getPreview recipient
                        preview.done (content)=>
                            itemview.triggerMethod "show:preview",content.html

            _getSelectRecipientsView :(recipients)=>
                new QuizRecipientsPopup.Views.RecipientsView
                    model        : @communicationModel
                    collection   : recipients

        App.commands.setHandler 'show:quiz:select:recipients:popup',(options)->
            new QuizRecipientsPopup.Controller options