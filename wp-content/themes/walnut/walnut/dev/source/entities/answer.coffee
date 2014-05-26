define ['app'
		'backbone'], (App, Backbone) ->

		App.module "Entities.Answer", (Answer, App, Backbone, Marionette, $, _)->

			class Answer.AnswerModel extends Backbone.Model 

			API = 

				createAnswer : (data = {})->

						answer = new Answer.AnswerModel

						answer.set data

						answer

			App.reqres.setHandler "create:new:answer",(data)->
					API.createAnswer data