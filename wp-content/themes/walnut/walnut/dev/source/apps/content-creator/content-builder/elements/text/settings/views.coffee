define ['app'
		'text!apps/content-creator/content-builder/elements/text/settings/templates/settings.html'],
		(App, settingsTpl)->

			# Headerapp views
			App.module 'ContentCreator.ContentBuilder.Element.Text.Settings.Views', (Views, App, Backbone, Marionette, $, _)->

				class Views.SettingsView extends Marionette.ItemView

					template : settingsTpl

					className : 'modal-content settings-box'

					initialize:(opt = {})->
						{@eleModel} = opt
						super opt

					onRender:->
						@$el.find('input[type="checkbox"]').checkbox()
						# @$el.find('select').selectpicker()
						@setFields()

					# set fields for the form
					setFields:->
						if @eleModel.get('draggable') is true
							@$el.find('input[name="draggable"]').checkbox('check')
						
					events:
						'click .close-settings' : (evt)-> 
											evt.preventDefault()
											App.settingsRegion.close()
						'change input[name="draggable"]': (evt)-> @trigger "element:draggable:changed", $(evt.target).is(':checked')