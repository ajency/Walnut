define ['app'
        'controllers/region-controller'
        'apps/content-creator/content-builder/elements/row/settings/views'],
(App, AppController)->
    App.module 'ContentCreator.ContentBuilder.Element.Row.Settings', (Settings, App, Backbone, Marionette, $, _)->

        # menu controller
        class Settings.Controller extends AppController

            # initialize controller
            initialize: (opt = {})->
                { @model } = opt
                @region = App.settingsRegion
                model = App.request "get:element:settings:options", 'Row'
                view = @_getSettingView model, @model

#                @listenTo view, 'render', =>
#                    @region.$el.css 'top', 200
#                    @region.$el.css 'left', 400
                @listenTo view, 'show', =>
                    @region.$el.center(false)


                @listenTo view, "element:style:changed", (style)=>
                    @model.set "style", style

                @listenTo view, "element:draggable:changed", (draggable)=>
                    @model.set "draggable", draggable

                @listenTo view, "element:column:count:changed", (newCount)=>
                    @model.set "columncount", newCount

                @show view




            # get settigns view
            _getSettingView: (model, eleModel)->
                new Settings.Views.SettingsView
                    eleModel: eleModel
                    model: model


        App.vent.on "show:row:settings:popup", (model)->
            new Settings.Controller
                model: model


						

