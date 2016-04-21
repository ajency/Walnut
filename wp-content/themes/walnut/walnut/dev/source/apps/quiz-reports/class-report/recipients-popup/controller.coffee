define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/class-report/recipients-popup/composite-view'
],(App,RegionController)->
    App.module 'QuizRecipientsPopup', (QuizRecipientsPopup,App)->

        class QuizRecipientsPopup.Controller extends RegionController

            initialize : (options)->

                {@communicationModel} = options

                recipients = @communicationModel.getRecipients()
                #console.log recipients
                recipients.done (result)=>
                    recipientsCollection= new Backbone.Collection result
                    recipientsCollection.each (m,index)->m.set 'id':index+1

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