define ['app'], (App)->
	App.module "SingleQuestionMultipleEvaluationApp.EvaluationApp.Views", (Views, App)->
		class EvaluationItemView extends Marionette.ItemView

			className : 'row m-l-0 m-r-0 m-t-10 b-grey b-b'

			template : '<div class="col-sm-4"><h4 class="semi-bold m-t-5 p-b-5">{{parameter}}</h4></div>
													{{#attributesArray}}
													   <div class="col-sm-2"><button id="{{index}}" type="button" class="btn btn-white btn-sm btn-small h-center block">{{attr}}</button></div>
													{{/attributesArray}}'

			mixinTemplateHelpers :(data)->
				data = super data
				attrbutesArray = new Array()
				_.each data.attributes,(attr,index)->
					attrbutesArray.push
						attr : attr
						index : index

				data.attributesArray = attrbutesArray

				data

			events :
				'click button' : '_buttonClicked'

			initialize : (options)->
				@responseObj = options.responseObj
				@display_mode = options.display_mode

			onShow : ->
				if @responseObj[@model.get('id')]?
					@$el.find("button##{@responseObj[@model.get('id')]}").removeClass('btn-white').addClass('btn-primary')

			_buttonClicked : (e)->
				_.audioQueuesSelection 'Click-Select'
				if @display_mode is 'class_mode'
					if $(e.target).closest('button').hasClass('btn-primary')
						@$el.find('button.btn-primary').removeClass('btn-primary').addClass('btn-white')
						delete @responseObj[@model.get('id')]
					else
						@$el.find('button.btn-primary').removeClass('btn-primary').addClass('btn-white')
						$(e.target).closest('button').removeClass('btn-white').addClass('btn-primary')
						@responseObj[@model.get('id')] = $(e.target).attr('id')


		class Views.EvaluationView extends Marionette.CompositeView

			className : 'parameters animated fadeIn'

			template : '<div class="tiles grey p-t-10 p-b-10 m-b-10">
													<div class="row m-l-0 m-r-0">
													   <div class="pull-right">
															<span id="close-parameters" class="fa fa-times text-grey p-r-15 p-l-15 p-t-15
															 p-b-15 closeEval"></span>
														</div>
														<h3 class="text-center text-grey semi-bold">Evaluation for {{studentName}}</h3>
													</div>
													<div id="evaluation-collection">
													</div>
													{{#class_mode}}
													<div class="row m-r-0 m-l-0 p-t-10">
														<button class="btn btn-info h-center block" id="saveEval">Save</button>
													</div>
													{{/class_mode}}
													</div>'

			itemView : EvaluationItemView

			itemViewContainer : '#evaluation-collection'

			itemViewOptions : ->
				responseObj : @responseObj
				display_mode : Marionette.getOption(@, 'display_mode')

			mixinTemplateHelpers : (data)->
				data = super data
				data.class_mode = true if Marionette.getOption(@, 'display_mode') is 'class_mode'
				data.studentName = @studentModel.get 'display_name'
				data

			events :
				'click #saveEval' : '_saveEvalParameters'
				'click #close-parameters' : '_closeEvalParams'

			initialize : (options)->
				@studentModel = Marionette.getOption @, 'studentModel'
				@responseObj = Marionette.getOption @, 'responseObj'

			onShow: ->
				# stickyHeaderTop = @$el.closest('#main-content-region').find("#module-details-region").height()
				# @$el.css "margin-top", "#{stickyHeaderTop}px"

				$('html, body').animate
					scrollTop: @$el.closest('.studentList').find("#eval-parameters").offset().top# - stickyHeaderTop
				, 1000
				@$el.slideDown()

			_saveEvalParameters : ->
				_.audioQueuesSelection 'Click-Save'
				if _.size(@responseObj) > 1
					@trigger "save:eval:parameters"

			_closeEvalParams : ->
				@$el.closest('.studentList').find('.tiles.single').removeClass('light').removeClass 'selected'
				@$el.slideUp(700)




