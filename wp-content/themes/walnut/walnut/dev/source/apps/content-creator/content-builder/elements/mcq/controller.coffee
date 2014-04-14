define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/mcq/views'],
		(App,Element)->

			App.module "ContentCreator.ContentBuilder.Element.Mcq" ,(Mcq, App, Backbone, Marionette,$, _)->

					class Mcq.Controller extends Element.Controller

						initialize:(options)->
							console.log options


							_.defaults options.modelData,
										element  	: 'Mcq'
										optioncount : 2
										elements 	: App.request "create:new:mcq:option:collection", [{optionNo:1},{optionNo:2}]
										marks : 1
										individual_marks :false
										multiple : false

							super(options)


							

			
						_changeOptionCount:(model,num)->
									oldval = model.previous('optioncount')
									newval = num
									if oldval<newval
										until oldval is newval

											console.log oldval
											oldval++
											model.get('elements').push({optionNo:oldval})
									if oldval>newval
										until oldval is newval
											model.get('elements').pop()
											oldval--
							
									console.log model

						_showView:->
							optionsObj = @layout.model.get 'elements'

							# if the object is a collection then keep as it is 
							if optionsObj instanceof Backbone.Collection
								optionCollection = optionsObj

							# else convert it to collection and set it to mcq model
							else
								optionCollection = App.request "create:new:mcq:option:collection" , optionsObj
								@layout.model.set 'elements',optionCollection

							view = @_getMcqView optionCollection

							@listenTo view, 'show',=>
								App.execute "show:question:properties", 
										model : @layout.model

							@listenTo view, "change:radio:to:checkbox",=>
								if @layout.model.get 'multiple'
									$('.mcq#mcq-'+@layout.model.get('meta_id')+' .mcq-option input.mcq-option-select').attr 'type','checkbox'

							@listenTo view, "show:this:mcq:properties",(options)=>									
									App.execute "show:question:properties", 
										model : @layout.model

							@listenTo view, "hide:this:mcq:properties",(options)=>									
									App.execute "close:question:properties"

							@layout.elementRegion.show view
							
						bindEvents:->
							# start listening to model events
							# @listenTo @layout.model, "change:style", @changeStyle
							# @listenTo @layout.model, "change:columncount", @columnCountChanged
							super()


						_getMcqView:(optionCollection)->

								new Mcq.Views.McqView
									collection : optionCollection
									meta : @layout.model.get 'meta_id'


						renderElement:()=>

							@_showView()

							$('button#save-question').on 'click',=>
								console.log 'saving'
								localStorage.setItem 'ele'+@layout.model.get('meta_id'), JSON.stringify(@layout.model.toJSON())



							@layout.model.on 'change:optioncount', @_changeOptionCount

						deleteElement:(model)->
							model.set('elements','')
							delete model.get 'elements'
							model.destroy()

					




