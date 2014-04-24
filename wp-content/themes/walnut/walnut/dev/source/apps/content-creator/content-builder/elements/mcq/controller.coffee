define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/mcq/views'],
		(App,Element)->

			App.module "ContentCreator.ContentBuilder.Element.Mcq" ,(Mcq, App, Backbone, Marionette,$, _)->

					class Mcq.Controller extends Element.Controller

						initialize:(options)->

							@eventObj = options.eventObj

							# set default values for model
							_.defaults options.modelData,
										element  	: 'Mcq'
										optioncount : 2
										columncount : 2
										elements 	: App.request "create:new:option:collection", [{optionNo:1, class:6},{optionNo:2,class:6}]
										marks : 1
										individual_marks :false
										multiple : false

							super(options)

							@layout.model.on 'change:optioncount', @_changeOptionCount

							@layout.model.on 'change:columncount', @_changeColumnCount


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
							@view = @_getMcqView optionCollection

							# on show of the view 
							# and on the view event show the property box
							@listenTo @view, "show show:this:mcq:properties",(options)=>									
									App.execute "show:question:properties", 
										model : @layout.model

							# listen to event from the view to create the row structure
							@listenTo @view, "create:row:structure", @createRowStructure

							# show the view
							@layout.elementRegion.show @view



						createRowStructure:(options)=>

								numberOfColumns = @layout.model.get('columncount')
								numberOfOptions = @layout.model.get('optioncount')
								
								optionsInMcqCounter = 1

								numberOfRows =  Math.ceil numberOfOptions/numberOfColumns

								until !numberOfRows
									columnCounter = 1

									columnElements = new Array()
									remainingClass = 12
									remainingColumns = numberOfColumns

									until columnCounter > numberOfColumns
										if optionsInMcqCounter <= numberOfOptions
											columnElement =
												position : columnCounter
												element : 'Column'
												className : @layout.model.get('elements').get(optionsInMcqCounter).get 'class'
												elements :  @layout.model.get('elements').get(optionsInMcqCounter)  #[{element:"Option",optionNo:optioninmcq}]
											columnElements.push columnElement
											
											remainingClass = remainingClass - columnElement.className
											remainingColumns = numberOfColumns - columnCounter
											optionsInMcqCounter++


										else
											columnElement =
												position : columnCounter
												element : 'Column'
												className : remainingClass / remainingColumns
												elements : []
											columnElements.push columnElement
										columnCounter++
										


									elements =
										element : 'Row'
										elements : columnElements

									controller = App.request "add:new:element",options.container,'Row', elements
									_.each elements.elements, (column, index)=>
										return if column.elements.length is 0
										container = controller.layout.elementRegion.currentView.$el.children().eq(index)
										# _.each column.elements,(ele, i)=>
										# 	if column.elements.get('element') is 'Row'
										# 		@addNestedElements $(container),ele
										# 	else
										# App.request "add:new:element",container,'Text'
										@_addMcqOption(container,column.elements)

									numberOfRows--

							# on show disable all question elements in d element box
							# @listenTo view, "show",=>
							# 	@eventObj.vent.trigger "question:dropped"

						_addMcqOption:(container, model)->
							view = @_getMcqOptionView model
							view.render()
							$(container).removeClass 'empty-column'
							$(container).append(view.$el)
							view.triggerMethod 'show'

						_getMcqOptionView:(model)->
							new Mcq.Views.McqOptionView
								model : model
							
						bindEvents:->
							super()


						_getMcqView:(optionCollection)->

								new Mcq.Views.McqView
									model : @layout.model
									# collection : optionCollection
									# mcq_model : @layout.model

						# on change of optionNo attribute in the model 
						# change the number of options
						_changeOptionCount:(model,num)=>
								oldval = model.previous('optioncount')
								newval = num
								# if greater then previous then add option
								if oldval<newval
									until oldval is newval
										oldval++
										model.get('elements').push({optionNo:oldval,class:6})
								# else remove options
								if oldval>newval
									until oldval is newval
										model.get('elements').pop()
										oldval--

								@renderElement()

						_changeColumnCount:->
							@layout.model.get('elements').each (element)->
									element.set 'class', 12/numberOfColumns
							@renderElement()


					

						deleteElement:(model)->
							model.set('elements','')
							delete model.get 'elements'
							model.destroy()
							App.execute "close:question:properties"
							# on delete enable all question elements in d element box
							# @eventObj.vent.trigger "question:removed"

