define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/teacherquestion/view'],
		(App,Element)->

			App.module 'ContentPreview.ContentBoard.Element.TeacherQuestion',
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
						# @removeSpinner()
						# console.log 's'
						# get menu 
						view = @_getMainView()
						@layout.elementRegion.show view

						

					_getMainView:()->
						console.log @layout
						new TeacherQuestion.Views.MainView
										model : @layout.model


				