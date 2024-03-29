define ['app',
		'text!apps/content-creator/options-bar/templates/options-bar.html', 'bootbox'], (App, optionsBarTpl,bootbox)->
	App.module "ContentCreator.OptionsBar.Views", (Views, App)->

		class Views.OptionsBarView extends Marionette.ItemView

			template: optionsBarTpl

			events:
				'change #subs' : (e)-> 
					# console.log 'change #subs'
					# if localStorage.textbook_id != $(e.target).val()
					# 	console.log 'if'
					# 	localStorage.textbook_id = $(e.target).val()
					@trigger "fetch:chapters", $(e.target).val()
					# else
					# 	localStorage.textbook_id = ''
						

				'change #chaps' : (e)->
					# console.log 'change #chaps'
					# if localStorage.chapter_id != $(e.target).val()
					# 	console.log 'change #chaps if'
					# 	localStorage.chapter_id = $(e.target).val()
					@trigger "fetch:sections", $(e.target).val()
					# else
					# 	localStorage.chapter_id = ''

				'change #secs' : (e)->
					@trigger "fetch:subsections", $(e.target).val()

				'change #qType'           : '_changeOfQuestionType'

				'click #save-question'    : 'onSaveQuestionSettings'

				'click #preview-question' : 'previewQuestion'

				'click #close-content-creator' :->
					bootbox.confirm 'Are you sure you want to close the content creator? Caution: Unsaved content will be lost.', (result)->
						App.navigate '',true if result

				'click #clone-question':->
					cpModel = App.request "new:content:piece"
					cpModel.set @model.toJSON()
					cpModel.duplicate()

				'click a.tabs' : '_changeTabs'

				'change #hint_enable': '_hintEnable'

				'change #comment_enable' : '_commentEnable'

				'blur .comment-area' : '_saveComment' 

				#'click a.cke_button__image' : 'imageClicked'

			modelEvents:
				'change:ID' :-> @$el.find('#preview-question, #clone-question').show()

			mixinTemplateHelpers : (data)->
				data = super data
				data.isStudentQuestion = if @model.get('content_type') is 'student_question' then true else false
				data.isTeacherQuestion = if @model.get('content_type') is 'teacher_question' then true else false
				data.isContentPiece = if @model.get('content_type') is 'content_piece' then true else false
				data.instructionsLabel = if @model.get('content_type') is 'content_piece' then 'Procedure Summary' else 'Instructions'

				data



			onShow:->
				ele = @$el.find ".instructions"
				@$el.find '#subs'
				.trigger 'change'

				$(ele).css 'height' : $(ele).prop('scrollHeight') + "px";

				Backbone.Syphon.deserialize @,@model.toJSON()

				@$el.find "#subs, #chaps, #qType, #status, #secs, #subsecs, #difficulty_level "#,#negativeMarks"
				.select2();

				@$el.find('input.tagsinput').tagsinput()

				if @model.get 'hint_enable'
					@$el.find('#hint_enable').trigger 'click'

				if @model.get 'comment_enable'
					@$el.find('#comment_enable').trigger 'click'


				if @model.get('content_type') isnt 'teacher_question'
					@$el.find '#question_type_column'
					.remove()

				@$el.find('#preview-question, #clone-question').show() if not @model.isNew()


				CKEDITOR.on 'instanceCreated', @configureEdit
				

			_saveComment:->
				console.log '_saveComment'
				#console.log @$el.html()

			_changeTabs : (e)->
				e.preventDefault()
				$(e.target).tab('show')

			_hintEnable : (e)=>
				if $(e.target).prop 'checked'
					@$el.find('#question-hint').prop 'disabled',false
					@$el.find('#question-hint').show()
				else
					@$el.find('#question-hint').prop 'disabled',true
					@$el.find('#question-hint').hide()

			_commentEnable : (e)=>
				if $(e.target).prop 'checked'
					@$el.find('#question-comment').prop 'disabled',false
					@$el.find('#question-comment').show()
					ele = @$el.find "#question-comment"
					$('.comment-rte div:nth-of-type(2)').show()
					# console.log 'ele'
					# CKEDITOR.disableAutoInline = true;
					#CKEDITOR.inline('comment')
					CKEDITOR.dtd.$removeEmpty['span'] = false;
					ele.attr('commenteditable', 'true').attr 'id', _.uniqueId 'text-'
					CKEDITOR.on 'instanceCreated', @configureEdit
					@editor = CKEDITOR.inline document.getElementById ele.attr 'id'

					#CKEDITOR.on 'dialogDefinition', @imageInstanceChange
						
				else
					#@$el.find('#question-comment').prop 'disabled',true
					@$el.find('#question-comment').hide()
					ele = @$el.find "#question-comment"
					$('.comment-rte div:nth-of-type(2)').hide()


			imageInstanceChange:(ev)->
				#@trigger "show:media:manager"
				#Backbone.trigger "show:media:manager"
				console.log ev
				dialogName = ev.data.name
				dialogDefinition = ev.data.definition
				console.log dialogDefinition
				editor = ev.editor
				#Backbone.trigger "show:media:manager"
				if dialogName == 'image'
					console.log 'image'
					#ev.stopPropagation()
					#dialogDefinition.hide()

					#dialogDefinition.onShow = (e) ->
						#Backbone.trigger "show:media:manager"
				    	# imageSrcUrl = e.sender.originalElement.$.src
				    	# imgHtml = CKEDITOR.dom.element.createFromHtml('<img src=' + imageSrcUrl + ' alt=\'\' align=\'right\'/>')
				    	# editor.insertElement imgHtml

			configureEdit : (event) =>
				ele = @$el.find "#question-comment"
				editor = event.editor
				#element = editor.element

				#if element.getAttribute('id') is ele.attr 'id'
				editor.on 'configLoaded', ->
                	editor.config.placeholder = 'This is a Text Block. Use this to provide text…'

			onFetchChaptersComplete : (chapters)->

				@$el.find '#chaps, #secs, #subsecs'
				.select2 'data', null

				@$el.find '#chaps, #secs, #subsecs'
				.html ''

				chapterElement= @$el.find '#chaps'
				termIDs= @model.get 'term_ids'
				currentChapter= if termIDs then termIDs['chapter'] else ''

				$.populateChaptersOrSections(chapters,chapterElement, currentChapter);
				@$el.find '#chaps'
				.trigger 'change'

			onFetchSectionsComplete : (sections)->

				@$el.find '#secs, #subsecs'
				.select2 'data', null

				@$el.find '#secs, #subsecs'
				.html ''

				term_ids= @model.get 'term_ids'

				sectionIDs = term_ids['sections'] if term_ids?

				sectionsElement     = @$el.find '#secs'

				$.populateChaptersOrSections(sections,sectionsElement, sectionIDs);
				@$el.find '#secs'
				.trigger 'change'

			onFetchSubsectionsComplete : (subsections)->

				@$el.find '#subsecs'
				.select2 'data', null

				@$el.find '#subsecs'
				.html ''

				term_ids= @model.get 'term_ids'

				subSectionIDs = term_ids['subsections'] if term_ids?

				subsectionsElemnet  = @$el.find '#subsecs'
				$.populateChaptersOrSections(subsections,subsectionsElemnet, subSectionIDs);

			_changeOfQuestionType : (e)->
				if $(e.target).val() is 'multiple_eval'
					@trigger 'show:grading:parameter'
				else
					@trigger 'close:grading:parameter'

			onSaveQuestionSettings: (e)->
				ele = @$el.find "#question-comment"
				if $('#comment_enable').prop('checked')
					comment_data = $('.comment-rte div:nth-of-type(2)').html()
				if @$el.find('form').valid()
					data = Backbone.Syphon.serialize (@)
					if $('#comment_enable').prop('checked')
						data.comment = comment_data
					@trigger "save:data:to:model", data
				else
					firstErr = _.first @$el.find '.form-control.error'
					$(firstErr).focus()
					if _.str.contains firstErr.id, 's2id'
						eleID = _.str.strRight firstErr.id,'_'
						@$el.find "##{eleID}"
						.data('select2').open()

			previewQuestion:->
				if @model.get('content_type') is 'student_question'
					window.open SITEURL + "/#dummy-quiz/"+@model.id, 'target':'blank'
				else
					window.open SITEURL + "/#dummy-module/"+@model.id, 'target':'blank'
