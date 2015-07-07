define ['app'
		'controllers/region-controller'
		'apps/content-creator/element-box/elementboxapp'
		'apps/content-creator/content-builder/app'
		'apps/content-creator/property-dock/controller'
		'apps/content-creator/options-bar/options-bar-app'
		'apps/content-creator/content-pieces-listing/app'
		'apps/content-creator/grading-parameter/grading-parameter-controller'
], (App, RegionController)->
	App.module "ContentCreator.Controller", (Controller, App)->
		class Controller.ContentCreatorController extends RegionController

			initialize : (options)->
				{@contentType, contentID}= options

				if contentID
					@contentPieceModel = App.request "get:page:json", contentID
				else
					@contentPieceModel = App.request "get:page:json"

				App.execute "when:fetched", @contentPieceModel, =>
					if not @contentPieceModel.get 'ID'
						@contentPieceModel.set 'content_type' : @contentType

				breadcrumb_items =
					'items' : [
						{ 'label' : 'Dashboard', 'link' : 'javascript://' },
						{ 'label' : 'Content Management', 'link' : 'javascript:;' },
						{ 'label' : 'Content Creator', 'link' : 'javascript:;', 'active' : 'active' }
					]

				App.execute "update:breadcrumb:model", breadcrumb_items

				# get the main layout for the content creator
				@layout = @_getContentCreatorLayout()

				@eventObj = App.createEventObject()

				# listen to "show" event of the layout and start the
				# elementboxapp passing the region
				@listenTo @layout, 'show', =>

					if not @contentPieceModel.isNew()
						App.execute "show:content:creator:pieces:listing",
							region : @layout.contentPiecesListRegion
							contentPieceModel : @contentPieceModel

					@_showViews()

				@listenTo @layout.optionsBarRegion , 'show:grading:parameter',@_showGradingParameter

				@listenTo @layout.optionsBarRegion, 'close:grading:parameter', @_closeGradingParameter

				@listenTo @layout.contentPiecesListRegion, 'change:content:piece', (model)=>
					App.navigate "edit-content/#{model.id}"
					@contentPieceModel = model
					@_showViews()

				# show the layout
				App.execute "when:fetched", @contentPieceModel, =>
					present_in = @contentPieceModel.get 'present_in_modules'
					if not _.isEmpty present_in
						view = new CannotEditView model: @contentPieceModel
						@show view
					else
						@show @layout, loading : true

			_getContentCreatorLayout : ->
				new ContentCreatorLayout model : @contentPieceModel

			_showGradingParameter : ->

				$(@layout.contentBuilderRegion.el).find('#myCanvas').hide()

				App.execute 'show:grading:parameter:view',
					region : @layout.gradingParameterRegion
					contentPieceModel : @contentPieceModel

			_closeGradingParameter :->

				$(@layout.contentBuilderRegion.el).find('#myCanvas').show()

				@layout.gradingParameterRegion.reset()

			_showViews:->
				App.execute "show:options:bar",
					region : @layout.optionsBarRegion
					contentType : @contentType
					contentPieceModel : @contentPieceModel

				App.execute "show:element:box",
					region : @layout.elementBoxRegion
					contentType : @contentPieceModel.get 'content_type'
					eventObj : @eventObj

				App.execute "show:content:builder",
					region : @layout.contentBuilderRegion
					contentPieceModel : @contentPieceModel
					eventObj : @eventObj

				# if @contentPieceModel.get('content_type') is 'student_question'
				App.execute "show:property:dock",
					region : @layout.PropertyRegion
					contentPieceModel : @contentPieceModel

				if @contentPieceModel.get('question_type')? and
				@contentPieceModel.get('question_type') is 'multiple_eval'
					@_showGradingParameter()

		class ContentCreatorLayout extends Marionette.Layout

			className : 'content-creator-layout'

			template : '<div id="content-pieces-list-region"></div>
						<div id="options-bar-region"></div>
						<input type="hidden"
							name = "cp_not_saved"
							value= false
							data-description="content piece modified but not saved" />
						<div class="page-title">
							<h3>Add <span class="semi-bold">Question</span></h3>
						</div>
						<div class="creator">
							<div class="tiles" id="toolbox"></div>
							<div class="" id="content-builder"></div>
							<div id="grading-parameter"></div>
							<div id="property-dock"></div>
						</div>'

			regions :
				elementBoxRegion : '#toolbox'
				contentBuilderRegion : '#content-builder'
				PropertyRegion : '#property-dock'
				optionsBarRegion : '#options-bar-region'
				gradingParameterRegion : '#grading-parameter'
				contentPiecesListRegion: '#content-pieces-list-region'


		class CannotEditView extends Marionette.ItemView

			template : '<div class="tiles white grid simple vertical green animated slideInRight">
							<div class="grid-title no-border">
								Cannot Edit This Content Piece
							</div>
							<div style="overflow: hidden; display: block;" class="grid-body no-border">
								<div class="row ">
								  <div class="col-md-8">
										<h4>This content piece cannot be edited as it is used in the following modules:</h4>
										<ul class="list-group">
											 {{#moduleItems}}
												<li class="list-group-item"><a href="{{url}}">{{name}}</a></li>
											{{/moduleItems}}
										</ul>
										<h4>You can clone it to create another content piece.</h4>
										<a class="btn btn-info" href="{{urlBase}}/{{ID}}">View Content Piece</a>
										<a class="btn btn-info clone_item">Clone Content Piece</a>
									</div>
								</div>
							</div>
					  </div>'

			mixinTemplateHelpers:(data)->
				data.moduleItems =_.map data.present_in_modules, (module)->
										moduleBaseurl = switch module.type
															when 'quiz'				then 'view-quiz'
															when 'teaching-module'	then 'view-group'
															when 'student-training' then 'view-student-training-module'
										m = module
										m.url = "#{SITEURL}/##{moduleBaseurl}/#{module.id}"
										m

				data.urlBase = SITEURL + '/#dummy-'
				data.urlBase += if data.content_type is 'student_question' then 'quiz' else 'module'
				console.log data
				data

			events:->
				'click .clone_item' : 'cloneItem'

			cloneItem:->
				@cloneModel = App.request "new:content:piece"
				contentPieceData = @model.toJSON()

				@clonedData = _.omit contentPieceData,
							  ['ID', 'guid', 'last_modified_by', 'post_author',
							   'post_author_name', 'post_date', 'post_date_gmt', 'published_by']

				@clonedData.post_status = "pending"
				@clonedData.clone_id =@model.id

				App.execute "when:fetched", @cloneModel, =>
					@cloneModel.save @clonedData,
						wait : true
						success :(model)->
							App.navigate "edit-content/#{model.id}", true
						error :(resp)->
							console.log resp
