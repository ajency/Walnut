define ['app'
		'controllers/region-controller'
		'text!apps/content-group/edit-group/templates/content-group.html'
		'apps/content-group/view-group/group-details/details-app'
		'apps/content-group/view-group/content-display/content-display-app'
		], (App, RegionController, contentGroupTpl)->

	App.module "ContentGroupApp.View", (View, App)->
		
		class View.GroupController extends RegionController

			initialize :(opts) ->
				{@model, @module_name, @division} = opts

				@questionResponseCollection = App.request "get:question:response:collection", 
													'division' : @division
													'collection_id' : @model.get 'id'

				App.execute "when:fetched", @model, =>
					@groupContentCollection= App.request "get:content:pieces:by:ids", @model.get 'content_pieces'

				@layout = layout = @_getContentGroupViewLayout()

				@show layout, (loading:true, entities: [@model, @questionResponseCollection, @groupContentCollection])

				@listenTo layout, 'show', @showContentGroupViews

				@listenTo @layout.collectionDetailsRegion, 'start:teaching:module', @startTeachingModule


			startTeachingModule:=>

				responseQuestionIDs = @questionResponseCollection.pluck 'content_piece_id'
				content_pieces 	 = @model.get 'content_pieces'
				nextQuestion  		 = _.first _.difference content_pieces, responseQuestionIDs

				App.execute "start:teacher:teaching:app", 
					region 		: App.mainContentRegion
					division	: @division
					contentPiece	: @groupContentCollection.get nextQuestion
					questionResponseCollection 	: @questionResponseCollection
					contentGroupModel 	: @model 
					questionsCollection 	: @groupContentCollection




			showContentGroupViews:=>
				App.execute "when:fetched", @model, =>
					App.execute "show:viewgroup:content:group:detailsapp", 
						region : @layout.collectionDetailsRegion
						model  : @model
						module_name : @module_name

					if _.size(@model.get('content_pieces'))>0
						App.execute "show:viewgroup:content:displayapp",
							region : @layout.contentDisplayRegion
							model: @model
							questionResponseCollection : @questionResponseCollection
							groupContentCollection 	: @groupContentCollection

			_getContentGroupViewLayout : =>
				new ContentGroupViewLayout


		class ContentGroupViewLayout extends Marionette.Layout

			template 	: contentGroupTpl

			className 	: ''

			regions:
				collectionDetailsRegion	: '#collection-details-region'
				contentDisplayRegion	: '#content-display-region'	

