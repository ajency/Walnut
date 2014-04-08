define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/image/views'
		'apps/content-creator/content-builder/elements/image/settings/controller'],
		(App,Element)->

			App.module 'ContentCreator.ContentBuilder.Element.Image',
			(Image, App, Backbone, Marionette, $, _)->

				# menu controller
				class Image.Controller extends Element.Controller

					# intializer
					initialize:(options)->

						_.defaults options.modelData,
											element  	: 'Image'
											image_id	: 0
											size 		: 'thumbnail'
											align 		: 'left'

						super(options)
						
					bindEvents:->
						# start listening to model events
						@listenTo @layout.model, "change:image_id", @renderElement
						@listenTo @layout.model, "change:size", @renderElement
						@listenTo @layout.model, "change:align", @renderElement
						super()

					# private etmplate helper function
					# this function will get the necessary template helpers for the element
					# template helper will return an object which will later get mixed with
					# serialized data before render
					_getTemplateHelpers:->
							size 		: @layout.model.get 'size'
							alignment 	: @layout.model.get 'align'

					_getImageView:(imageModel)->
						new Image.Views.ImageView
										model : imageModel
										templateHelpers : @_getTemplateHelpers()
												

					# setup templates for the element
					renderElement:()=>
						@removeSpinner()
						# get logo attachment
						imageModel = App.request "get:media:by:id",@layout.model.get 'image_id'

						console.log "imageModel " 
						console.log imageModel
						
						App.execute "when:fetched", imageModel, =>
							
							view = @_getImageView imageModel

							#trigger media manager popup and start listening to "media:manager:choosed:media" event
							@listenTo view, "show:media:manager", =>
									App.navigate "media-manager", trigger : true
									@listenTo App.vent,"media:manager:choosed:media",(media)=>
										@layout.model.set 'image_id', media.get 'id'
										# @layout.model.save()
										@stopListening App.vent,"media:manager:choosed:media"

							@listenTo view, "image:size:selected", (size)=>
								@layout.model.set 'size', size
								@layout.model.save()
								localStorage.setItem 'ele'+@layout.model.get('meta_id'), JSON.stringify(@layout.model.toJSON())
								console.log localStorage.getItem 'ele'+@layout.model.get('meta_id')


							@layout.elementRegion.show view
							