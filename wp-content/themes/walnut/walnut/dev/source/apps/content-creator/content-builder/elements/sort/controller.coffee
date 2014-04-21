define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/sort/views'],
		(App,Element)->

			App.module "ContentCreator.ContentBuilder.Element.Sort" ,(Sort, App, Backbone, Marionette,$, _)->

				class Sort.Controller extends Element.Controller

					initialize : (options)->
						@eventObj = options.eventObj

						_.defaults options.modelData,
							marks : 1
							element : 'Sort'
							optioncount : 2
							elements 	: App.request "create:new:option:collection", [{optionNo:1},{optionNo:2}]
							bg_color : '#b1c4e0'
							bg_opacity : 1
							height : 40

						super options

						@layout.model.on 'change:optioncount', @_changeOptionCount

					renderElement : ->
							optionsObj = @layout.model.get 'elements'
							# if the object is a collection then keep as it is 
							if optionsObj instanceof Backbone.Collection
								optionCollection = optionsObj
							# else convert it to collection and set it to mcq model
							else
								optionCollection = App.request "create:new:option:collection" , optionsObj
								@layout.model.set 'elements',optionCollection

							# get the view 
							view = @_getSortView optionCollection

							# listen to show event, and trigger show property box event
							# listen to show property box event and show the property by passing the current model
							@listenTo view, 'show show:this:sort:properties',=>
								App.execute "show:question:properties", 
											model : @layout.model

							# on show disable all question elements in d element box
							@listenTo view, "show",=>
								@eventObj.vent.trigger "question:dropped"

							# show the view
							@layout.elementRegion.show view

					_getSortView : (collection)->		
							new Sort.Views.SortView
									collection : collection
									sort_model : @layout.model

					# on delete remove the collection from the model 
					# coz the model cant be deleted with a collection in it
					deleteElement:(model)->
							model.set('elements','')
							delete model.get 'elements'
							model.destroy()
							App.execute "close:question:properties"
							# on delete enable all question elements in d element box
							@eventObj.vent.trigger "question:removed"


					# on change of optionNo attribute in the model 
					# change the number of options
					_changeOptionCount:(model,num)->
							oldval = model.previous('optioncount')
							newval = num
							# if greater then previous then add option
							if oldval<newval
								until oldval is newval
									oldval++
									model.get('elements').push({optionNo:oldval})
							# else remove options
							if oldval>newval
								until oldval is newval
									model.get('elements').pop()
									oldval--

