define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/mcq/views'],
		(App,Element)->

			App.module "ContentPreview.ContentBoard.Element.Mcq" ,(Mcq, App, Backbone, Marionette,$, _)->

					class Mcq.Controller extends Element.Controller

						initialize:(options)->
							answerData =
								answer : []
								marks : 0
								comment : 'Not Attempted'
							@answerModel = App.request "create:new:answer",answerData




							_.defaults options.modelData,
						
							super(options)
			



						# overiding the function
						renderElement:()=>

							optionsObj = @layout.model.get 'elements'
							if not optionsObj.length
								optionsObj.push[1]
						
							optionCollection = App.request "create:new:option:collection" , _.shuffle optionsObj
							@layout.model.set 'elements',optionCollection

							App.execute "show:total:marks",@layout.model.get 'marks'

							# get the view
							@view = @_getMcqView optionCollection

							# on show of the view 
							# and on the view event show the property box
							@listenTo @view, "show show:this:mcq:properties",(options)=>									
									App.execute "show:question:properties", 
										model : @layout.model

							# listen to event from the view to create the row structure
							@listenTo @view, "create:row:structure", @createRowStructure

							@listenTo @view, "submit:answer", @_submitAnswer

							# show the view
							@layout.elementRegion.show @view

						_submitAnswer:=>
							if not @answerModel.get('answer').length
								# confirmbox = confirm 'You haven\'t selected anything..\n do you still want to continue?'
								console.log 'you havent selected any thing'
								# return if not confirmbox
								App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')
							
							else
								if not @layout.model.get 'multiple'
									console.log _.difference(@answerModel.get('answer'),@layout.model.get('correct_answer'))
									if not _.difference(@answerModel.get('answer'),@layout.model.get('correct_answer')).length
										@answerModel.set 'marks',@layout.model.get 'marks'
									App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')





						# creates Row structure for mcq
						createRowStructure:(options)=>

								numberOfColumns = @layout.model.get('columncount')
								numberOfOptions = @layout.model.get('optioncount')
								
								# index of the mcq option								
								optionsInMcqCounter = 0

								numberOfRows =  Math.ceil numberOfOptions/numberOfColumns

								until !numberOfRows
									columnCounter = 1

									columnElements = new Array()
									remainingClass = 12
									remainingColumns = numberOfColumns

									until columnCounter > numberOfColumns
										if optionsInMcqCounter < numberOfOptions
											columnElement =
												position : columnCounter
												element : 'Column'
												className : @layout.model.get('elements').at(optionsInMcqCounter).get 'class'
												elements :  @layout.model.get('elements').at(optionsInMcqCounter)  #[{element:"Option",optionNo:optioninmcq}]
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
								answerArray = @answerModel.get 'answer'
								if not @layout.model.get('multiple') and answerArray.length
									@answerModel.set 'answer',[model.get('optionNo')]
									console.log 'in check'
									@view.$el.find('input:checkbox').prop 'checked',false
									@view.$el.find('input:checkbox').parent().css('background-position','0px 0px')
									@view.$el.find("input#option-#{model.get('optionNo')}").prop 'checked',true
									@view.$el.find("input#option-#{model.get('optionNo')}").parent().css('background-position','0px -26px')
										
								else
									answerArray.push model.get('optionNo')
								answerArray.sort()
								console.log @answerModel.get('answer')

						# when a checkbox is unchecked
						_optionUnchecked:(model)=>
								answerArray = @answerModel.get('answer')
								indexToRemove = $.inArray model.get('optionNo'),answerArray
								answerArray.splice indexToRemove,1
								console.log @answerModel.get('answer')


						_getMcqOptionView:(model)->
							new Mcq.Views.McqOptionView
								model : model
							
						

						_getMcqView:(optionCollection)->

								new Mcq.Views.McqView
									model : @layout.model
									# collection : optionCollection
									# mcq_model : @layout.model

					
