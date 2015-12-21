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

				groupContentCollection=null
				if not @questionResponseCollection
					@questionResponseCollection = App.request "get:empty:question:response:collection"
				
				#unbind so that multiple binds dont happen
				App.vent.unbind "next:item:student:training:module"
				
				App.vent.bind "next:item:student:training:module", (data)=>
					nextItem = @_getNextItem data
					if nextItem then @gotoTrainingModule nextItem else @showLayout()
					
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
						@showLayout()
			
			showLayout:->
				@layout = layout = @_getContentGroupViewLayout()

				@show @layout, (loading: true, entities: [model, @questionResponseCollection, groupContentCollection,
														 @textbookNames])

				@listenTo @layout, 'show', @showContentGroupViews

				@listenTo @layout.collectionDetailsRegion, 'start:training:module', @startTrainingModule

				@listenTo @layout.contentDisplayRegion, 'goto:item', (data)=>
					@gotoTrainingModule data
			
			_getNextItem : (data)->
				contentLayout = model.get 'content_layout'
				
				item = _.filter contentLayout, (item)->
							item if item.type is data.type && parseInt(item.id) is data.id
							
				pieceIndex = _.indexOf contentLayout,item[0]
				
				nextItem = contentLayout[pieceIndex + 1]
				
				if not nextItem
					nextItem = false
					
				nextItem
				
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
			
				content_layout = model.get 'content_layout'
				nextQuestion = _.first content_layout
				@gotoTrainingModule nextQuestion, 'class_mode'

			gotoTrainingModule: (data)=>
				
				currentItem = _.first groupContentCollection.filter (model)->
									modelType = if data.type is 'quiz' then 'type' else 'post_type' 
									model if model.id is parseInt(data.id) and model.get(modelType) is data.type

				App.execute "start:student:training:app",
					region				: App.mainContentRegion
					currentItem			: currentItem
					contentGroupModel	: model
					questionsCollection	: groupContentCollection
					
			# only when display mode is class_mode response changes can be done
			showContentGroupViews: =>
				textbook_termIDs = _.flatten model.get 'term_ids'
				@textbookNames = App.request "get:textbook:names:by:ids", textbook_termIDs

				App.execute "when:fetched", @textbookNames, =>
					App.execute "show:student:training:content:group:detailsapp",
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
						<div class="direction text-center">
						<div class="icon goto-prev-page"><a href="javascript:" class="btn fab-content"><i class="fa fa-hand-o-left"></i></a></div>
						<p class="welcome-text">You\'re here to view the My Body Organ Lecture</p>
						</div>
						<div id="collection-details-region" class="col-lg-10 col-lg-offset-1"></div>
						</div>
					   <div id="content-display-region"></div>'

			className: ''

			regions:
				collectionDetailsRegion: '#collection-details-region'
				contentDisplayRegion: '#content-display-region'

		# set handlers
		App.commands.setHandler "show:student:training:module", (opt = {})->
			new View.GroupController opt