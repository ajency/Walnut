define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.BuilderJSON", (BuilderJSON, App, Backbone, Marionette, $, _)->
			
			class PageJson extends Backbone.Model

				idAttribute : 'page_id'

				name : 'page-json'


			API = 
				getPageJSON:()->
					
					jsonModel = new PageJson
					# 				page_id : parseInt pageId
					# json.fetch()
					json = localStorage.getItem('layout');
					console.log "retrived"+json
					jsonModel.set JSON.parse json
					console.log jsonModel
					jsonModel

			# handlers
			App.reqres.setHandler "get:page:json", (data={})->
				console.log data
				API.getPageJSON()