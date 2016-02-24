define ['app'], (App)->
	App.module "ContentCreator.ContentPieces.Views", (Views, App)->

		class ContentPiecesIV extends Marionette.ItemView

			template: '{{&excerpt}}<br>
						<label class="form-label list-group-item-text">
							{{textbookName}} | {{chapterName}} | {{contentType}}
						</label>
						<label>Last Modified: {{date_modified}}</label>'

			className: 'col-md-2 list-group-item browse-content-pieces-item'
			tagName: 'a'

			modelEvents:->
				'change:isActive':->
					@$el.closest('div').find('a').removeClass 'active'
					@$el.addClass 'active'

			events:->
				'click' :-> @trigger "change:content:piece", @model

			onShow:->
				@$el.addClass 'active' if Marionette.getOption @, 'isCurrentItem'

			mixinTemplateHelpers:(data)->
				data.excerpt = _.prune data.post_excerpt, 50
				data.contentType = _.str.titleize _.str.humanize data.content_type
				data.date_modified= moment(data.post_modified).format("Do MMM YYYY h:mm a")
				data

		class Views.ContentPieces extends Marionette.CompositeView

			template: '<div class="col-md-12">
						<div class="browse-thru none">
							<div class="row">

								<h4>Navigate between editable content pieces:
									<span class="m-l-10" id="textbookNames">{{&textbookNames}}</span>
								</h4>

								<div class="list-group" id="list-content-pieces">
								</div>
							</div>
							<div class="row">
								<div class"col-md-10">
									<a class="pull-left btn btn-default browse-prev"><i class="fa fa-backward"></i> Browse Previous</a>
									<a class="pull-right btn btn-default browse-next"><i class="fa fa-forward"></i> Browse Next</a>
								</div>
							</div>
						</div>
						<div class="row m-t-20">
							<div class="col-md-8">
								{{#isTeacherQuestion}}
								<h3 class="m-t-0">Create a <span class="semi-bold">Teacher</span> Question<br>
								<small>Create questions for training module to be taken during the class</small></h3>
								{{/isTeacherQuestion}}

								{{#isContentPiece}}
								<h3 class="m-t-0">Create <span class="semi-bold">Content</span><br>
								<small>Create content for training modules. This will not have any student interaction like teacher question</small></h3>
								{{/isContentPiece}}

								{{#isStudentQuestion}}
								<h3 class="m-t-0">Create a <span class="semi-bold">Student</span> Question<br>
								<small>Create questions for quizzes to be taken by the students</small></h3>
								{{/isStudentQuestion}}
							</div>
							<div class="pull-right md-col-4">
								<a class="btn btn-default previous-item"><i class="fa fa-backward"></i> Previous Question</a>
								<a class="btn btn-default next-item"><i class="fa fa-forward"></i> Next Question</a>
								<a class="btn btn-default browse-all">Browse</a>
							</div>
						</div>
					</div>'

			className: 'row m-b-20'
			itemView : ContentPiecesIV
			itemViewContainer : '#list-content-pieces'

			events:->
				'click .browse-next' 	:->@trigger "browse:more", "next"
				'click .browse-prev' 	:->@trigger "browse:more", "prev"
				'click .previous-item'	:->@trigger "change:content:piece", "prev"
				'click .next-item'		:->@trigger "change:content:piece", "next"
				'click .browse-all'		:->@$el.find('.browse-thru').toggle()


			collectionEvents:->
				'reset':->
					textbookNames = _.unique @collection.pluck 'textbookName'
					chapterNames = _.unique @collection.pluck 'chapterName'
					@$el.find '#textbookNames'
					.html "Textbook: <b>#{textbookNames}</b> | Chapter: <b>#{chapterNames}</b>"


			itemViewOptions : (model,index)->
				data={}
				data.isCurrentItem = true if @model.id is model.id
				data

			mixinTemplateHelpers:(data)->
				data = super data
				data.isStudentQuestion = if @model.get('content_type') is 'student_question' then true else false
				data.isTeacherQuestion = if @model.get('content_type') is 'teacher_question' then true else false
				data.isContentPiece = if @model.get('content_type') is 'content_piece' then true else false

				textbookNames = _.unique @collection.pluck 'textbookName'
				chapterNames = _.unique @collection.pluck 'chapterName'
				data.textbookNames =
					"Textbook: <b>#{textbookNames}</b> |
					Chapter: <b>#{chapterNames}</b>"
				data

