define ['app'
        'controllers/region-controller'
		'bootbox'
        'apps/take-module-item/student-list/student-list-app'
        'apps/take-module-item/teacher-training-footer/training-footer-controller'
        'apps/student-training-module/take-module/module-description/module-description-app'
        'apps/take-module-item/chorus-options/chorus-options-app'
        'apps/student-training-module/take-module/item-description/controller'
        'apps/take-module-item/multiple-evaluation/multiple-evaluation-controller'
        
], (App, RegionController,bootbox)->
	App.module "StudentTrainingApp.TakeModule", (TakeModule, App)->

		#Single Question description and answers
		studentCollection = null
		questionsCollection = null
		questionResponseCollection = null
		currentItem = null
		questionResponseModel = null

		class TakeModule.Controller extends RegionController

			initialize : (opts)->
				{@division,@classID,@moduleID,@contentGroupModel,
				questionsCollection,
				currentItem,@display_mode,studentCollection} = opts
				App.leftNavRegion.reset()
				App.headerRegion.reset()
				
				@answerWreqrObject = new Backbone.Wreqr.RequestResponse()
				@answerWreqrObject.displayAnswer= true
				@answerWreqrObject.multiplicationFactor = 1
				@answerModel = App.request "create:new:answer"
				
				#dummy. just so that the rest of the functionality doesnt break as it is copied from quiz/teacher training
				questionResponseCollection = App.request "get:empty:question:response:collection"
						
				App.execute "when:fetched", [currentItem], =>
					#checking if model exists in collection. if so, replacing the empty model
					@_getOrCreateModel currentItem.get 'ID'

				@layout = layout = @_getTakeSingleQuestionLayout()
				
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
				
				@listenTo @layout, "validate:answer",->
					@answerWreqrObject.request "get:question:answer"
					@answerWreqrObject.request "submit:answer"
						
			_changeQuestion : =>
				nextItem = @_getNextItem()
				
				if nextItem
					@_showQuestionDisplayView nextItem
					@layout.triggerMethod "change:content:piece", currentItem

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
				
				currentItemType= currentItem.get 'type'
				if currentItemType? and currentItem.get('type') is 'quiz'
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
					
					if currentItem.get('content_type') is 'student_question'
						quizModel = App.request "create:dummy:quiz:module", currentItem.id
					
					App.execute "show:content:board",
						region : @layout.contentBoardRegion
						model : currentItem
						direction:direction
						answerWreqrObject   : @answerWreqrObject
						quizModel           : quizModel if quizModel
						
			_showQuiz :=>
				App.execute "show:single:quiz:app",
					region	: App.mainContentRegion
					quizModel : currentItem
					studentTrainingModule: @contentGroupModel

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
						
						<div class="container-grey m-b-10 p-l-10 p-r-10 p-t-10 p-b-10 h-center quizActions none"> 
							<button type="button" id="submit-question" class="btn btn-success pull-right">
								Submit <i class="fa fa-forward"></i> 
							</button>
							
							<div class="text-center">
								{{#show_hint}}
								<button type="button" id="show-hint" class="btn btn-default btn-sm btn-small m-r-10">
									<i class="fa fa-lightbulb-o"></i> Hint
								</button>
								{{/show_hint}}
							</div>
							<div class="clearfix"></div>
						</div>'

			regions :
				moduleDetailsRegion : '#module-details-region'
				contentBoardRegion : '#content-board'
				studentsListRegion : '#students-list-region'
				topPanelRegion : '#top-panel'
				
			events:->
				'click #submit-question'    :(e)->
					@$el.find '.quizActions'
					.addClass 'none'
					@trigger "validate:answer"
				'click #skip-question'      :-> @trigger "skip:question"
				'click #show-hint'          :-> 
					bootbox.alert @model.get 'hint'
					@trigger 'show:hint:dialog'
			
			mixinTemplateHelpers:(data)->
				data.show_hint =true if _.trim data.hint
				data
			
			onShow : ->
				$('.page-content').addClass 'condensed expand-page'
				@onChangeContentPiece @model

			onChangeContentPiece:(currentItem)->
				
				instructionsLabel = if currentItem.get('content_type') is 'content_piece' then 'Procedure Summary' else 'Instructions'
				
				if currentItem.get('content_type') is 'student_question'
					@$el.find '.quizActions'
					.removeClass 'none'
				else
					@$el.find '.quizActions'
					.addClass 'none'
				
				if instructionsLabel
					@$el.find '#instructions-label'
					.html instructionsLabel

				@$el.find '#instructions'
				.html currentItem.get 'instructions'


		# set handlers
		App.commands.setHandler "start:student:training:app", (opt = {})->
			new TakeModule.Controller opt