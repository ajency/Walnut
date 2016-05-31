define ['app'
		'text!apps/content-modules/modules-listing/templates/content-modules-list-tmpl.html'
		'bootbox'
], (App, contentListTpl,bootbox)->
	App.module "ContentModulesApp.ModulesListing.Views", (Views, App, Backbone, Marionette, $, _)->
		class ListItemView extends Marionette.ItemView

			tagName : 'tr'
			className : 'gradeX odd'

			template : '<td class="v-align-middle"><div class="checkbox check-default">
							<input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}">
							<label for="checkbox{{id}}"></label>
						  </div>
						</td>
						<td>{{name}}</td>
						{{#isQuiz}}<td>{{quiz_type}}</td>{{/isQuiz}}
						<td>{{textbookName}}</td>
						<td>{{chapterName}}</td>
						<td>{{durationRounded}} {{minshours}}</td>
						{{#isQuiz}}<td>{{marks}}</td>{{/isQuiz}}
						<td>{{&statusMessage}}</td>
						<td><a target="_blank" class="view-content-piece" href="{{view_url}}">View</a> 
							{{#is_editable}}
								<span class="editLinkSpan nonDevice">|</span>
								<a target="_blank" href="{{edit_url}}" class="editLink nonDevice">Edit</a>
							{{/is_editable}}
							{{#is_under_review}}
								<span class="nonDevice publishModuleSpan">|</span>
								<a target="_blank" class="nonDevice publishModule">Publish</a>
							{{/is_under_review}}
							{{#is_published}}
								<span class="nonDevice archiveModuleSpan">|</span>
								<a target="_blank" class="nonDevice archiveModule"> Archive</a>
							{{/is_published}}
							<span class="nonDevice">|</span><a target="_blank" class="nonDevice cloneModule"> Clone</a>
							<i class="fa spinner"></i>
						</td>'

			serializeData : ->
				console.log "serializeData"
				data = super()
				data.view_url = SITEURL + "/#view-group/#{data.id}"
				data.edit_url = SITEURL + "/#edit-module/#{data.id}"
				console.log data
				data.textbookName = =>
					console.log data.term_ids.textbook
					textbook = _.findWhere @textbooks, "id" : parseInt data.term_ids.textbook
					textbook.name if textbook?
				console.log data.textbookName

				data.chapterName = =>
					chapter = _.chain @chapters.findWhere "id" : data.term_ids.chapter
					.pluck 'name'
						.compact()
						.value()
					chapter

				data.durationRounded = ->
					if data.minshours is 'hrs'
						_.numberFormat parseFloat(data.duration), 2
					else
						data.duration

				if @groupType is 'quiz'
					data.quiz_type = @model.getQuizTypeLabel()
					data.view_url = SITEURL + "/#view-quiz/#{data.id}"
					data.edit_url = SITEURL + "/#edit-quiz/#{data.id}"

				if @groupType is 'student-training'
					data.view_url = SITEURL + "/#view-student-training-module/#{data.id}"
					data.edit_url = SITEURL + "/#edit-student-training-module/#{data.id}"


				data.statusMessage = ->
					if data.post_status is 'underreview'
						return '<span class="post-status label label-important">Under Review</span>'
					else if data.post_status is 'publish'
						return '<span class="post-status label label-info">Published</span>'
					else if data.post_status is 'archive'
						return '<span class="post-status label label-success">Archived</span>'

				data.is_published = true if data.post_status is 'publish'
				data.is_under_review  = true if data.post_status is 'underreview'
				data.is_editable = true if data.post_status is 'underreview'
				data


			mixinTemplateHelpers : (data)->
				data = super data
				data.isQuiz = true if @groupType is 'quiz'
				data

			events:
				'click a.cloneModule' : 'cloneModule'
				'click a.publishModule':-> @changeModuleStatus 'publish'
				'click a.archiveModule':-> @changeModuleStatus 'archive'

			initialize : (options)->
				console.log "here"
				@textbooks = options.textbooksCollection
				@chapters = options.chaptersCollection
				@groupType = options.groupType

			cloneModule :->
				bootbox.confirm "Are you sure you want to clone '#{@model.get('name')}' ?", (result)=>
					if(result)
						@addSpinner()			
						@cloneModel = switch @groupType
										when 'teaching-module'	then App.request "new:content:group"
										when 'quiz'				then App.request "new:quiz"
										when 'student-training' then App.request "new:student:training:module"

						groupData = @model.toJSON()
						@clonedData = _.omit groupData,
						  ['id', 'last_modified_on', 'last_modified_by', 'created_on', 'created_by']
						@clonedData.name = "#{@clonedData.name}"
						@clonedData.post_status = "underreview"

						App.execute "when:fetched", @cloneModel, =>
							@cloneModel.save @clonedData,
								wait : true
								success : @successSaveFn
								error : @errorFn
								complete: @removeSpinner
									
			successSaveFn : (model)=>
				model.set('content_pieces', @clonedData.content_pieces)
				model.save 'changed' : 'content_pieces' ,
					wait : true
					success : @successUpdateFn
					error : @errorFn

			successUpdateFn : (model)=>
				url = switch @groupType
						when 'teaching-module'	then "edit-module"
						when 'quiz'				then "edit-quiz"
						when 'student-training' then "edit-student-training-module"
				
				App.navigate "#{url}/#{model.id}", true

			
			errorFn : ->
				console.log 'error'
			
			addSpinner:->
				@$el.find '.spinner'
				.addClass 'fa-spin fa-spinner'
			
			removeSpinner:=>
				@$el.find '.spinner'
				.removeClass 'fa-spin fa-spinner'
			
			changeModuleStatus:(status)->
				bootbox.confirm "Are you sure you want to #{status} '#{@model.get('name')}' ?", (result)=>
					if result
						@addSpinner()
						@model.save {post_status: status, changed: 'module_details'},
							success:=> @changeStatusLabel status								
							error:(resp)-> console.log resp
							complete: @removeSpinner
			
			changeStatusLabel:(status)->
				switch (status)
					when 'archive'
						@$el.find '.post-status'
						.removeClass 'label-info'
						.addClass 'label-success'
						.html 'Archived'
						@$el.find '.archiveModule, .archiveModuleSpan'
						.remove()
						
					when 'publish'
						@$el.find '.post-status'
						.removeClass 'label-important'
						.addClass 'label-info'
						.html 'Published'
						
						@$el.find '.view-content-piece'
						.after '<span class="nonDevice archiveModuleSpan">|</span>
								<a target="_blank" class="nonDevice archiveModule">Archive</a>'
								
						@$el.find '.publishModule, .publishModuleSpan, .editLink, .editLinkSpan'
						.remove()

		class EmptyView extends Marionette.ItemView


			template: 'No Content Available'

			tagName: 'td'

			onShow:->
				console.log "empty view"
				@$el.attr 'colspan',9

		class Views.ModulesListingView extends Marionette.CompositeView

			template : contentListTpl

			className : 'row'

			itemView : ListItemView

			emptyView : EmptyView

			itemViewContainer : '#list-content-pieces'

			itemViewOptions : ->
				textbooksCollection : @textbooks
				chaptersCollection  : Marionette.getOption @, 'chaptersCollection'
				groupType : @groupType

			mixinTemplateHelpers : (data)->
				data = super data
				data.isQuiz = true if @groupType is 'quiz'
				data.type = _.titleize _.humanize data.type
				console.log @groupType
				data

			events :
				'change .textbook-filter' :(e)->
					@trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id
					console.log e.target.id

				'change #check_all_div'     :-> $.toggleCheckAll @$el.find 'table'
				'change .tab_checkbox,#check_all_div '  : 'showSubmitButton'
				'change #content-post-status-filter'  	: 'setFilteredContent'
				'click .change-status button'			: 'changeStatus'
				'click .send-email-to-stud button'		: 'sendEmailStud'

			initialize : ->
				@textbooksCollection = Marionette.getOption @, 'textbooksCollection'
				@groupType = Marionette.getOption @, 'groupType'
				@textbooks = new Array()
				@textbooksCollection.each (textbookModel, ind)=>
					@textbooks.push
						'name' : textbookModel.get('name')
						'id' : textbookModel.get('term_id')

			onShow : ->

				textbookFiltersHTML= $.showTextbookFilters textbooks: @textbooksCollection
				@fullCollection = Marionette.getOption @, 'fullCollection'

				@$el.find '#textbook-filters'
				.html textbookFiltersHTML

				@$el.find '#content-pieces-table'
				.tablesorter();

				@onUpdatePager()

			sendEmailStud :(e)->
				console.log "email sent module executed"
				data = []
				@$el.find '.communication_sent'
                .remove()

                allQuizIDs= _.map $.getCheckedItems(@$el.find('#content-pieces-table')), (m)-> parseInt m
                #console.log (allQuizIDs)
                excludeIDs = _.chain @collection.where 'taken_by':0
                        .pluck 'id'
                        .value()

				#data.quizIDs = _.difference allQuizIDs,excludeIDs
				data.quizIDs = allQuizIDs
				console.log data.quizIDs
				data.division = @$el.find '#divisions-filter'
                        .val()
				if $(e.target).hasClass 'send-email'
                    data.communication_mode = 'email'
                else
                    data.communication_mode = 'sms'

                if _.isEmpty data.quizIDs
                    @$el.find '.send-email'
                    .after '<span class="m-l-40 text-error small communication_sent">
                            No quiz has been selected</span>'

                else
                	console.log data
                	@trigger "save:communications", data

			onFetchChaptersOrSectionsCompleted :(filteredCollection, filterType) ->

				switch filterType
					when 'textbooks-filter' then $.populateChapters filteredCollection, @$el
					when 'chapters-filter' then $.populateSections filteredCollection, @$el
					when 'sections-filter' then $.populateSubSections filteredCollection, @$el

				@setFilteredContent()


			setFilteredContent:->

				filtered_data= $.filterTableByTextbooks(@)

				@collection.set filtered_data

				@onUpdatePager()


			onUpdatePager:->

				@$el.find "#content-pieces-table"
				.trigger "updateCache"
				pagerOptions =
					container : @$el.find ".pager"
					output : '{startRow} to {endRow} of {totalRows}'

				@$el.find "#content-pieces-table"
				.tablesorterPager pagerOptions

			showSubmitButton:->
				if @$el.find '.tab_checkbox'
				.is ':checked'
					@$el.find '.change-status'
					.show()
					@$el.find '.send-email-to-stud'
					.show()

				else
					@$el.find '.change-status'
					.hide()
					@$el.find '.send-email-to-stud'
					.hide()

			changeStatus:(e)=>
				data = {}
				data.IDs= $.getCheckedItems @$el.find 'table'
				data.status= $(e.target).closest('.change-status').find('select').val()

				msg = "Are you sure you want to #{data.status} the selected modules ?"

				if data.status is 'publish'
					data.IDs = _.filter data.IDs, (id)=>return id if @collection.get(id).get('post_status') is 'underreview'
					msg += "<div class='small m-t-10'>
								Note: Only modules with status 'Under Review' will be changed to publish
							</div>"

					if 0 is _.size data.IDs
						bootbox.alert 'None of the selected modules can be published'
						return

				bootbox.confirm msg, (result)=>
					if result
						$(e.target).find '.fa'
						.addClass 'fa-spin fa-spinner'

						data.action = 'update-content-module-status'
						$.post AJAXURL, data
						.success (resp)=>
							@updateStatusValues data.IDs, data.status
						.fail (resp)->
							console.log 'some error occurred'
							console.log resp
						.done ->							
							$(e.target).find '.fa'
							.removeClass 'fa-spin fa-spinner'
							.addClass 'fa-check'

			updateStatusValues:(IDs, status)->
				_.each IDs, (id)=>
					model= @collection.get parseInt id
					model.set 'post_status': status

				@collection.reset @collection.models
				@onUpdatePager()