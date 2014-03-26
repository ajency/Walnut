define ['app'
		'text!apps/textbooks/textbook-single/templates/textbook-full.html'
		'text!apps/textbooks/textbook-single/templates/textbook-description.html'
		'text!apps/textbooks/textbook-single/templates/chapters-list.html'
		],(App,textbookSingleTpl, textbookDescriptionTpl, chapterListTpl)->

	App.module "TextbooksApp.Single.Views",(Views, App)->

		class Views.TextbookDescriptionView extends Marionette.ItemView

			template : textbookDescriptionTpl
			className: 'tiles white col-md-12 no-padding'

			onShow :->
				console.log 'Show View'
				console.log @model 

		class Views.TextbookSingleLayout extends Marionette.Layout

			template : textbookSingleTpl

			className : 'page-content'

			regions: 
				textbookDescriptionRegion 	: '#textbook-description-region'
				chaptersRegion				: '#chapters-list-region'
