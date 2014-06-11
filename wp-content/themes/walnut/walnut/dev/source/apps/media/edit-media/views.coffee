define ['app'
        'text!apps/media/edit-media/templates/form.html'],
(App, formTpl)->
    App.module 'Media.EditMedia.Views', (Views, App)->
        class Views.EditMediaView extends Marionette.ItemView

            template : formTpl

            events :
                'click #save-media-details' : '_updateImageData'

            _updateImageData : ->
                data = Backbone.Syphon.serialize @
                @trigger 'update:image:data', data
