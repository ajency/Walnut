define ['app'
		'text!apps/students-dashboard/textbooks/templates/textbooks-list.html'
		'text!apps/students-dashboard/textbooks/templates/list-item.html'
		],(App,textbooksListTpl, listitemTpl)->

	App.module "TeachersDashboardApp.View.TakeClass",(TakeClass, App)->		


		class TextbooksItemView extends Marionette.ItemView

			tagName : 'li'
			className: 'txtbook mix mix_all'
			template : listitemTpl

			onShow:->
				@$el.attr 'data-name', @model.get 'name'

				@$el.attr 'data-modules', @model.get 'modules_count'

				@$el.attr 'data-subjects', @model.get 'subjects'



			serializeData : ->
				data = super()

				route= App.getCurrentRoute()

				data.url= '#'+route+'/textbook/'+ @model.get 'term_id'

				mode = Marionette.getOption @, 'mode'

				if mode is 'take-quiz' 
					data.take_quiz = true


				data

		class EmptyView extends Marionette.ItemView
			
			template:	'<div class="fail_element anim250">Sorry &mdash; we could not find any Textbooks matching matching these criteria</div>'


		class TakeClass.TextbooksListView extends Marionette.CompositeView

			template 	: textbooksListTpl

			itemView 	: TextbooksItemView

			emptyView  	: EmptyView

			itemViewContainer : 'ul.textbooks_list'

			events :
				'click #tableEntry' : '_chkQuizQuestionResponse'

			itemViewOptions:->
				data = mode: Marionette.getOption @,'mode'


			serializeData:->
				data=super()

				mode = Marionette.getOption @,'mode'

				data.take_quiz = true if mode is 'take-quiz' 

				data

			# _chkQuizQuestionResponse :->

			# 	runQuery = ->
			# 		$.Deferred (d)->
						
			# 			_.db.transaction (tx)->
			# 				tx.executeSql("SELECT COUNT(distinct(qr.collection_id)) AS completed_quiz_count 
			# 				FROM "+_.getTblPrefix()+"quiz_response_summary qr,
			# 				wp_content_collection cc
			# 				, wp_collection_meta m WHERE 
			# 				qr.collection_id = cc.id 
			# 				AND qr.student_id = ? 
			# 				AND cc.post_status in ('publish','archive') 
			# 				AND qr.quiz_meta LIKE '%completed%' 
			# 				AND cc.term_ids LIKE '%3%' 
			# 				AND m.meta_value=? "
			# 				, [_.getUserID(), 'test']
			# 				, onSuccess(d), _.deferredErrorHandler(d))

			# 	onSuccess =(d)->
			# 		(tx,data)->
			# 			console.log data.rows.length
			# 			for i in [0..data.rows.length-1] by 1
						
			# 				result = data.rows.item(i)
			# 				console.log JSON.stringify result

			# 			d.resolve(result)

			# 	$.when(runQuery()).done ->
			# 		console.log 'chkQuizQuestionResponse transaction completed'
			# 	.fail _.failureHandler


			onShow:->

				if  Marionette.getOption(@,'mode') is 'take-quiz'
					@$el.addClass 'myClass'

				else 
					@$el.addClass 'takeClass'

				@$el.find('#textbooks').mixitup
					layoutMode: 'list', # Start in list mode (display: block) by default
					listClass: 'list', # Container class for when in list mode
					gridClass: 'grid', # Container class for when in grid mode
					effects: ['fade','blur'], # List of effects
					listEffects: ['fade','rotateX'] # List of effects ONLY for list mode

				@dimensions = 
					status: 'all'

				$("li.txtbook").click ->
				  window.location = $(this).find("a").attr("href")
				  false

				if _.platform() is 'DEVICE'

					_.cordovaHideSplashscreen()

					_.removeCordovaBackbuttonEventListener()

					_.disableCordovaBackbuttonNavigation() 