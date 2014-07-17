define ["app", 'backbone'], (App, Backbone) ->
	App.module "Entities.QuestionResponse", (QuestionResponse, App, Backbone, Marionette, $, _)->


		# textbook model
		class QuestionResponseModel extends Backbone.Model

			idAttribute: 'ref_id'

			defaults:
				collection_id       : 0
				content_piece_id    : 0
				division            : 0
				question_response   : []
				time_taken          : 0
				start_date          : ''
				end_date            : ''
				status              : ''

			name: 'question-response'


		# textbooks collection class
		class QuestionResponseCollection extends Backbone.Collection
			model: QuestionResponseModel
			comparator: 'term_order'
			name: 'question-response'

			url: ->
				AJAXURL + '?action=get-question-response'

			parse: (resp)->
				@total = resp.count
				resp.data


		# API
		API =
		# get response collection
			getAllQuestionResponses: (param = {})->
				responseCollection = new QuestionResponseCollection
				responseCollection.fetch
					reset: true
					data: param

				responseCollection


			saveQuestionResponse: (data)->
				questionResponse = new QuestionResponseModel data

				questionResponse



		# request handler to get all responses
		App.reqres.setHandler "get:question:response:collection", (params) ->
			API.getAllQuestionResponses params

		App.reqres.setHandler "save:question:response", (qID)->
			API.saveQuestionResponse qID