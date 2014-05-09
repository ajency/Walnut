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
										elements 	: [{optionNo:1, class:6},{optionNo:2,class:6}]
										marks : 1
										individual_marks :false
										multiple : false
										correct_answer : [2]

							super(options)

							@layout.model.on 'change:optioncount', @_changeOptionCount

							@layout.model.on 'change:columncount', @_changeColumnCount

							@layout.model.on 'change:multiple',@_changeMultipleAnswers

						# function for change of mi=ultiple answers
						_changeMultipleAnswers:(model, multiple)=>
								if not multiple
									model.set 'correct_answer',[]
									# @renderElement()
									# @layout.elementRegion.show @view
									@view.triggerMethod "update:tick"




						# overiding the function
						renderElement:()=>

							optionsObj = @layout.model.get 'elements'
						
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


						# creates Row structure for mcq
						createRowStructure:(options)=>
								console.log @layout.model
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


									@_createMcqRow(elements,options.container)

									numberOfRows--

								@view.triggerMethod 'preTickAnswers'

						# create a row of mcq
						_createMcqRow:(elements,container)->
								controller = App.request "add:new:element",container,'Row', elements
								_.each elements.elements, (column, index)=>
										return if column.elements.length is 0
										container = controller.layout.elementRegion.currentView.$el.children().eq(index)
										@_addMcqOption(container,column.elements)

						# create an mcq option
						_addMcqOption:(container, model)->
							view = @_getMcqOptionView model
							view.render()
							$(container).removeClass 'empty-column'
							$(container).append(view.$el)
							@listenTo view, 'option:checked', @_optionChecked
								
							@listenTo view, 'option:unchecked',@_optionUnchecked
							# call show method of view
							view.triggerMethod 'show'
							# call close method on remove of container
							$(container).on 'remove',->
								view.triggerMethod 'close'

						# when a checkbox is checked
						_optionChecked:(model)=>
								correctAnswerArray = @layout.model.get('correct_answer')
								if not @layout.model.get('multiple') and correctAnswerArray.length
									@layout.model.set 'correct_answer',[model.get('optionNo')]
									console.log 'in check'
									# @renderElement()	
									# @layout.elementRegion.show @view
									@view.triggerMethod "update:tick"

								else
									correctAnswerArray.push model.get('optionNo')
								correctAnswerArray.sort()
								console.log @layout.model.get('correct_answer')

						# when a checkbox is unchecked
						_optionUnchecked:(model)=>
								correctAnswerArray = @layout.model.get('correct_answer')
								indexToRemove = $.inArray model.get('optionNo'),correctAnswerArray
								correctAnswerArray.splice indexToRemove,1
								console.log @layout.model.get('correct_answer')


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
						_changeOptionCount:(model,newOptionCount)=>
								numberOfColumns = model.get 'columncount'
								model.get('elements').each (element)->
									element.set 'class', 12/numberOfColumns
										
								oldOptionCount = model.previous('optioncount')
								
								# if greater then previous then add option
								if oldOptionCount<newOptionCount
									until oldOptionCount is newOptionCount
										oldOptionCount++
										model.get('elements').push({optionNo:oldOptionCount,class:12/numberOfColumns})
								# else remove options
								if oldOptionCount>newOptionCount
									until oldOptionCount is newOptionCount
										model.get('elements').pop()
										oldOptionCount--

								# @renderElement()
								@layout.elementRegion.show @view

						_changeColumnCount:(model,newColumnCount)=>
							model.get('elements').each (element)->
									element.set 'class', 12/newColumnCount
							# @renderElement()
							@layout.elementRegion.show @view


					

						deleteElement:(model)->
							model.set('elements','')
							delete model.get 'elements'
							model.destroy()
							App.execute "close:question:properties"
							# on delete enable all question elements in d element box
							# @eventObj.vent.trigger "question:removed"

