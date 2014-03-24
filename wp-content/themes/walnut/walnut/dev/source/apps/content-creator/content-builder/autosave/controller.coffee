
define ['app'], (App)->

	App.module 'ContentCreator.ContentBuilder.AutoSave', (AutoSave, App, Backbone, Marionette, $, _)->

		# Controller class for showing header resion
		class AutoSave.Controller extends Marionette.Controller

			# initialize the controller. Get all required entities and show the view
			initialize:(opt = {})->

			# autoSave
			autoSave:->

				siteRegion = App.mainContentRegion.$el

				_json 	= @_getPageJson siteRegion
				
				if not _.isObject _json
					throw new Error "invalid json..."

				console.log JSON.stringify _json

				# _page_id = App.request "get:current:editable:page"

				# options = 
				# 	type 	: 'POST'
				# 	url  	: AJAXURL
				# 	data 	:
				# 		action 	: 'save-page-json'
				# 		json 	: JSON.stringify _json
				# 		page_id : _page_id
					

				# $.ajax( options ).done (response)->
				# 	console.log response
				# .fail (resp)->
				# 	console.log 'error'

			# get the json
			_getPageJson:($site)->
				json = 
					# header 	: @_getJson $site.find '#site-header-region'
					@_getJson $site.find '#myCanvas'
					# footer 	: @_getJson $site.find '#site-footer-region'

				json

			# generate the JSON for the layout
			# loops through rows and nested columns and elements inside it
			_getJson:($element, arr = [])->

				# find all elements inside $element container
				elements = $element.children '.element-wrapper'

				_.each elements, (element, index)=>
					
					ele =
						element : $(element).find('form input[name="element"]').val()
						meta_id : parseInt $(element).find('form input[name="meta_id"]').val()

					if ele.element is 'Row'
						ele.draggable = $(element).children('form').find('input[name="draggable"]').val() is "true"
						ele.style = $(element).children('form').find('input[name="style"]').val()
						delete ele.meta_id
						ele.elements = []
						_.each $(element).children('.element-markup').children('.row').children('.column'), (column, index)=>
							className = $(column).attr 'data-class'
							col = 
								position 	: index + 1
								element 	: 'Column'
								className 	: className
								elements 	: @_getJson $(column)
				
							ele.elements.push col 
							return

					arr.push ele
					
				arr	