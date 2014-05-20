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

							# console.log 

							super(options)

							@layout.model.on 'change:optioncount', @_changeOptionCount

							@layout.model.on 'change:columncount', @_changeColumnCount

							@layout.model.on 'change:multiple',@_changeMultipleAnswers

						# function for change of mi=ultiple answers
						_changeMultipleAnswers:(model, multiple)=>
								if not multiple
									model.set 'correct_answer',[]
									# @renderElement()
									@layout.elementRegion.show @view
									# @view.triggerMethod "update:tick"




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
								
								numberOfColumns = @layout.model.get('columncount')
								numberOfOptions = @layout.model.get('optioncount')
								
								optionsInMcqCounter = 1

								# if the number of columns is 3 and number of option
								#  is 4 then v need no of rows as 2
								numberOfRows =  Math.ceil numberOfOptions/numberOfColumns

								# do for all rows
								until !numberOfRows
									columnCounter = 1

									columnElements = new Array()
									# for bootstrap
									remainingClass = 12
									remainingColumns = numberOfColumns

									# do for each column in the row
									until columnCounter > numberOfColumns
										# if all options havn't been put as yet
										if optionsInMcqCounter <= numberOfOptions
											columnElement =
												position : columnCounter
												element : 'Column'
												className : @layout.model.get('elements').get(optionsInMcqCounter).get 'class'
												elements :  @layout.model.get('elements').get(optionsInMcqCounter)  #[{element:"Option",optionNo:optioninmcq}]
											# push it column elements
											columnElements.push columnElement
											# subtract the remaining bootstrap class
											remainingClass = remainingClass - columnElement.className

											remainingColumns = numberOfColumns - columnCounter
											optionsInMcqCounter++

										# if all options have been already put then insert blank columns
										# having class calculed from the remaining columns in d row and
										# the remaining classes
										else
											columnElement =
												position : columnCounter
												element : 'Column'
												className : remainingClass / remainingColumns
												elements : []
											columnElements.push columnElement
										columnCounter++
									# add column elements to row
									elements =
										element : 'Row'
										elements : columnElements

									# once the row object is formed give it to the function to render it
									@_createMcqRow(elements,options.container)

									numberOfRows--

								# do a pre select for answers 
								@view.triggerMethod 'preTickAnswers'

						# create a row of mcq
						_createMcqRow:(elements,container)->
								controller = App.request "add:new:element",container,'Row', elements
								_.each elements.elements, _.bind @_iterateColumnElements ,@ , controller
								# (column, index)=>
								# 		return if column.elements.length is 0
								# 		container = controller.layout.elementRegion.currentView.$el.children().eq(index)
								# 		@_addMcqOption(container,column.elements)

						_iterateColumnElements : (controller,column, index)->
								console.log @
								console.log controller
								console.log column
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
								model.get('elements').each _.bind @_changeColumnClass, @, numberOfColumns
										
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
							model.get('elements').each _.bind @_changeColumnClass, @, numberOfColumns
									
							# @renderElement()
							@layout.elementRegion.show @view

						_changeColumnClass : (element,numberOfColumns)->
								element.set 'class', 12/newColumnCount

					

						deleteElement:(model)->
							model.set('elements','')
							delete model.get 'elements'
							model.destroy()
							App.execute "close:question:properties"
							# on delete enable all question elements in d element box
							# @eventObj.vent.trigger "question:removed"

