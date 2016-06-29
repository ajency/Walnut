define ['app'
		'text!apps/textbooks/chapter-single/templates/chapter-full.html'
		'text!apps/textbooks/chapter-single/templates/chapter-description.html'
		'text!apps/textbooks/chapter-single/templates/sections-list.html'
		],(App,chapterSingleTpl, chapterDescriptionTpl, sectionsListTpl)->

	App.module "TextbooksApp.Single.Views",(Views, App)->

		class Views.ChapterDescriptionView extends Marionette.ItemView

			template : chapterDescriptionTpl
			className: ''



			onShow :->
				console.log 'Show Model'
				#console.log @model 

			options:->
				textbook_id : base_textbook_id
				base_textbook_name : base_textbook_name
				base_class : base_classes_applicable


			serializeData:->
				console.log Marionette.getOption @, 'base_textbook_name'
				data = super()
				data.base_textbook_name = Marionette.getOption @, 'base_textbook_name'
				data.textbook_id = Marionette.getOption @, 'textbook_id'
				data.base_class = Marionette.getOption @, 'base_class'
				console.log data
				data



		class Views.ChapterSingleLayout extends Marionette.Layout

			template : chapterSingleTpl

			className : 'row'

			regions: 
				chapterDescriptionRegion 	: '#textbook-description-region'
				chaptersRegion				: '#chapters-list-region'

			events :->
				'click .add-section' : 'addSection'

			addSection:->
				
				console.log @collection
				@collection.toAddText = 'true'
				@trigger 'show:add:textbook:popup', @collection