define ['app'
        'text!apps/content-pieces/list-content-pieces/templates/content-pieces-list-tpl.html'
        'bootbox'], (App, contentListTpl,bootbox)->
	App.module "ContentPiecesApp.ContentList.Views", (Views, App)->
		class ListItemView extends Marionette.ItemView

			tagName : 'tr'
			className: 'gradeX odd'

			template:   '<td class="cpHeight">{{&post_excerpt}}</td>
						<td class="cpHeight">{{&present_in_str}}</td>
						<td>{{textbookName}}</td>
						<td>{{chapterName}}</td>
						<td>{{contentType}}</td>
						<td><span style="display:none">{{sort_date}} </span> {{&modified_date}}</td>
						<td>{{&statusMessage}}</td>
						<td data-id="{{ID}}" class="text-center">
							<a target="_blank" href="{{view_url}}" class="view-content-piece">View</a>
							{{&edit_link}}
							{{#is_under_review}}
								<span class="nonDevice publishModuleSpan">|</span>
								<a target="_blank" class="nonDevice publishModule">Publish</a>
							{{/is_under_review}}
							{{#is_published}}
								<span class="nonDevice archiveModuleSpan">|</span>
								<a target="_blank" class="nonDevice archiveModule">Archive</a>
							{{/is_published}}
							<span class="nonDevice">|</span>
							<a target="_blank"  class="nonDevice cloneModule">Clone</a>
							<i class="fa spinner"></i>
						</td>'

			serializeData:->
				data= super()
				
				#this is for display purpose only
				data.modified_date= moment(data.post_modified).format("Do MMM YYYY <br/> h:mm a")

				#for sorting the column date-wise
				data.sort_date= moment(data.post_modified).format "YYYYMMDD"

				if data.content_type is 'student_question'
					data.view_url = SITEURL + '/#dummy-quiz/'+data.ID

				else
					data.view_url = SITEURL + '/#dummy-module/'+data.ID

				edit_url = SITEURL + '/content-creator/#edit-content/'+data.ID
				data.edit_link= ''

				if data.post_status is 'pending'
					data.edit_link= ' <span class="nonDevice editLinkSpan">|</span> <a target="_blank" href="'+edit_url+'" class="nonDevice editLink">Edit</a>'

				data.textbookName = =>
					if data.term_ids.textbook
						textbook = _.findWhere @textbooks, "id" : data.term_ids.textbook
						textbook.name if textbook

				data.chapterName = =>
					if data.term_ids.chapter
						chapter = _.chain @chapters.findWhere "id" : data.term_ids.chapter
						.pluck 'name'
							.compact()
							.value()
						chapter

				data.statusMessage = ->
					if data.post_status is 'pending'
						return '<span class="label post-status label-important">Under Review</span>'
					else if data.post_status is 'publish'
						return '<span class="label post-status label-info">Published</span>'
					else if data.post_status is 'archive'
						return '<span class="label post-status label-success">Archived</span>'

				data.is_published = true if data.post_status is 'publish'
				data.is_under_review  = true if data.post_status is 'pending'
				modules=[]
				_.each data.present_in_modules, (ele,index)->
					modules.push "<a target='_blank' href='#view-group/"+ ele.id+"'>"+ ele.name+"</a>"

				data.present_in_str=
					if _.size(modules)>0
					then _.toSentence(modules)
					else 'Not added to a module yet'
				data.contentType = _.str.titleize _.str.humanize data.content_type
				data

			events:
				'click a.cloneModule'	:-> @model.duplicate()
				'click a.archiveModule' :-> @changeModuleStatus 'archive'
				'click a.publishModule' :-> @changeModuleStatus 'publish'

			initialize : (options)->
				@textbooks = options.textbooksCollection
				@chapters = options.chaptersCollection
			
			addSpinner:->
				@$el.find '.spinner'
				.addClass 'fa-spin fa-spinner'
			
			removeSpinner:=>
				@$el.find '.spinner'
				.removeClass 'fa-spin fa-spinner'
			
			changeModuleStatus:(status)->
				bootbox.confirm "Are you sure you want to #{status} '#{@model.get('post_excerpt')}' ?", (result)=>
					if result
						@addSpinner()
						@model.save post_status: status,
							success:=> @changeStatusLabel status								
							error:(resp)-> console.log resp
							complete:@removeSpinner
			
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
				@$el.attr 'colspan',7

		class Views.ListView extends Marionette.CompositeView

			template: contentListTpl

			className: 'row'

			itemView: ListItemView

			emptyView: EmptyView

			itemViewContainer: '#list-content-pieces'

			itemViewOptions : ->
				textbooksCollection : @textbooks
				chaptersCollection  : Marionette.getOption @, 'chaptersCollection'

			events:
				'change #content-post-status-filter, #difficulty-level-filter'  : 'setFilteredContent'

				'change .textbook-filter' :(e)->
					@trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id


			initialize : ->
				@textbooksCollection = Marionette.getOption @, 'textbooksCollection'
				@textbooks = new Array()
				@textbooksCollection.each (textbookModel, ind)=>
					@textbooks.push
						'name' : textbookModel.get('name')
						'id' : textbookModel.get('term_id')
			onShow:->
				@textbooksCollection = Marionette.getOption @, 'textbooksCollection'
				@fullCollection = Marionette.getOption @, 'fullCollection'
				textbookFiltersHTML= $.showTextbookFilters  textbooks: @textbooksCollection
				@$el.find '#textbook-filters'
				.html textbookFiltersHTML

				@$el.find "#content-pieces-table"
				.tablesorter()

				@$el.find ".select2-filters"
				.select2()

				@onUpdatePager()

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