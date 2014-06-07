define ['app'
        'text!apps/content-creator/content-builder/elements/image/settings/templates/settings.html'],
(App, settingsTpl)->

    # Headerapp views
    App.module 'ContentCreator.ContentBuilder.Element.Image.Settings.Views', (Views, App, Backbone, Marionette, $, _)->
        class Views.SettingsView extends Marionette.ItemView

            template: settingsTpl

            className: 'modal-content settings-box'

            initialize: (opt = {})->
                {@eleModel} = opt
                super opt

            onRender: ->
                @$el.find('input[type="checkbox"]').checkbox()
                @$el.find('select').select2
                    minimumResultsForSearch: -1
                @setFields()

            # set fields for the form
            setFields: ->
                if @eleModel.get('draggable') is true
                    @$el.find('input[name="draggable"]').checkbox('check')

                @$el.find('select[name="align"]').select2 'val', @eleModel.get 'align'
                @$el.find('select[name="top_margin"]').select2 'val', @eleModel.get 'top_margin'
                @$el.find('select[name="left_margin"]').select2 'val', @eleModel.get 'left_margin'
                @$el.find('select[name="bottom_margin"]').select2 'val', @eleModel.get 'bottom_margin'
                @$el.find('select[name="right_margin"]').select2 'val', @eleModel.get 'right_margin'

            events:
                'click': (evt)->
                    evt.stopPropagation()
                'click .close-settings': (evt)->
                    evt.preventDefault()
                    App.settingsRegion.close()
            #'change select[name="style"]' 	:(evt)-> @trigger "element:style:changed", $(evt.target).val()
                'change input[name="draggable"]': (evt)->
                    @trigger "element:draggable:changed", $(evt.target).is(':checked')
                'change select[name="align"]': (evt)->
                    @trigger "element:alignment:changed", $(evt.target).val()
                'change select.spacing': (evt)->
                    @trigger "element:spacing:changed", $(evt.target).attr('name'), $(evt.target).val()

