define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/mcq/views'],
		(App,Element)->

			App.module "ContentCreator.ContentBuilder.Element.Mcq" ,(Mcq, App, Backbone, Marionette,$, _)->

					class Mcq.Controller extends Element.Controller

						initialize:(options)->

							# set default values for model
							_.defaults options.modelData,
										element  	: 'Mcq'
										optioncount : 2
										elements 	: App.request "create:new:option:collection", [{optionNo:1},{optionNo:2}]
										marks : 1
										individual_marks :false
										multiple : false

							super(options)

							@layout.model.on 'change:optioncount', @_changeOptionCount


						# overiding the function
						renderElement:()=>

							optionsObj = @layout.model.get 'elements'
							# if the object is a collection then keep as it is 
							if optionsObj instanceof Backbone.Collection
								optionCollection = optionsObj
							# else convert it to collection and set it to mcq model
							else
								optionCollection = App.request "create:new:option:collection" , optionsObj
								@layout.model.set 'elements',optionCollection

							# get the view
							view = @_getMcqView optionCollection

							# on show of the view 
							# and on the view event show the property box
							@listenTo view, "show show:this:mcq:properties",(options)=>									
									App.execute "show:question:properties", 
										model : @layout.model

							# show the view
							@layout.elementRegion.show view
							
						bindEvents:->
							super()


						_getMcqView:(optionCollection)->

								new Mcq.Views.McqView
									collection : optionCollection
									mcq_model : @layout.model

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


					

						deleteElement:(model)->
							model.set('elements','')
							delete model.get 'elements'
							model.destroy()
							App.execute "close:question:properties"
