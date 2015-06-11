define ['app'
        'controllers/region-controller'
        'text!apps/edit-module/content-selection/templates/content-selection.html'
], (App, RegionController, contentSelectionTpl)->
	App.module "ContentSelectionApp.AllContent", (AllContent, App, Backbone, Marionette, $, _)->
		class AllContent.Controller extends RegionController
			initialize: (opts) ->

				{@contentPiecesCollection,@contentGroupCollection,@groupType}=opts

				@view = view = @_getContentSelectionView @contentPiecesCollection

				@show @view,
					loading: true

				@listenTo @region, "update:pager",=>
					@view.triggerMethod "update:pager"

				@listenTo @view, "add:content:pieces", (contentIDs) =>

					_.each contentIDs, (ele, index)=>
						@contentGroupCollection.add @contentPiecesCollection.get ele
						@contentPiecesCollection.remove ele

				@listenTo @contentGroupCollection, 'remove', @contentPieceRemoved



	#                @listenTo @region, "new:search:collection", (collection)=>
	#                    @contentPiecesCollection.reset collection.models

			contentPieceRemoved: (model)=>
				if model.get('post_type') is 'content-piece'
					@contentPiecesCollection.add model
					@view.triggerMethod "content:piece:removed", model

			_getContentSelectionView: (collection)=>
				new DataContentTableView
					collection: collection
					fullCollection : collection.clone()
					groupType : @groupType


		class DataContentItemView extends Marionette.ItemView

			template: '<td class="v-align-middle"><div class="checkbox check-default">
										<input class="tab_checkbox" type="checkbox" value="{{ID}}" id="checkbox{{ID}}">
										<label for="checkbox{{ID}}"></label>
									  </div>
									</td>
									<td class="cpHeight">{{&post_excerpt}}</td>
									{{#isModule}}
									<td>{{content_type_str}}</td>
									{{/isModule}}
									{{#isQuiz}}
									<td>{{difficulty_level}}</td>
									<td>{{marks}}</td>
									<td>{{duration}} mins</td>
									{{/isQuiz}}
									<td class="cpHeight">
										{{&present_in_str}}
									 </td>
									<td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td>'

			tagName: 'tr'

			serializeData:->
				data= super()
				data.isQuiz = true if @groupType is 'quiz'
				data.isModule = true if @groupType in ['teaching-module','student-training']
				data.isStudentTraining = true if @groupType is 'student-training'

				#this is for display purpose only
				data.modified_date= moment(data.post_modified).format("Do MMM YYYY")

				#for sorting the column date-wise
				data.sort_date= moment(data.post_modified).format "YYYYMMDD"

				data.content_type_str=
					_ data.content_type
					.chain()
					.humanize()
					.titleize()
					.value()

				modules=[]
				_.each data.present_in_modules, (ele,index)->
					link = if data.content_type is 'student_question' then 'view-quiz' else 'view-group'
					modules.push "<a target='_blank' href='##{link}/#{ele.id}'>"+ ele.name+"</a>"

				type = if data.content_type is 'student_question' then 'quiz' else 'teaching-module'

				data.marks = @model.get('marks') if data.content_type is 'student_question'

				data.present_in_str=
					if _.size(modules)>0
					then _.toSentence(modules)
					else "Not added to a #{type} yet"

				data

			initialize : ->
				@groupType = Marionette.getOption @, 'groupType'

		class NoDataItemView extends Marionette.ItemView

			template: 'No Content Available'

			tagName: 'td'

			onShow:->
				@$el.attr 'colspan',5

		class DataContentTableView extends Marionette.CompositeView

			template: contentSelectionTpl

			emptyView: NoDataItemView

			itemView: DataContentItemView

			itemViewContainer: '#dataContentTable tbody'

			itemViewOptions :->
				groupType : Marionette.getOption @, 'groupType'

			events:

				'change #check_all_div'     : 'checkAll'

				'click #add-content-pieces' : 'addContentPieces'

			mixinTemplateHelpers : (data)->
				data = super data 
				data.isQuiz = true if @groupType is 'quiz'
				data.isModule = true if @groupType in ['teaching-module', 'student-training']

				data

			initialize: ->
				@groupType = Marionette.getOption @,'groupType'

			onShow:->
				@$el.find '#dataContentTable'
				.tablesorter();

				@fullCollection= Marionette.getOption @, 'fullCollection'


			checkAll: ->
				if @$el.find '#check_all'
				.is ':checked'
					@$el.find '#dataContentTable .tab_checkbox'
					.trigger 'click'
						.prop 'checked', true

				else
					@$el.find '#dataContentTable .tab_checkbox'
					.removeAttr 'checked'

			addContentPieces: =>
				content_pieces = _.pluck(@$el.find('#dataContentTable .tab_checkbox:checked'), 'value')
				if content_pieces
					@trigger "add:content:pieces", content_pieces
					@fullCollection.remove(id) for id in content_pieces

				@onUpdatePager()

			onContentPieceRemoved: (model)=>
				@fullCollection.add model
				@onUpdatePager()

			onUpdatePager:->

				@$el.find "#dataContentTable"
				.trigger "updateCache"
				pagerOptions =
					container : @$el.find ".pager"
					output : '{startRow} to {endRow} of {totalRows}'

				@$el.find "#dataContentTable"
				.tablesorterPager pagerOptions



		# set handlers
		App.commands.setHandler "show:all:content:selection:app", (opt = {})->
			new AllContent.Controller opt