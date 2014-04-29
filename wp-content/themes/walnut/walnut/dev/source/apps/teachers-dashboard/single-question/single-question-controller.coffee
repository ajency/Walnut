define ['app'
		'controllers/region-controller'
		#'text!apps/teachers-dashboard/take-class/templates/class-description.html'
		'apps/teachers-dashboard/single-question/student-list/student-list-app'
		'apps/teachers-dashboard/single-question/question-display/question-display-app'
		'apps/teachers-dashboard/single-question/module-description-view'
		'apps/teachers-dashboard/single-question/chorus-options/chorus-options-app'
		], (App, RegionController)->

	App.module "TeachersDashboardApp.SingleGroupApp", (View, App)->

		#Single Question description and answers

		class View.SingleQuestionController extends RegionController

			initialize :(opts)->

				{classID, @division} = opts
				{textbookID} =opts
				{@moduleID} = opts 
				{@questionID}= opts

				@textbook = App.request "get:textbook:by:id",textbookID
				@textbookName=''

				App.execute "when:fetched", @textbook, =>
					@textbookName = @textbook.get 'name'

				@contentGroupModel = App.request "get:content:group:by:id", @moduleID
				@contentPiece = App.request "get:content:piece:by:id", @questionID

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

				#initializing empty model incase data doesnt exist
				@questionResponseModel = App.request "save:question:response", ''

				#fetching collection of responses in current module for current division
				@questionResponseCollection = App.request "get:question:response:collection", 
					'collection_id': @moduleID
					'division'	: @division

				App.execute "when:fetched",	@questionResponseCollection, =>
					#checking if model exists in collection. if so, replacing the empty model
					@_getOrCreateModel @questionID
				
					@_showViews()


				App.SingleQuestionStudentsListApp.on('goto:next:question', @_changeQuestion)
				App.SingleQuestionChorusOptionsApp.on('goto:next:question', @_changeQuestion)

			_showViews:=>

				@layout= layout = @_getTakeSingleQuestionLayout()

				@show layout, (loading: true, entities: [@contentGroupModel])

				@listenTo layout, "show", @_showModuleDescriptionView 

				@listenTo layout, "show", @_showStudentsListView @questionResponseModel

				@listenTo layout, "show", @_showQuestionDisplayView @contentPiece

			_getOrCreateModel:(content_piece_id)=>
				@questionResponseModel = @questionResponseCollection.findWhere 
											'content_piece_id': content_piece_id.toString()

				#if model doesnt exist in collection setting default values
				if not @questionResponseModel
					@questionResponseModel = App.request "save:question:response", ''
					@questionResponseModel.set 
						'collection_id': @moduleID
						'content_piece_id': @questionID
						'division'	: @division
				@questionResponseModel

			_changeQuestion:=>

				contentPieces = @contentGroupModel.get 'content_pieces'
				pieceIndex = _.indexOf(contentPieces, @questionID)

				@questionID= contentPieces[pieceIndex+1]

				if @questionID
					@contentPiece = App.request "get:content:piece:by:id", @questionID

					@questionResponseModel = @_getOrCreateModel @questionID

					@_showQuestionDisplayView @contentPiece
					
					@_showStudentsListView @questionResponseModel

			_showModuleDescriptionView :=>
				App.execute "when:fetched", @contentGroupModel, =>
					moduleDescriptionView= new View.ModuleDescription.Description
											model :@contentGroupModel
											templateHelpers:
												showTextbookName:=>
													@textbookName
					
					@layout.moduleDetailsRegion.show moduleDescriptionView


			_showStudentsListView :(questionResponseModel)=>
				App.execute "when:fetched", @contentPiece, =>
					question_type = @contentPiece.get('question_type')

					if question_type is 'individual'
						App.execute "show:single:question:student:list:app", 
							region 			: @layout.studentsListRegion
							questionResponseModel: questionResponseModel

					else if question_type is 'chorus'	
						App.execute "show:single:question:chorus:options:app",
							region 			: @layout.studentsListRegion
							questionResponseModel: questionResponseModel


			_showQuestionDisplayView:(model) =>
				App.execute "show:single:question:app", 
					region 			: @layout.questionsDetailsRegion
					model 		  	: model


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



		


