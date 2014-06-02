define ['app'], (App)->

    # Row views
    App.module 'ContentCreator.ContentBuilder.Element.Text.Views', (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.TextView extends Marionette.ItemView

            tagName: 'div'

            template: ''

            className: 'text'

            # avoid and anchor tag click events
            # listen to blur event for the text element so that we can save the new edited markup
            # to server. The element will triggger a text:element:blur event on blur and pass the
            # current markupup as argument
            events:
                'click a': (e)->
                    e.preventDefault()
                'blur': ->
                    @trigger "text:element:blur", @$el.html()


            # initialize the CKEditor for the text element on show
            # used setData instead of showing in template. this works well
            # using template to load content add the html tags in content
            # hold the editor instance as the element property so that
            # we can destroy it on close of element
            onShow: ->
                console.log @model.get 'content'
                @$el.attr('contenteditable', 'true').attr 'id', _.uniqueId 'text-'
#                CKEDITOR.on 'instanceCreated', @configureEditor
                @editor = CKEDITOR.inline document.getElementById @$el.attr 'id'
                @editor.setData _.stripslashes @model.get 'content'



#            configureEditor: (event) =>
#                editor = event.editor
#                element = editor.element
#
#                if element.getAttribute('id') is @$el.attr 'id'
#                    editor.on 'configLoaded', ->
#
#                        editor.config.placeholder = 'Type your text here...';


            # destroy the Ckeditor instance to avoiid memory leaks on close of element
            # this.editor will hold the reference to the editor instance
            # Ckeditor has a destroy method to remove a editor instance
            onClose: ->
                @editor.destroy()