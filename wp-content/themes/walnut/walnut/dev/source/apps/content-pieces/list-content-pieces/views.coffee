define ['app'
	    'text!apps/content-pieces/list-content-pieces/templates/content-pieces-list-tpl.html'
	    'bootbox'], (App, contentListTpl,bootbox)->
	App.module "ContentPiecesApp.ContentList.Views", (Views, App)->
		class ListItemView extends Marionette.ItemView

			tagName : 'tr'
			className: 'gradeX odd'

			template:   '<td class="v-align-middle"><div class="checkbox check-default">
	                        <input class="tab_checkbox" type="checkbox" value="{{ID}}" id="checkbox{{ID}}">
	                        <label for="checkbox{{ID}}"></label>
	                      </div>
	                    </td>
	                    <td class="cpHeight">{{&post_excerpt}}</td>
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
							{{^is_used}}
								<span class="nonDevice deleteModuleSpan">|</span>
								<a target="_blank" class="nonDevice deleteModule">Delete</a>
							{{/is_used}}
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
						console.log chapter
						if typeof chapter.length = 0
							console.log "empty"
							console.log @chap
							chapter = _.chain @chap.findWhere "id" : data.term_ids.chapter
							.pluck 'name'
							.compact()
							.value()
					console.log chapter

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

				data.is_used = true if modules.length > 0
				data.present_in_str=
					if _.size(modules)>0
					then _.toSentence(modules)
					else 'Not added to a module yet'
				data.contentType = _.str.titleize _.str.humanize data.content_type
				data

			events:
				'click a.deleteModule'	:-> @deleteModule 'delete'
				'click a.cloneModule'	:-> @model.duplicate()
				'click a.archiveModule' :-> @changeModuleStatus 'archive'
				'click a.publishModule' :-> @changeModuleStatus 'publish'

			initialize : (options)->
				console.log options
				@textbooks = options.textbooksCollection
				@chapters = options.chaptersCollection
				@chap = options.chapCollection

			addSpinner:->
				@$el.find '.spinner'
				.addClass 'fa-spin fa-spinner'

			removeSpinner:=>
				@$el.find '.spinner'
				.removeClass 'fa-spin fa-spinner'

			deleteModule:(status) ->
				bootbox.confirm "Are you sure you want to delete '#{@model.get('post_excerpt')}' ?", (result)=>
					if result
	        			@addSpinner()
	        			model_id = @model.id
	        			data = {}
	        			data.action = 'delete-content-module'
	        			data.id = model_id
        				return $.post(AJAXURL, data).success((resp) ->
          					_this.model.destroy()
        				)


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
			console.log "EmptyView"
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
				console.log 'list'
				textbooksCollection : @textbooks
				chaptersCollection  : Marionette.getOption @, 'chaptersCollection'
				chapCollection : Marionette.getOption @, 'chapCollection'

			events:
				'change #content-post-status-filter, #difficulty-level-filter'  : 'setFilteredContent'

				'change .textbook-filter' :(e)->
					@trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id

				'change #check_all_div'     			:-> $.toggleCheckAll @$el.find 'table'
				'change .tab_checkbox,#check_all_div '  : 'showSubmitButton'
				'click .change-status button'			: 'changeStatus'
				'change #status_dropdown'				: 'show_destination_textbooks'
				'change #destination_textbook #textbooks-filter'				: 'show_destination_chapters'
				'change #destination_textbook #chapters-filter'				: 'show_destination_sections'
				'change #destination_textbook #sections-filter'				: 'show_destination_subsections'

			initialize : ->
				@textbooksCollection = Marionette.getOption @, 'textbooksCollection'
				@textbooks = new Array()
				@textbooksCollection.each (textbookModel, ind)=>
					@textbooks.push
						'name' : textbookModel.get('name')
						'id' : textbookModel.get('term_id')

			onShow:->
				@chaptersCollection  = Marionette.getOption @, 'chaptersCollection'
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


			showSubmitButton:->
  				if @$el.find(".tab_checkbox").is(":checked")
    				@$el.find(".change-status").show()
    				@$el.find(".move-content").show()
  				else
    				@$el.find(".change-status").hide()
    				@$el.find(".move-content").hide()



			moveContent:(e)=>
					chapter = $("#destination_textbook #chapters-filter option:selected").val()
					if isNaN(parseInt(chapter)) or !isFinite(chapter)
						chapter=0
						bootbox.alert 'Please select a chapter'
						return

					sections = $("#destination_textbook #sections-filter option:selected").val()
					if isNaN(parseInt(sections)) or !isFinite(sections)
						sections=0


					data = {}
					data.IDs= $.getCheckedItems @$el.find 'table'
					data.chapter = chapter
					data.sections = sections

					msg = "Are you sure you want to move selected content pieces?"
					if 0 is _.size data.IDs
						bootbox.alert 'None of the selected items can be moved'
						return

					bootbox.confirm msg, (result)=>
						#if result
							#$(e.target).find '.fa'
							#.addClass 'fa-spin fa-spinner'

						data.action = 'bulk-move-content-pieces'
						$.post AJAXURL, data
						.success (resp)=>
							i = 0
							while i < data.IDs.length
							  $('#checkbox' + data.IDs[i]).closest('tr').remove()
							  i++
							bootbox.alert 'Moved Successfully.'
						.fail (resp)->
							console.log 'some error occurred'
							console.log resp
						.done ->
							$("#destination_textbook").hide()
							$(e.target).find '.fa'
							.removeClass 'fa-spin fa-spinner'
							.addClass 'fa-check'


			show_destination_textbooks:(e)=>
					action = $("#status_dropdown").val()
					if action != 'move'
						@$el.find '#destination_textbook'
						.hide()	
						return false
					textbookFiltersHTML= $.showTextbookFilters  textbooks: @textbooksCollection
					@$el.find '#destination_textbook'
					.html textbookFiltersHTML
					@$el.find '#destination_textbook'
					.show()	
					@$el.find '#destination_textbook #textbooks-filter'
						.hide()					
					@show_destination_chapters()


			show_destination_chapters:(e)=>
					term_id = $("#textbooks-filter option:selected").val()
					chaptersCollection = App.request "get:chapters", ('parent': term_id)
					App.execute "when:fetched", chaptersCollection, =>
						html = "<option>Select</option>"
						chaptersCollection.each (t, ind)=>
							chapter_id = t.get('term_id')
							chapter_name = t.get('name')
							html += "<option value='"+chapter_id+"'>"+chapter_name+"</option>"
						@$el.find '#destination_textbook #chapters-filter'
						.html html	
					

			show_destination_sections:(e)=>
					term_id = $("#destination_textbook #chapters-filter option:selected").val()
					sectionsCollection = App.request "get:chapters", ('parent': term_id)
					App.execute "when:fetched", sectionsCollection, =>
						html = "<option>Select</option>"
						sectionsCollection.each (sectionModel, ind)=>
							section_id = sectionModel.get('term_id')
							section_name = sectionModel.get('name')
							html += "<option value='"+section_id+"'>"+section_name+"</option>"
						@$el.find '#destination_textbook  #sections-filter'
						.html html	

			show_destination_subsections:(e)=>
					term_id = $("#destination_textbook #sections-filter option:selected").val()
					subsectionsCollection = App.request "get:chapters", ('parent': term_id)
					App.execute "when:fetched", subsectionsCollection, =>
						html = "<option>Select</option>"
						subsectionsCollection.each (subsectionModel, ind)=>
							section_id = subsectionModel.get('term_id')
							section_name = subsectionModel.get('name')
							html += "<option value='"+section_id+"'>"+section_name+"</option>"
						@$el.find '#destination_textbook  #subsections-filter'
						.html html					                		          

			changeStatus:(e)=>
				if $(e.target).closest('.change-status').find('select').val() is 'move'
					@moveContent()
					return false
				data = {}
				data.IDs= $.getCheckedItems @$el.find 'table'
				data.status= $(e.target).closest('.change-status').find('select').val()

				msg = "Are you sure you want to #{data.status} the selected content pieces ?"

				if data.status is 'publish'
					data.IDs = _.filter data.IDs, (id)=>return id if @collection.get(id).get('post_status') is 'pending'
					msg += "<div class='small m-t-10'>
								Note: Only content pieces with status 'Under Review' will be changed to publish
							</div>"

					if 0 is _.size data.IDs
						bootbox.alert 'None of the selected items can be published'
						return

				bootbox.confirm msg, (result)=>
					if result
						$(e.target).find '.fa'
						.addClass 'fa-spin fa-spinner'

						data.action = 'update-content-piece-status'
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
