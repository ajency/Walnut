define ['app'
        'controllers/region-controller'
        'apps/take-module-item/student-list/student-list-app'
        'apps/take-module-item/teacher-training-footer/training-footer-controller'
        'apps/student-training-module/take-module/module-description/module-description-app'
        'apps/take-module-item/chorus-options/chorus-options-app'
        'apps/student-training-module/take-module/item-description/controller'
        'apps/take-module-item/multiple-evaluation/multiple-evaluation-controller'
        
], (App, RegionController)->
	App.module "StudentTrainingApp.TakeModule", (TakeModule, App)->

		#iSngle Question description and answers
		studentCollection = null
		questionsCollection = null
		questionResponseCollection = null
		currentItem = null
		questionResponseModel = null

		class TakeModule.Controller extends RegionController

			initialize : (opts)->
				{@division,@classID,@moduleID,@contentGroupModel,
				questionsCollection,questionResponseCollection,
				currentItem,@display_mode,studentCollection} = opts
				App.leftNavRegion.reset()
				App.headerRegion.reset()

				App.execute "when:fetched", [questionResponseCollection, currentItem], =>
					#checking if model exists in collection. if so, replacing the empty model
					@_getOrCreateModel currentItem.get 'ID'

				@layout = layout = @_getTakeSingleQuestionLayout()
				
				App.vent.bind "next:item:student:training:module", (data)=>
					#App.vent.unbind "next:item:student:training:module"
					#modify the current content piece with the current data so that we can find the next piece
					currentItem.set 'ID': data.id, 'post_type': data.type
					@_changeQuestion()
					
				if currentItem.get('type') is 'quiz'
					@_showQuiz()
					return
					
				@show @layout, (
					loading : true
					entities : [
						@contentGroupModel
						studentCollection
						questionsCollection
						questionResponseCollection
						questionResponseModel
						currentItem
					]
				)

				@timerObject = new Backbone.Wreqr.RequestResponse()

				@listenTo @layout, "show", @_showModuleDescriptionView

				@listenTo @layout, 'show', =>
					if currentItem.get('content_type') is 'content_piece'
						@_showTeacherTrainingFooter()
					else
						@_showStudentsListView questionResponseModel

				@listenTo @layout, "show", @_showQuestionDisplayView currentItem

				@listenTo @layout.moduleDetailsRegion, "goto:previous:route", @_gotoViewModule

				@listenTo @layout.studentsListRegion, "goto:previous:route", @_gotoViewModule

				@listenTo @layout.moduleDetailsRegion, "goto:next:question", @_changeQuestion

				@listenTo @layout.studentsListRegion, "goto:next:question", @_changeQuestion

				@listenTo @layout.topPanelRegion, "top:panel:previous", =>
					@_showPrevQuestion()

				@listenTo @layout.topPanelRegion, "top:panel:question:done", =>
					@layout.moduleDetailsRegion.trigger "top:panel:question:done"

				@listenTo @layout.topPanelRegion, "top:panel:check:last:question", =>
					@layout.moduleDetailsRegion.trigger "top:panel:check:last:question"
				
			_changeQuestion : =>
				if @display_mode is 'class_mode'
					@_saveQuestionResponse "completed"

				nextItem = @_getNextItem()

				if nextItem
					@_showQuestionDisplayView nextItem
					@layout.triggerMethod "change:content:piece", currentItem

					if @display_mode is 'training' or currentItem.get('content_type') is 'content_piece'
						@_showTeacherTrainingFooter()

					# else if currentItem.get('question_type') is 'multiple_eval'
					#   @_showStudentsListView questionResponseModel

				else
					@_gotoViewModule()

			_getNextItem : ->
				contentLayout = @contentGroupModel.get 'content_layout'
				
				item = _.filter contentLayout, (item)->
							item if item.type is currentItem.get('post_type') && parseInt(item.id) is currentItem.id
							
				pieceIndex = _.indexOf contentLayout,item[0]
				
				nextItem = contentLayout[pieceIndex + 1]
				
				if not nextItem
					nextItem = false
					
				nextItem

			_showPrevQuestion:->
				prevItem = @_getPrevItem()

				if prevItem
					@_showQuestionDisplayView prevItem,direction:'rtl'
					@layout.triggerMethod "change:content:piece", currentItem
				else
					@_gotoViewModule()

			_getPrevItem : ->
				contentLayout = @contentGroupModel.get 'content_layout'
				
				item = _.filter contentLayout, (item)->
							item if item.type is currentItem.get('post_type') && parseInt(item.id) is currentItem.id
							
				pieceIndex = _.indexOf contentLayout,item[0]
				
				prevItem = contentLayout[pieceIndex - 1]
				
				if not prevItem
					prevItem = false
					
				prevItem

			_gotoViewModule : =>
				if @display_mode is 'class_mode' and questionResponseModel.get('status') isnt 'completed'
					@_saveQuestionResponse "paused"

				else
					@_startViewModuleApp()

			_saveQuestionResponse : (status) =>
				elapsedTime = @timerObject.request "get:elapsed:time"

				data=
					time_taken : elapsedTime
					status : status
					end_date: moment().format("YYYY-MM-DD") if status is 'completed'
					teacher_name: App.request "get:user:data", "display_name"

				questionResponseModel.set data

				questionResponseCollection.add questionResponseModel

				if not moment(questionResponseModel.get('start_date')).isValid()
					data.start_date = moment().format("YYYY-MM-DD")

				questionResponseModel.save data,
					wait : true
					success :(model)=>
						if model.get('status') is 'paused'
							@_startViewModuleApp()

			_startViewModuleApp:=>

				#get the header and left nav back incase it was hidden for quiz view
				$.showHeaderAndLeftNav()

				App.execute "show:student:training:module",
					region: App.mainContentRegion
					model: @contentGroupModel


			_getOrCreateModel : (content_piece_id)=>
				questionResponseModel = questionResponseCollection.findWhere
					'content_piece_id' : content_piece_id

				#if model doesnt exist in collection setting default values
				if not questionResponseModel
					modelData = {
						collection_id : @contentGroupModel.get 'id'
						content_piece_id : content_piece_id
						division : @division
					}
					questionResponseModel = App.request "save:question:response", ''
					questionResponseModel.set 'question_response',[]
					questionResponseModel.set modelData

					if @display_mode is 'class_mode'
						questionResponseModel.save()

				questionResponseModel


			_showModuleDescriptionView : =>
				App.execute "when:fetched", @contentGroupModel, =>
					App.execute "show:student:training:module:description",
						region : @layout.moduleDetailsRegion
						model : @contentGroupModel
						timerObject : @timerObject
						questionResponseModel : questionResponseModel
						questionResponseCollection : questionResponseCollection
						display_mode : @display_mode

			_showQuestionDisplayView : (model,direction='ltr') =>
				if model instanceof Backbone.Model
					currentItem = model
				else
					currentItem = _.first questionsCollection.filter (item)-> 
								modelType = if model.type is 'quiz' then 'type' else 'post_type' 
								item if item.id is parseInt(model.id) and item.get(modelType) is model.type
								
				if currentItem.get('type') is 'quiz'
					@_showQuiz()
					return

				questionResponseModel = @_getOrCreateModel currentItem.id
				
				if not questionResponseModel
					@_getOrCreateModel currentItem.ID

				App.execute "show:student:top:panel",
					region : @layout.topPanelRegion
					model : currentItem
					questionResponseModel : questionResponseModel
					timerObject : @timerObject
					display_mode : @display_mode
					students : studentCollection
					classID  : @classID

				App.execute "when:fetched", questionResponseModel, =>

					if currentItem.get('question_type') is 'multiple_eval'
						App.execute "show:single:question:multiple:evaluation:app",
							region : @layout.contentBoardRegion
							questionResponseModel : questionResponseModel
							studentCollection : studentCollection
							display_mode : @display_mode
							timerObject : @timerObject
							evaluationParams : currentItem.get 'grading_params'

						@layout.studentsListRegion.reset()


					else
						App.execute "show:content:board",
							region : @layout.contentBoardRegion
							model : currentItem
							direction:direction

						@_showStudentsListView questionResponseModel
						
			_showQuiz :=>
				App.execute "show:single:quiz:app",
					region	: App.mainContentRegion
					quizModel : currentItem
					studentTrainingModule: @contentGroupModel

			_showStudentsListView : (questionResponseModel)=>
				App.execute "when:fetched", currentItem, =>
					question_type = currentItem.get('question_type')

					if question_type is 'individual'
						App.execute "show:single:question:student:list:app",
							region : @layout.studentsListRegion
							questionResponseModel : questionResponseModel
							studentCollection : studentCollection
							display_mode : @display_mode
							timerObject : @timerObject

					else if question_type is 'chorus'
						App.execute "show:single:question:chorus:options:app",
							region : @layout.studentsListRegion
							questionResponseModel : questionResponseModel
							display_mode : @display_mode
							timerObject : @timerObject


			_showTeacherTrainingFooter : =>
				App.execute "when:fetched", currentItem, =>
					question_type = currentItem.get('question_type')
					nextItem = @_getNextItem()
					App.execute 'show:teacher:training:footer:app',
						region : @layout.studentsListRegion
						contentPiece : currentItem
						nextItemID : nextItem.id


			_getTakeSingleQuestionLayout : ->
				new SingleQuestionLayout
					model: currentItem

		class SingleQuestionLayout extends Marionette.Layout

			template : '<div id="module-details-region"></div>
						<div class="" id="top-panel"></div>
						<div class="container-grey m-b-5  qstnInfo ">
							<label class="form-label bold small-text muted no-margin inline" id="instructions-label"> </label>
							<span class="small-text" id="instructions"></span>
						</div>
						<div id="content-board">
						</div>
						<div id="students-list-region"></div>'

			regions :
				moduleDetailsRegion : '#module-details-region'
				contentBoardRegion : '#content-board'
				studentsListRegion : '#students-list-region'
				topPanelRegion : '#top-panel'

			onShow : ->
				$('.page-content').addClass 'condensed expand-page'
				@onChangeContentPiece @model

			onChangeContentPiece:(currentItem)->
				instructionsLabel = if currentItem.get('content_type') is 'content_piece' then 'Procedure Summary' else 'Instructions'

				if instructionsLabel
					@$el.find '#instructions-label'
					.html instructionsLabel

				@$el.find '#instructions'
				.html currentItem.get 'instructions'


		# set handlers
		App.commands.setHandler "start:student:training:app", (opt = {})->
			new TakeModule.Controller opt