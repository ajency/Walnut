define ['app'
        'controllers/region-controller'
        'apps/textbook-filters/views'
], (App, RegionController)->
	App.module "TextbookFiltersApp", (TextbookFilters, App, Backbone, Marionette, $, _)->
		class TextbookFilters.Controller extends RegionController
			initialize: (opts) ->

				{@collection,@model,@filters,@selectedFilterParamsObject, 
				@dataType, @contentSelectionType, @divisionsCollection,@post_status}=opts

				@filters = ['multi_textbooks','divisions', 'textbooks', 'chapters','sections','subsections'] if not @filters
				
				@filters.push 'student_question' if @contentSelectionType is 'student-training'
				@filters.push 'teacher_question' if @contentSelectionType is 'teaching-module'
				
				if @divisionsCollection
					class_id= @divisionsCollection.first().get('class_id') 

					data = 'class_id': class_id if class_id
				else
					data = 'fetch_all' : true

				@textbooksCollection = App.request "get:textbooks", data

				@selectedFilterParamsObject.setHandler "get:selected:parameters", =>
					textbook_filters= $(@view.el).find 'select.textbook-filter'
					for ele in textbook_filters
						if $(ele).val()?
							term_id =
								id : $(ele).val()
								text : $(ele).find(':selected').text()

				@selectedFilterParamsObject.setHandler "get:parameters:for:search", =>

					#checks for selected id based on the following order.
					#the final term id is returned

					ele= $(@view.el).find '#textbooks-filter'
					term_id= $(ele).val() if $(ele).val()

					ele= $(@view.el).find '#textbooks-multi-filter'
					term_id= $(ele).val() if $(ele).val()

					ele= $(@view.el).find '#chapters-filter'
					term_id= $(ele).val() if $(ele).val()

					ele= $(@view.el).find '#sections-filter'
					term_id= $(ele).val() if $(ele).val()

					ele= $(@view.el).find '#subsections-filter'
					term_id= $(ele).val() if $(ele).val()

					ele= $(@view.el).find '#content-post-status-filter'
					post_status= $(ele).val()

					ele= $(@view.el).find '#content-type-filter'
					content_type= $(ele).val()

					ele= $(@view.el).find '#divisions-filter'
					division= $(ele).val()

					data=
					  'term_id': term_id
					  'post_status': post_status
					  'content_type': content_type
					  'division'    : division


				App.execute "when:fetched", @textbooksCollection,=>
					@view = view = @_getTextbookFiltersView @collection
					@show @view,
						loading: true

					@listenTo @view, "update:pager", => @region.trigger "update:pager"

					@listenTo @view, "show",=>
						if @model
							term_ids = @model.get 'term_ids'

							if term_ids
								textbook_id = term_ids['textbook']

								chapter_id = term_ids['chapter'] if term_ids['chapter']?

								section_id = _.first _.flatten(term_ids['sections']) if term_ids['sections']?

								subsection_id = _.first _.flatten(term_ids['subsections']) if term_ids['subsections']?

								#fetch chapters based on the current content piece's textbook
								fetchChapters=@fetchSectionOrSubsection(textbook_id, 'textbooks-filter', chapter_id) if textbook_id?
								fetchSections=@fetchSectionOrSubsection(chapter_id, 'chapters-filter', section_id) if chapter_id?

								fetchChapters.done =>
									#fetch sections based on chapter id
									@fetchSectionOrSubsection(chapter_id, 'chapters-filter',section_id) if chapter_id?

									fetchSections.done =>
										#fetch sub sections based on chapter id
										@fetchSectionOrSubsection(section_id, 'sections-filter',subsection_id) if section_id?

					@listenTo @view, "fetch:chapters:or:sections", @fetchSectionOrSubsection
					@listenTo @view, "fetch:new:content", (textbook_id, post_status)=>

						post_status = @post_status if not post_status  

						division = @view.$el.find '#divisions-filter'
									.val()
						#textbook = []
						#textbook = textbook_id

						data = 
							'textbook'      : textbook_id
							'post_status'   : post_status if post_status
							'division'      : division if division

						console.log data.textbook


						if @contentSelectionType is 'quiz'
							data.content_type= ['student_question']

						else if @contentSelectionType is 'teaching-module'
							data.content_type= ['teacher_question','content_piece']

						else if @contentSelectionType is 'student-training'
							data.content_type= ['student_question','content_piece']


						if @dataType is 'teaching-modules'
							newContent= App.request "get:content:groups", data

						else if @dataType is 'student-training'
							newContent= App.request "get:student:training:modules", data

						else if @dataType is 'quiz'
							newContent= App.request "get:quizes", data
							#console.log newContent

						else
							newContent= App.request "get:content:pieces", data

						App.execute "when:fetched", newContent, =>
							console.log newContent
							@view.triggerMethod "new:content:fetched"

					@listenTo @view, "fetch:textbooks:by:division",(division) =>
						divisionModel = @divisionsCollection.get division
						class_id= divisionModel.get 'class_id'

						tCollection = App.request "get:textbooks", 'class_id' : class_id
						App.execute "when:fetched", tCollection, =>
							@view.triggerMethod "fetch:chapters:or:sections:completed", tCollection, 'divisions-filter'
							@view.$el.find '#textbooks-filter'
							.trigger 'change';
							@region.trigger "division:changed", division

			fetchSectionOrSubsection:(parentID, filterType, currItem) =>
				defer = $.Deferred()
				chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
				App.execute "when:fetched", chaptersOrSections, =>
					@view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType,currItem
					defer.resolve()

				defer.promise()

			_getTextbookFiltersView: (collection)=>
				new TextbookFilters.Views.TextbookFiltersView
					collection: collection
					contentGroupModel : @model
					textbooksCollection : @textbooksCollection
					divisionsCollection : @divisionsCollection
					filters             : @filters
					dataType            : @dataType

		# set handlers
		App.commands.setHandler "show:textbook:filters:app", (opt = {})->
			new TextbookFilters.Controller opt