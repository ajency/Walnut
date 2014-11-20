define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/class-report/recipients-popup/composite-view'
],(App,RegionController)->
    App.module 'RecipientsPopup', (RecipientsPopup,App)->

        class RecipientsPopup.Controller extends RegionController

            initialize : (options)->

                {@quizCollection, @communicationModel} = options

                recipients = @communicationModel.getRecipients()

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
                new RecipientsPopup.Views.RecipientsView
                    model        : @communicationModel
                    collection   : recipients

        App.commands.setHandler 'show:quiz:select:recipients:popup',(options)->
            new RecipientsPopup.Controller options