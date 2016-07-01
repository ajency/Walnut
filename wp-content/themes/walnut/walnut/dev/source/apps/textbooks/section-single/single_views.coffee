define ['app'
		'text!apps/textbooks/section-single/templates/section-full.html'
		'text!apps/textbooks/section-single/templates/section-description.html'
		'text!apps/textbooks/section-single/templates/sub-list.html'
		],(App,sectionSingleTpl, sectionDescriptionTpl, subListTpl)->

	App.module "TextbooksApp.Single.Views",(Views, App)->

		class Views.SectionDescriptionView extends Marionette.ItemView

			template : sectionDescriptionTpl
			className: ''

			onShow :->
				console.log 'Show Model'
				console.log @model 

			options:->
				textbook_id : base_textbook_id
				base_textbook_name : base_textbook_name
				base_class : base_classes_applicable
				base_chapter_name : base_chapter_name
				base_chapter_id : base_chapter_id

			serializeData:->
				console.log Marionette.getOption @, 'base_textbook_name'
				data = super()
				data.base_textbook_name = Marionette.getOption @, 'base_textbook_name'
				data.textbook_id = Marionette.getOption @, 'textbook_id'
				data.base_class = Marionette.getOption @, 'base_class'
				data.base_chapter_name = Marionette.getOption @, 'base_chapter_name'
				data.base_chapter_id = Marionette.getOption @, 'base_chapter_id'
				console.log data
				data


		class Views.SectionSingleLayout extends Marionette.Layout

			template : sectionSingleTpl

			className : 'row'

			regions: 
				sectionDescriptionRegion 	: '#textbook-description-region'
				sectionRegion				: '#chapters-list-region'

			serializeData: ->
				data = super()
				console.log 'check Admin'
				console.log @collection
				data.isAdmin = @collection.isAdmin
				data

			events :->
				'click .add-sub' : 'addSub'

			addSub:->
				console.log @collection
				@collection.toAddText = 'true'
				@trigger 'show:add:textbook:popup', @collection

