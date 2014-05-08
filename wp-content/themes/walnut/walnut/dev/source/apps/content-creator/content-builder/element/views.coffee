define ['app'
        'holder'
        'text!apps/content-creator/content-builder/element/templates/element.html'],
(App, Holder, elementTpl)->

    # Headerapp views
    App.module 'ContentCreator.ContentBuilder.Element.Views', (Views, App, Backbone, Marionette, $, _)->

        # Pages single view
        class Views.ElementView extends Marionette.Layout

            # basic template
            template: elementTpl

            tagName: 'div'

            regions:
                elementRegion: '> .element-markup'

            # class name
            className: 'element-wrapper'

            # element events
            events:
                'click .aj-imp-settings-btn': (evt)->
                    evt.stopPropagation()
                    @trigger "show:setting:popup", @model

                'click .aj-imp-delete-btn': (evt)->
                    evt.stopPropagation()
                    @trigger "delete:element", @model

            initialize: =>
                # bind event only once
                @once 'before:render:element', =>
                    @trigger "bind:element:events"

            # set the data-element attribute for element
            onRender: ->
                # @$el.find('.element-markup > span').spin @_getOptions()

                # set mouse hover for element
            onShow: ()=>
                @$el.mouseover (evt)=>
                    evt.stopPropagation()
                    return if window.dragging
                    @$el.addClass 'hover-class'
                .mouseout ()=>
                        @$el.removeClass 'hover-class'

            # set the hidden fields before rendering the element
            onBeforeRenderElement: ->
                for field in ['meta_id', 'style', 'element']
                    @setHiddenField field, @model.get field

                @setDraggable @model.get 'draggable'

            # special hidden fields for row element
            addHiddenFields: ()->
                for field in ['draggable', 'style']
                    @$el.children('form').append "<input type='hidden' name='#{field}' value=''/>"

            # on set draggable
            setDraggable: (draggable)->
                if draggable is false
                    @$el.find('.aj-imp-drag-handle').addClass('non-visible')
                else if draggable is true
                    @$el.find('.aj-imp-drag-handle').removeClass('non-visible')

                @setHiddenField 'draggable', draggable

            setMargin: (newMargin, prevMargin = '')->
                element = @elementRegion.currentView
                element.$el.removeClass prevMargin
                element.$el.addClass newMargin

            setStyle: (newStyle, prevStyle = '')->
                element = @elementRegion.currentView
                element.$el.removeClass prevStyle
                element.$el.addClass newStyle

            # set the meta id for element
            setHiddenField: (name, value)->
                if @$el.children('form').find("input[name='#{name}']").length is 1
                    @$el.children('form').find("input[name='#{name}']").val value

            # rerender markup
            onElementModelCreated: ->
                # close the spinner
                @$el.find('.element-markup > span').spin false


            # spinner options
            _getOptions: ->
                lines: 10
                length: 6
                width: 2.5
                radius: 7
                corners: 1
                rotate: 9
                direction: 1
                color: '#000'
                speed: 1
                trail: 60
                shadow: false
                hwaccel: true
                className: 'spinner'
                zIndex: 2e9
                top: '0px'
                left: '40px'

				
		