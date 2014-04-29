define ['app'
		'controllers/region-controller'
		#'text!apps/teachers-dashboard/take-class/templates/class-description.html'
		'apps/teachers-dashboard/single-question/student-list/student-list-app'
		'apps/teachers-dashboard/single-question/question-display/question-display-app'
		'apps/teachers-dashboard/single-question/module-description-view'
		'apps/teachers-dashboard/single-question/chorus-options-view'
		], (App, RegionController)->

	App.module "TeachersDashboardApp.View", (View, App)->

		#Single Question description and answers

		class View.SingleQuestionController extends RegionController

			initialize :(opts)->

				{classID} = opts
				{@division} = opts
				{textbookID} =opts
				{@moduleID} = opts 
				{questionID}= opts


				@textbook = App.request "get:textbook:by:id",textbookID
				@textbookName=''

				App.execute "when:fetched", @textbook, =>
					@textbookName = @textbook.get 'name'

				@contentGroupModel = App.request "get:content:group:by:id", @moduleID
				@contentPiece = App.request "get:content:piece:by:id", questionID

				App.execute "when:fetched", @textbook, =>
							App.execute "when:fetched", @contentGroupModel, =>
								App.execute "when:fetched", @contentPiece, =>
									moduleName = @contentGroupModel.get 'name'
									questionTitle = @contentPiece.get 'post_title'

									breadcrumb_items = 'items':[
										{'label':'Dashboard','link':'#teachers/dashboard'},
										{'label':'Take Class','link':'#teachers/take-class/'+classID+'/'+@division},
										{'label':@textbookName,'link':'#teachers/take-class/'+classID+'/'+@division+'/textbook/'+textbookID},
										{'label':moduleName,'link':'#teachers/take-class/'+classID+'/'+@division+'/textbook/'+textbookID+'/module/'+@moduleID},
										{'label':questionTitle,'link':'javascript:;','active':'active'}
									]

									App.execute "update:breadcrumb:model", breadcrumb_items

				
				@layout= layout = @_getTakeSingleQuestionLayout()

				@show layout, (loading: true, entities: [@contentGroupModel])

				@listenTo layout, "show", @_showModuleDescriptionView 

				@listenTo layout, "show", @_showStudentsListView

				@listenTo layout, "show", @_showQuestionDisplayView
				
				

			_showModuleDescriptionView :=>
				App.execute "when:fetched", @contentGroupModel, =>
					moduleDescriptionView= new View.ModuleDescription.Description
											model :@contentGroupModel
											templateHelpers:
												showTextbookName:=>
													@textbookName
					
					@layout.moduleDetailsRegion.show moduleDescriptionView


			_showStudentsListView :=>
				App.execute "when:fetched", @contentPiece, =>
					question_type = @contentPiece.get('question_type')
					questionID = @contentPiece.get 'ID'
					collectionID = @moduleID

					if question_type is 'individual'
						App.execute "show:single:question:student:list:app", 
							region 			: @layout.studentsListRegion
							questionID  	: questionID
							collectionID 	: collectionID
							division		: @division

					else if question_type is 'chorus'	
						chorusView= new View.ChorusOptionsView.ItemView
						@layout.studentsListRegion.show chorusView 

			_showQuestionDisplayView: =>
				App.execute "show:single:question:app", 
					region 			: @layout.questionsDetailsRegion
					model 		  	: @contentPiece


			_getTakeSingleQuestionLayout : ->
				new SingleQuestionLayout

		class SingleQuestionLayout extends Marionette.Layout

			template : '<div id="module-details-region"></div>
						<div id="question-details-region"></div>
						<div id="students-list-region"></div>'

			regions: 
				moduleDetailsRegion 	: '#module-details-region'
				questionsDetailsRegion	: '#question-details-region'
				studentsListRegion		: '#students-list-region'



		


