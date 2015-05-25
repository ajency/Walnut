define ['app'
        'controllers/region-controller'
        'apps/student-training-module/view-module/module-description/description-app'
        'apps/student-training-module/view-module/content-display/content-display-app'
		'apps/student-training-module/take-module/take-module-controller'
], (App, RegionController)->
	App.module "StudentTrainingApp.View", (View, App)->
		class View.GroupController extends RegionController

			model= null
			groupContentCollection=null

			initialize: (opts) ->

				#get the header and left nav back incase it was hidden for quiz view
				$.showHeaderAndLeftNav()

				#mode refers to "training" mode or "take-class" mode
				{model,@classID, @mode, @division,@questionResponseCollection} = opts

				if not @questionResponseCollection
					@questionResponseCollection = App.request "get:question:response:collection",
						'division': @division
						'collection_id': model.get 'id'

				App.execute "when:fetched", model, =>

					if model.get('code') is 'ERROR'
						App.execute "show:no:permissions:app",
							region          : App.mainContentRegion
							error_header    : 'Unauthorized Training Module'
							error_msg       : model.get 'error_msg'

						return false

					groupContentCollectionFetch = @_getContentItems model
					groupContentCollectionFetch.done (groupContent)=> 
						groupContentCollection = groupContent
						@layout = layout = @_getContentGroupViewLayout()

						@show @layout, (loading: true, entities: [model, @questionResponseCollection, groupContentCollection,
																 @textbookNames])

						@listenTo @layout, 'show', @showContentGroupViews

						@listenTo @layout.collectionDetailsRegion, 'start:training:module', @startTrainingModule

						@listenTo @layout.contentDisplayRegion, 'goto:item', (data)=>
							@gotoTrainingModule data, 'readonly'

			_getContentItems :(model)->
				@contentLayoutItems = new Backbone.Collection
				@contentLayoutItems.comparator = 'order'
				@deferContent= $.Deferred()
				
				if groupContentCollection
					@deferContent.resolve groupContentCollection
					return @deferContent.promise()
				
				@defer={}
				
				defs= _.map model.get('content_layout'),(content,index)=>
							
							@defer[index]= $.Deferred()

							if content.type is 'content-piece'
								itemModel = App.request "get:content:piece:by:id",content.id
							else
								itemModel = App.request "get:quiz:by:id",content.id

							App.execute "when:fetched", itemModel, => 
								itemModel.set 'order': index+1
								@contentLayoutItems.add itemModel
								@defer[index].resolve itemModel
								
							@defer[index].promise()
					
				$.when(@defer...).done =>
					@deferContent.resolve @contentLayoutItems
					
				@deferContent.promise()
				
			startTrainingModule: =>
				responseCollection= @questionResponseCollection.where "status":"completed"
				window.f = responseCollection
				responseQuestionIDs = _.chain responseCollection
									.map (m)->m.toJSON()
									.pluck 'content_piece_id'
									.value()

				content_pieces = model.get 'content_pieces'
				if content_pieces
					content_piece_ids= _.map content_pieces, (m)-> parseInt m

				nextQuestion = _.first _.difference content_piece_ids, responseQuestionIDs

				if model.get('post_status') is 'archive'
					@gotoTrainingModule nextQuestion, 'readonly'

				else
					@gotoTrainingModule nextQuestion, 'class_mode'

			gotoTrainingModule: (data, display_mode)=>
				
				currentItem = _.first groupContentCollection.filter (model)->
									modelType = if data.type is 'quiz' then 'type' else 'post_type' 
									model if model.id is parseInt(data.id) and model.get(modelType) is data.type

				App.execute "start:student:training:app",
					region				: App.mainContentRegion
					division			: @division
					currentItem			: currentItem
					questionResponseCollection: @questionResponseCollection
					contentGroupModel	: model
					questionsCollection	: groupContentCollection
					classID				: @classID
					display_mode		: 'training' # when display mode is readonly, the save response options are not shown

			# only when display mode is class_mode response changes can be done
			showContentGroupViews: =>
				textbook_termIDs = _.flatten model.get 'term_ids'
				@textbookNames = App.request "get:textbook:names:by:ids", textbook_termIDs

				App.execute "when:fetched", @textbookNames, =>
					App.execute "show:viewgroup:content:group:detailsapp",
						region: @layout.collectionDetailsRegion
						model: model
						mode: @mode
						questionResponseCollection: @questionResponseCollection
						textbookNames: @textbookNames

					if _.size(model.get('content_layout')) > 0
						App.execute "show:student:training:content:displayapp",
							region: @layout.contentDisplayRegion
							model: model
							mode: @mode
							questionResponseCollection: @questionResponseCollection
							groupContentCollection: groupContentCollection
							studentCollection: @studentCollection

			_getContentGroupViewLayout: =>
				new ContentGroupViewLayout


		class ContentGroupViewLayout extends Marionette.Layout

			template: '<div class="teacher-app">
						  <div id="collection-details-region"></div>
						</div>
						<div id="content-display-region"></div>'

			className: ''

			regions:
				collectionDetailsRegion: '#collection-details-region'
				contentDisplayRegion: '#content-display-region'

		# set handlers
		App.commands.setHandler "show:student:training:module", (opt = {})->
			new View.GroupController opt