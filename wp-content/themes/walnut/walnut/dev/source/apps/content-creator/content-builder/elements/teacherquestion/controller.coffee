define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/teacherquestion/views'],
		(App,Element)->

			App.module 'ContentCreator.ContentBuilder.Element.TeacherQuestion',
			(TeacherQuestion, App, Backbone, Marionette, $, _)->

				# menu controller
				class TeacherQuestion.Controller extends Element.Controller

					# intializer
					initialize:(options)->
						_.defaults options.modelData,
											element  	: 'TeacherQuestion'
											elements 	: []
											meta_id 	: 0

						super(options)

					# setup templates for the element
					renderElement:()=>
						@removeSpinner()
						console.log 's'
						# get menu 
						view = @_getMainView()
						@layout.elementRegion.show view

						

					_getMainView:()->
						console.log @layout
						new TeacherQuestion.Views.MainView
										model : @layout.model


					# remove the element model
					deleteElement:(model)->
						if not @layout.elementRegion.currentView.$el.canBeDeleted()
							alert "Please remove elements inside row and then delete."							
						else
							model.destroy()