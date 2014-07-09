define ['app'], (App)->
    App.module "ContentCreator.ContentBuilder.Element.Sort.Views",
    (Views, App, Backbone, Marionette, $, _)->
        class OptionView extends Marionette.ItemView
            className: 'sort-option'

            template: '<input type="hidden" id="optionNo" value="{{optionNo}}">
                        							<div class="sort-option-text"></div>'

            # avoid and anchor tag click events
            # listen to blur event for the text element so that we can save the new edited markup
            # to server. The element will triggger a text:element:blur event on blur and pass the
            # current markupup as argument
            events:
                'click a': (e)->
                    e.preventDefault()
                'blur .sort-option-text': ->
                    @model.set 'text', @$el.find('.sort-option-text').html()
            # @trigger "text:element:blur"


            # initialize the CKEditor for the text element on show
            # used setData instead of showing in template. this works well
            # using template to load content add the html tags in content
            # hold the editor instance as the element property so that
            # we can destroy it on close of element
            onShow: ->
                @$el.attr 'id', 'sort-option-' + @model.get 'optionNo'
                @$el.find('.sort-option-text').attr('contenteditable', 'true').attr 'id', "text-#{@model.get('optionNo')}"#_.uniqueId 'text-'
                CKEDITOR.on 'instanceCreated', @configureEditor
                @editor = CKEDITOR.inline document.getElementById @$el.find('.sort-option-text').attr 'id'
                @editor.setData _.stripslashes @model.get 'text'

                # wait for CKEditor to be loaded
                _.delay =>
                    $('#cke_' + @editor.name).on 'click', (evt)->
                        evt.stopPropagation()

                , 500

            configureEditor: (event) =>
                editor = event.editor
                element = editor.element
                if element.getAttribute('id') is @$el.find('.sort-option-text').attr 'id'
                    editor.on 'configLoaded', ->
                        editor.config.placeholder = 'Type option here..'



            # destroy the Ckeditor instance to avoiid memory leaks on close of element
            # this.editor will hold the reference to the editor instance
            # Ckeditor has a destroy method to remove a editor instance
            onClose: ->
                @editor.destroy()

        class Views.SortView extends Marionette.CollectionView

            className: 'sort'

            itemView: OptionView

            initialize: (options)->
                @sort_model = options.sort_model

            onShow: ->
                # set event handler for click of mcq and stop propogation of the event
                @$el.parent().parent().on 'click', (evt)=>
                    @trigger "show:this:sort:properties"
                    evt.stopPropagation()

                # change the bg color on initial show
                @_changeBGColor()

                # events handlers for change of model attributes
                @sort_model.on 'change:bg_color', @_changeBGColor
                @sort_model.on 'change:bg_opacity', @_changeBGColor
                @sort_model.on 'change:height', @_changeHeight


                # enable sorting
                @_enableSorting()

                @_changeHeight @sort_model, @sort_model.get 'height'



            # # trigger when the no of models in collection has been changed
            # # change the bg color and enable sorting
            onAfterItemAdded: ->
                @_changeBGColor()
                @_enableSorting()
                @_changeHeight @sort_model, @sort_model.get 'height'


            # on change of bg_color property
            _changeBGColor: (model, bgColor)=>
                @$el.find('.sort-option').css 'background-color', _.convertHex @sort_model.get('bg_color'), @sort_model.get('bg_opacity')

            # on change of height property
            _changeHeight: (model, height)=>
                @$el.find('.sort-option').css 'min-height', height + 'px'


            _enableSorting: ->
                # on mouse down on the text area remove sortable so as to enable typing
                # @$el.sortable('destroy') if @$el.hasClass 'ui-sortable'
                @$el.find('.sort-option-text').on 'mousedown', (evt)=>
                    evt.stopPropagation()

                # on mousedown of th option make it sortable if not already is
                @$el.find('.sort-option').on 'mousedown', =>
                    @trigger "show:this:sort:properties"
                    if not @$el.hasClass 'ui-sortable'
                        @$el.sortable
                            cursor: "move"
                            stop: @_onOptionPositionChanged

            _onOptionPositionChanged: =>
                @$el.find('input#optionNo').each (index, element)=>
                    console.log index + "  " + element.value
                    @collection.get(element.value).set 'index', index + 1

                @collection.comparator = (model)->
                    model.get 'index'

                @collection.sort()



            # on close drestroy the sortable
            onClose: ->
                @$el.sortable('destroy') if @$el.hasClass 'ui-sortable'
			





