define ['app'
        'controllers/region-controller'
],(App,RegionController)->
	App.module 'ContentSelectionApp.AddQuiz',(AddQuiz,App)->

		class AddQuiz.Controller extends RegionController
			initialize : (options)->
				{@contentGroupCollection,@selectedFilterParamsObject, model} = options
				termIds = model.get 'term_ids'
				quizCollection = App.request "get:quizes", 'textbook' : @_getTextbookIDParam termIds
				textbookNames = App.request "get:textbook:names:by:ids", _.compact _.flatten termIds
				App.execute "when:fetched", [textbookNames,quizCollection], => @_showView textbookNames, quizCollection
			
			_getTextbookIDParam:(termIds)->
				textbookid = termIds.textbook
				textbookid = termIds.chapter if termIds.chapter
				textbookid = _.last(termIds.sections) if not _.isEmpty _.compact termIds.sections
				textbookid = _.last(termIds.subsections) if not _.isEmpty _.compact termIds.subsections
				textbookid
				
			_showView:(textbookNames, quizCollection)=>
				@view = @_getView quizCollection, textbookNames

				@show @view

				@listenTo @view, 'add:quizzes', (quizIds)=>
					_.each quizIds, (qid)=> 
						@contentGroupCollection.add quizCollection.get qid
						quizCollection.remove qid

			_getView :(quizCollection,textbookNames)->
				new QuizView
					collection : quizCollection,
					textbookNames:textbookNames

		class QuizIView extends Marionette.ItemView
			template: '<td class="v-align-middle"><div class="checkbox check-default">
							<input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}">
							<label for="checkbox{{id}}"></label>
						  </div>
						</td>
						<td>{{name}}</td>
						<td>{{quiz_type}}</td>
						<td>{{textbookName}}</td>
						<td>{{chapterName}}</td>
						<td>{{duration}} mins</td>
						<td>{{marks}}</td>
						<td>{{modified_date}}</td>'
			tagName: 'tr'
			
			mixinTemplateHelpers:(data)->
				textbookNames= Marionette.getOption @, 'textbookNames'
				data.textbookName = textbookNames.findWhere('id' : data.term_ids.textbook).get 'name'
				data.chapterName = textbookNames.findWhere('id' : data.term_ids.chapter).get 'name'
				data.quiz_type = @model.getQuizTypeLabel()
				data.modified_date= moment(data.last_modified_on).format("Do MMM YYYY")
				data

		class EmptyView extends Marionette.ItemView

			template: 'No Content Available'

			tagName: 'td'

			onShow:->
				@$el.attr 'colspan',8

		class QuizView extends Marionette.CompositeView
			template : ' <div class="row">
									<div class="col-md-12">
										<table class="table table-bordered">
											<thead class="cf">
											<tr>
												<th><div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;">
													<input id="check_all" type="checkbox">
													<label for="check_all"></label>
												</div></th>
												<th>Name</th>
												<th>Type</th>
												<th>Textbook</th>
												<th>Chapter</th>
												<th>Duration</th>
												<th>Marks</th>
												<th>Last Modified</th>
											</tr>
											</thead>
											<tbody></tbody>
										</table><div id="pager" class="pager">
											<i class="cursor fa fa-chevron-left prev"></i>
											<span style="padding:0 15px"  class="pagedisplay"></span>
											<i class="cursor fa fa-chevron-right next"></i>
											<select class="pagesize">
												<option selected value="10">10</option>
												<option value="25">25</option>
												<option value="50">50</option>
												<option value="100">100</option>
											</select>
										</div>
											<button type="button" class="btn btn-success btn-cons2" id="add-quiz-button"><i class="fa fa-plus"></i> Add</button>
									</div>
								</div>'

			itemView : QuizIView

			emptyView : EmptyView

			itemViewContainer : 'table tbody'
			
			itemViewOptions:->
				textbookNames: Marionette.getOption @, 'textbookNames'

			className : 'row'
			
			events:->
				'change #check_all_div'     : 'checkAll'
				'click #add-quiz-button'	: 'addQuiz'
				
			onShow:->
				@$el.find "table"
				.tablesorter()

				pagerOptions =
					container : @$el.find ".pager"
					output : '{startRow} to {endRow} of {totalRows}'

				@$el.find "table"
				.tablesorterPager pagerOptions
				
			checkAll: ->
				if @$el.find '#check_all'
				.is ':checked'
					@$el.find 'table .tab_checkbox'
					.trigger 'click'
						.prop 'checked', true

				else
					@$el.find 'table .tab_checkbox'
					.removeAttr 'checked'
					
			addQuiz: =>
				quizIds = _.pluck(@$el.find('table .tab_checkbox:checked'), 'value')
				console.log quizIds
				if quizIds
					@trigger "add:quizzes", quizIds
					#@fullCollection.remove(id) for id in content_pieces

					@onUpdatePager()

			onQuizRemoved: (model)=>
				@fullCollection.add model
				@onUpdatePager()

			onUpdatePager:->

				@$el.find "table"
				.trigger "updateCache"
				pagerOptions =
					container : @$el.find ".pager"
					output : '{startRow} to {endRow} of {totalRows}'

				@$el.find "table"
				.tablesorterPager pagerOptions

		App.commands.setHandler 'show:add:quiz:app',(opt ={})->
			new AddQuiz.Controller opt