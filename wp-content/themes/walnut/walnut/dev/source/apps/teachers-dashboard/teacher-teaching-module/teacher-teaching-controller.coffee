define ['app'
		'controllers/region-controller'
		#'text!apps/teachers-dashboard/take-class/templates/class-description.html'
		'apps/teachers-dashboard/teacher-teaching-module/student-list/student-list-app'
		'apps/teachers-dashboard/teacher-teaching-module/question-display/question-display-app'
		'apps/teachers-dashboard/teacher-teaching-module/module-description/module-description-app'
		'apps/teachers-dashboard/teacher-teaching-module/chorus-options/chorus-options-app'
		], (App, RegionController)->

	App.module "TeacherTeachingApp", (View, App)->

		#Single Question description and answers

		contentGroupModel 			= null 
		studentCollection 			= null
		questionsCollection 		= null
		questionResponseCollection 	= null
		contentPiece 				= null
		questionResponseModel 		= null

		class View.TeacherTeachingController extends RegionController

			initialize :(opts)->

				{@division,@moduleID,contentGroupModel,questionsCollection,questionResponseCollection,contentPiece,@display_mode} = opts

				studentCollection = App.request "get:user:collection", ('role':'student', 'division': @division)

				#initializing empty model incase data doesnt exist
				questionResponseModel = App.request "save:question:response", ''

				App.execute "when:fetched",	questionResponseCollection, =>
					#checking if model exists in collection. if so, replacing the empty model
					@_getOrCreateModel contentPiece.get 'ID'
				
				@layout= layout = @_getTakeSingleQuestionLayout()

				@show @layout, (
					loading: true 
					entities: [
						contentGroupModel
						studentCollection
						questionsCollection
						questionResponseCollection
						questionResponseModel
						contentPiece
					]
					)

				@listenTo @layout, "show", @_showModuleDescriptionView

				@listenTo @layout, "show", @_showStudentsListView questionResponseModel

				@listenTo @layout, "show", @_showQuestionDisplayView contentPiece		

				@listenTo @layout.studentsListRegion, "goto:next:question", @_changeQuestion


			_changeQuestion:(current_question_id)=>

				current_question_id = current_question_id.toString()

				contentPieces = contentGroupModel.get 'content_pieces'

				pieceIndex = _.indexOf(contentPieces, current_question_id)

				nextQuestion= contentPieces[pieceIndex+1]
				
				if nextQuestion
					console.log nextQuestion
					contentPiece = questionsCollection.get nextQuestion

					questionResponseModel = @_getOrCreateModel nextQuestion

					@_showQuestionDisplayView contentPiece
					
					@_showStudentsListView questionResponseModel

				else 
					console.log 'end of questions'
					App.navigate @currentRoute


			_getOrCreateModel:(content_piece_id)=>
				questionResponseModel = questionResponseCollection.findWhere 
											'content_piece_id': content_piece_id.toString()

				#if model doesnt exist in collection setting default values
				if not questionResponseModel
					questionResponseModel = App.request "save:question:response", ''
					questionResponseModel.set 
						'collection_id': contentGroupModel.get 'id'
						'content_piece_id': content_piece_id
						'division'	: @division


				questionResponseModel


			_showModuleDescriptionView :=>
				App.execute "when:fetched", contentGroupModel,=>
					App.execute "show:teacher:teaching:module:description",
								region 	: @layout.moduleDetailsRegion
								model 	:contentGroupModel

			_showQuestionDisplayView:(model) =>
				App.execute "show:single:question:app", 
					region 			: @layout.questionsDetailsRegion
					model 		  	: model

			_showStudentsListView :(questionResponseModel)=>
				App.execute "when:fetched", contentPiece, =>

					question_type = contentPiece.get('question_type')

					if question_type is 'individual'
						App.execute "show:single:question:student:list:app", 
							region 					: @layout.studentsListRegion
							questionResponseModel	: questionResponseModel
							studentCollection		: studentCollection
							display_mode 	 		: @display_mode

					else if question_type is 'chorus'	
						App.execute "show:single:question:chorus:options:app",
							region 			: @layout.studentsListRegion
							questionResponseModel: questionResponseModel
							display_mode 	 		: @display_mode

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



		


