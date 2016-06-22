define ['app'
		'text!apps/textbooks/textbook-single/templates/textbook-full.html'
		'text!apps/textbooks/textbook-single/templates/textbook-description.html'
		'text!apps/textbooks/textbook-single/templates/chapters-list.html'
		],(App,textbookSingleTpl, textbookDescriptionTpl, chapterListTpl)->

	App.module "TextbooksApp.Single.Views",(Views, App)->

		class Views.TextbookDescriptionView extends Marionette.ItemView

			template : textbookDescriptionTpl
			className: ''

			onShow :->
				console.log 'Show Model'
				console.log @model 

		class Views.TextbookSingleLayout extends Marionette.Layout

			template : textbookSingleTpl

			className : 'row'

			regions: 
				textbookDescriptionRegion 	: '#textbook-description-region'
				chaptersRegion				: '#chapters-list-region'



			events :->
				'click .add-chapter' : 'addChapter'

			addChapter:->
				console.log @collection
				@collection.toAddText = 'true'
				@trigger 'show:add:textbook:popup', @collection

