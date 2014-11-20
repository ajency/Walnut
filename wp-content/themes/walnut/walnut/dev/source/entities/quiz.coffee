define ["app", 'backbone'], (App, Backbone) ->
	App.module "Entities.Quiz", (Quiz, App, Backbone, Marionette, $, _)->


		# content group model
		class Quiz.ItemModel extends Backbone.Model

			idAttribute: 'id'

			defaults : ->
				name: ''
				description: []
				created_on: ''
				created_by: ''
				last_modified_on: ''
				last_modified_by: ''
				published_on: ''
				published_by: ''
				post_status: 'underreview'
				type: 'quiz'
				quiz_type : 'practice'
				marks : 0
				total_minutes: 0
				duration: 0
				minshours: 'mins'
				negMarksEnable: 'false'
				negMarks: ''
				term_ids: []
				content_pieces: []
				message : {}
				content_layout:[]

			name: 'quiz'

			hasPermission:(permsission)->
				all_permissions = @.get 'permissions'
				
				if _.platform() is 'DEVICE'
					if _.toBool(all_permissions[permsission]) then return true else return false
				else
					if all_permissions[permsission] then return true else return false

			getMessageContent:(message_type)->
				default_messages =
					end_quiz                    : 'You really want to end the quiz?'
					submit_without_attempting   : 'You havent answered the question. Are you sure you want to continue?'
					incomplete_answer           : 'You havent completed the question. Are you sure you want to continue?'
					correct_answer              : 'You are correct!'
					incorrect_answer            : 'Sorry, you did not answer correctly'
					partial_correct_answers     : 'You are almost correct'
					quiz_time_up                : 'Sorry, your time is up'

				message_content = default_messages[message_type]

				if not _.isEmpty @.get 'message'
					custom_messages= @.get 'message'
					message_content = custom_messages[message_type] if custom_messages[message_type]

				message_content

			getQuizTypeLabel:->
				quiz_type = switch @.get 'quiz_type'
								when 'practice'     then 'Practice'
								when 'test'         then 'Take at Home'
								when 'class_test'   then 'Class Test'

				quiz_type

			setDecryptedVideos:(questionsCollection)->
				defer = $.Deferred()
				
				if not @.get 'videoIDs'
					vids = questionsCollection.pluck 'videoArray'
					flattendecryptedVideos = _.flatten vids
					compactVideosIds = _.compact flattendecryptedVideos
					uniqueVideosIds = _.uniq compactVideosIds
					getVideoIds = _.initLocalVideosCheck(uniqueVideosIds) #your function to get decrytped videos
					getVideoIds.done (videoIds)=>

						@.set 'videoIDs' : videoIds
						
						defer.resolve videoIds
				else
					defer.resolve @

				defer.promise()


		# collection of group of content pieces eg. quizzes, teacher training modules etc.
		class Quiz.ItemCollection extends Backbone.Collection
			model: Quiz.ItemModel
			name: 'quiz'

			url: ->
				AJAXURL + '?action=get-quizes'

			parse: (resp)->
				resp.data.reverse()
		
		quizRepository= new Quiz.ItemCollection

		# API
		API =
		# get all content groups
			getQuizes: (param = {})->

				quizCollection = new Quiz.ItemCollection

				quizCollection.fetch
					reset: true
					data: param
					success:(resp)-> 
						if not param.search_str

							quizRepository.reset resp.models

				quizCollection


			getQuizByID: (id)->
				quiz = quizCollection.get id if quizCollection?

				if not quiz
					quiz = new Quiz.ItemModel 'id': id
					quiz.fetch()

				quiz


			saveQuizDetails: (data)->
				quizItem = new Quiz.ItemModel data
				quizItem

			newQuiz:->
				new Quiz.ItemModel

			getDummyQuiz:(content_piece_id)->
				dummyQuiz = new Quiz.ItemModel()

				dummyQuiz.set 
					id      : 3423432
					name: 'Dummy Module'
					description: 'Dummy Module Description'
					type: 'quiz'
					quiz_type : 'test'
					duration: 40
					content_pieces: [content_piece_id]
					permissions: 
						allow_skip: true
						display_answer: true
						allow_hint: true

				dummyQuiz

			saveQuizSchedule:(data)->

				defer = $.Deferred()

				@result = 0

				connection_resp = $.middle_layer AJAXURL + '?action=save-quiz-schedule',
					data
					(response) =>
						defer.resolve response         

				defer.promise()

			clearQuizSchedule:(quiz_id, division)->

				defer= $.Deferred()

				data=
					'quiz_id'  : quiz_id
					'division' : division

				connection_resp = $.middle_layer AJAXURL + '?action=clear-quiz-schedule',
					data
					(response) =>
						defer.resolve response         

				defer.promise()


				
		# request handler to get all content groups
		App.reqres.setHandler "get:quizes", (opt) ->
			API.getQuizes(opt)

		App.reqres.setHandler "get:quiz:by:id", (id)->
			API.getQuizByID id

		App.reqres.setHandler "save:quiz:details", (data)->
			API.saveQuizDetails data

		App.reqres.setHandler "new:quiz",->
			API.newQuiz()

		App.reqres.setHandler "save:quiz:schedule",(data)->
			API.saveQuizSchedule data

		App.reqres.setHandler "clear:quiz:schedule",(quiz_id, division)->
			API.clearQuizSchedule quiz_id, division

		App.reqres.setHandler "create:dummy:quiz:module", (content_piece_id)->
			API.getDummyQuiz content_piece_id

		App.reqres.setHandler "get:quiz:repository",->
			quizRepository.clone()

		App.reqres.setHandler "app:reset:quiz:repository", (models)->
			quizRepository.reset models