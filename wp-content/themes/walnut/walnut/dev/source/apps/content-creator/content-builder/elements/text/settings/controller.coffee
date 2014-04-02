define ['app'
		'controllers/region-controller'
		'apps/content-creator/content-builder/elements/text/settings/views'],
		(App, AppController)->

			App.module 'ContentCreator.ContentBuilder.Element.Text.Settings', (Settings, App, Backbone, Marionette, $, _)->

				# menu controller
				class Settings.Controller extends AppController

					# initialize controller
					initialize:(opt ={})->
						{ @model } = opt
						@region = App.settingsRegion
						model  = App.request "get:element:settings:options", 'Text'
						view = @_getSettingView model,@model

						@listenTo view, 'render', =>
											@region.$el.css 'top',200
											@region.$el.css 'left',400

						@listenTo view, "element:style:changed",(style)=>
														@model.set "style", style

						@listenTo view, "element:draggable:changed", (draggable)=>
														@model.set "draggable", draggable	

						@show view


					# get settigns view
					_getSettingView:(model,eleModel)->
						new Settings.Views.SettingsView
												eleModel : eleModel
												model 	 : model


				App.vent.on "show:text:settings:popup", (model)->
												new Settings.Controller
																model : model