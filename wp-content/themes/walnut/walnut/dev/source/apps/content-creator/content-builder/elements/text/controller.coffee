define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/text/views'
		'apps/content-creator/content-builder/elements/text/settings/controller'],
		(App,Element)->

			App.module 'ContentCreator.ContentBuilder.Element.Text', (Text, App, Backbone, Marionette, $, _)->

				# menu controller
				class Text.Controller extends Element.Controller

					# intializer
					initialize:(options)->
						_.defaults options.modelData,
											element  	: 'Text'
											content		: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
														   Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'

						super(options)
						
					bindEvents:->
						# start listening to model events
						#@listenTo @layout.model, "change:content", @renderElement
						super()

					_getTextView:(model)->
						new Text.Views.TextView
										model : model

					# setup templates for the element
					renderElement:()=>
						@removeSpinner()
						view = @_getTextView @layout.model

						# listen to "text:element:blur" event
						# this will pass the current html for the text element.
						# set it to the model. If it is a different markup it will 
						# change the model changed property to true
						# save the new markup if the model is changed
						@listenTo view, "text:element:blur",(html) =>
								@layout.model.set 'content', "#{html}"
								# server side
								# @layout.model.save() if @layout.model.hasChanged()

								# local...........TO BE DELETED
								if @layout.model.hasChanged()
									console.log "saving them"
									localStorage.setItem 'ele'+@layout.model.get('meta_id'), JSON.stringify(@layout.model.toJSON())

						@layout.elementRegion.show view