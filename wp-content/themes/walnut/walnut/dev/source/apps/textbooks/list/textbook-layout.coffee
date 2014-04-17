define ['app'
		'text!apps/textbooks/templates/textbooks.html'
		],(App,textbooksTpl)->

	App.module "TextbooksApp.List.Views",(Views, App)->

		class Views.TextbookListLayout extends Marionette.Layout

				template : textbooksTpl

				className : 'page-content'

				regions: 
					breadcrumbRegion 	: '#breadcrumb-region'
					textbooksListRegion	: '#textbooks-list-region'
