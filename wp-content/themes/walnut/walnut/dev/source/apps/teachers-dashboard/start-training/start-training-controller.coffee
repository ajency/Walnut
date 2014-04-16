define ['app'
		'controllers/region-controller'
		'text!apps/teachers-dashboard/start-training/templates/class-description.html'
		'apps/teachers-dashboard/start-training/views'
		], (App, RegionController,classDescriptionTpl)->

	App.module "TeachersDashboardApp.View", (View, App)->

		#List of textbooks available to a teacher for training or to take a class

		class View.StartTrainingController extends RegionController

			initialize :(opts)->

				breadcrumb_items = 'items':[
						{'label':'Dashboard','link': '#teachers/dashboard'},
						{'label':'Start Training','link':'javascript://'}
					]

				App.execute "update:breadcrumb:model", breadcrumb_items

				{@classID} = opts

				{@division} = opts



				@textbooks = App.request "get:textbooks", (class_id : @classID)

				# @view = view = @_getTextbooksListView textbooks

				# @show view, (loading: true)
				
				@layout= layout = @_getTrainingModuleLayout()

				@show layout, (loading: true, entities: [@textbooks])

				@listenTo layout, "show", @_showTextbooksListView

				

			_showTextbooksListView :=>
				App.execute "when:fetched", @textbooks, =>
					textbookListView= new View.List.TextbooksListView
											collection: @textbooks

					classDescriptionView = new ClassDescriptionView
							templateHelpers: 
								showSubjectsList:=>
									subjectsList = _.uniq _.compact(_.flatten(@textbooks.pluck('subjects')))
									subjectsList

								showClassID:=>
									@classID



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


