define ['app'
        'controllers/region-controller'
        'text!apps/edit-module/content-display/templates/content-display.html'], (App, RegionController, contentDisplayItemTpl)->
	App.module "CollectionContentDisplayApp.Controller", (Controller, App)->
		class Controller.CollectionEditContentDisplayController extends RegionController

			initialize : (opts)->
				{@model,@contentGroupCollection} = opts

				@view = view = @_getCollectionContentDisplayView()

				@listenTo @contentGroupCollection, 'remove', @contentPiecesChanged

	#                @listenTo @contentGroupCollection, 'content:pieces:of:group:removed', @contentPiecesChanged

				@listenTo view, 'changed:order', @contentOrderChanged

				@listenTo Backbone, 'save:all:content:pieces' , @contentPiecesChanged

				@listenTo @view, 'remove:model:from:quiz', @removeModelFromQuiz

				if @contentGroupCollection.length > 0
					App.execute "when:fetched", @contentGroupCollection.models, =>
						@show view, (loading : true)
				else
					@show view, (loading : true)

			contentPiecesChanged : =>
				if @model.get('type') is 'quiz'
					content = @contentGroupCollection.map (quizContent)->
						if quizContent.get('post_type') is 'content-piece'
							return { type : 'content-piece'
							id : quizContent.get('ID') }
						else
							return { type : 'content_set'
							data : quizContent.toJSON() }

				else if @model.get('type') is 'student-training'
					content = @contentGroupCollection.map (item)->
						if item.get('post_type') is 'content-piece'
							return { type : 'content-piece'
							id : item.id }
						else
							return { type : 'quiz'
							id : item.id }
				else
					content = @contentGroupCollection.pluck 'ID'

				@saveContentPieces content

			contentOrderChanged:(ids)=>
				if @model.get('type') is 'quiz'
					content = new Array()
					_.each ids,(id)=>
						if _.str.include(id,'set')
							setModel = @contentGroupCollection.findWhere 'id' : id
							content.push
								type : 'content_set'
								data : setModel.toJSON()
						else
							content.push
								type : 'content-piece'
								id : parseInt id
				else
					content = ids

				@saveContentPieces content

			saveContentPieces : (content)=>
				Backbone.trigger "all:content:saved:remove:message"
				@model.set('content_pieces', content) if @model.get('type') is 'teaching-module'
				@model.set('content_layout', content) if @model.get('type') in ['quiz','student-training']
				@model.set('content_pieces_length', content.length) if @model.get('type') is 'quiz'
				#console.log JSON.stringify @model.attributes
				model_data = @model.save({ 'changed' : 'content_pieces' })

				if !model_data
					console.log 'error'
					localStorage.addContent = 'false'
				else
					model_data.complete (response) ->
						if response.responseJSON
							Backbone.trigger "all:content:piece:saved:success"
							if localStorage.addContent == 'true'
								Backbone.trigger "all:content:saved:success:message"
							localStorage.addContent = 'false'
						else
							if localStorage.addContent == 'true'
								Backbone.trigger "all:content:saved:error:message"
							localStorage.addContent = 'false'
				
							
			_getCollectionContentDisplayView : ->
				new ContentDisplayView
					model : @model
					collection : @contentGroupCollection

			removeModelFromQuiz : (id)->
				if _.str.include(id,'set')
					setModel = @contentGroupCollection.findWhere 'id' : id
					@contentGroupCollection.remove setModel
				else
					@contentGroupCollection.remove parseInt id


		class ContentItemView extends Marionette.ItemView

			template : contentDisplayItemTpl

			tagName : 'li'

			className : 'sortable'

			mixinTemplateHelpers : (data)->
				data = super data
				data.isContentPiece = true if data.post_type is 'content-piece'
				if data.post_type is 'content_set'
					data.isSet = true
					data.contentLevels = new Array()
					for i in [ 1..3 ]
						lvl = parseInt data["lvl#{i}"]
						while lvl > 0
							data.contentLevels.push "Level #{i}"
							lvl--

				if @groupType is 'student-training' and data.quiz_type
					data.isStudentTrainingQuiz = true

				data.isQuiz = true if @groupType is 'quiz'
				data.isModule = true if @groupType is 'teaching-module'

				if @groupType is 'quiz' and data.post_type is  'content-piece'
					data.marks = @model.get 'marks' 

				data

			initialize :->
				@groupType = Marionette.getOption @, 'groupType'

			onShow : ->
				if @model.get('post_type')is 'content_set'
					@$el.attr 'id', @model.get 'id'
				else
					@$el.attr 'id', @model.get 'ID'


		class ContentDisplayView extends Marionette.CompositeView

			template : '<ul class="cbp_tmtimeline"></ul>'

			itemView : ContentItemView

			itemViewContainer : 'ul.cbp_tmtimeline'

			className : 'col-md-10'

			id : 'myCanvas-miki'

			itemViewOptions :->
				groupType : @model.get 'type'

			events :
				'click .remove' : 'removeItem'

			modelEvents :
				'change:post_status' : 'statusChanged'

			statusChanged : (model, post_status)->
				if post_status in ['publish', 'archive']
					@$el.find('.remove').hide()
					@$el.find(".cbp_tmtimeline").sortable('disable')
				else
					@$el.find('.remove').show()


			onShow : ->

				@$el.find(".cbp_tmtimeline").sortable

					stop : (event, ui)=>
						sorted_order = @$el.find(".cbp_tmtimeline")
						.sortable "toArray"
						console.log sorted_order
						@trigger "changed:order", sorted_order

				@statusChanged @model, @model.get('post_status')


			removeItem : (e)=>
				id = $(e.target)
				.closest '.contentPiece'
					.attr 'data-id'

				@trigger 'remove:model:from:quiz',id


		# set handlers
		App.commands.setHandler "show:editgroup:content:displayapp", (opt = {})->
			new Controller.CollectionEditContentDisplayController opt

