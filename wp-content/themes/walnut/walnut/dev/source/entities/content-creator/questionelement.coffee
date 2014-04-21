define ['app'
		'backbone'],(App, Backbone)->

			App.module "Entities.QuestionElement" , (QuestionElement, App, Backbone)->

				class QuestionElement.ElementModel extends Backbone.Model

					idAttribute : "id"
				

				class QuestionElement.ElementCollection extends Backbone.Collection

					model : QuestionElement.ElementModel



				API = 

					createQuestionElement : (data)->
							questionElement = new QuestionElement.ElementModel

							questionElement.set data

							questionElement

					createQuestionElementCollection :(data={})->
							questionCollection = new QuestionElement.ElementCollection
							
							questionCollection.set data
							questionCollection 


				App.reqres.setHandler "create:new:question:element",(data)->

						API.createQuestionElement data

				App.reqres.setHandler "create:new:question:element:collection",(data={})->
						# if data!=undefined
						jsonData = data
						# else
						# 	jsonData = ''
						API.createQuestionElementCollection jsonData