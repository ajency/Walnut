define ['app'
		'controllers/region-controller'
		'text!apps/teachers-dashboard/take-class/templates/class-description.html'
		'apps/teachers-dashboard/take-class/views'
		], (App, RegionController,classDescriptionTpl)->

	App.module "TeachersDashboardApp.View", (View, App)->

		#List of textbooks available to a teacher for training or to take a class

		class View.TakeClassController extends RegionController

			initialize :(opts)->

				breadcrumb_items = 'items':[
						{'label':'Dashboard','link': '#teachers/dashboard'},
						{'label':'Take Class','link':'javascript://'}
					]

				App.execute "update:breadcrumb:model", breadcrumb_items

				{classID} = opts

				{@division} = opts

				@divisionModel = App.request "get:division:by:id", @division

				@textbooks = App.request "get:textbooks", (class_id : classID)

				# @view = view = @_getTextbooksListView textbooks

				# @show view, (loading: true)
				
				@layout= layout = @_getTrainingModuleLayout()

				@show layout, (loading: true, entities: [@textbooks,@divisionModel])

				@listenTo layout, "show", @_showTextbooksListView

				

			_showTextbooksListView :=>
				App.execute "when:fetched", [@textbooks,@divisionModel], =>
					console.log @divisionModel
					textbookListView= new View.TakeClass.TextbooksListView
							collection: @textbooks
							templateHelpers:
								showUrl:->
									'/textbook/28'


					classDescriptionView = new ClassDescriptionView
							model: @divisionModel

							templateHelpers: 
								showSubjectsList:=>
									subjectsList = _.uniq _.compact(_.flatten(@textbooks.pluck('subjects')))
									subjectsList

					@layout.textbooksListRegion.show(textbookListView)

					@layout.classDetailsRegion.show(classDescriptionView)

			_getTrainingModuleLayout : ->
				new TextbookListLayout

		class TextbookListLayout extends Marionette.Layout

				template : '<div id="class-details-region"></div>
							<div id="textbooks-list-region"></div>'

				regions: 
					classDetailsRegion 	: '#class-details-region'
					textbooksListRegion	: '#textbooks-list-region'



		class ClassDescriptionView extends Marionette.ItemView

				template: classDescriptionTpl


