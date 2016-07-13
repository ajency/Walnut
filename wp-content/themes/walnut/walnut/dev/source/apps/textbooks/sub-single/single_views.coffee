define ['app'
		'text!apps/textbooks/sub-single/templates/sub-full.html'
		'text!apps/textbooks/sub-single/templates/sub-description.html'
		'text!apps/textbooks/sub-single/templates/list.html'
		],(App,subSingleTpl, subDescriptionTpl, subsubListTpl)->

	App.module "TextbooksApp.Single.Views",(Views, App)->

		class Views.SubDescriptionView extends Marionette.ItemView

			template : subDescriptionTpl
			className: ''

			onShow :->
				console.log 'Show Model'
				console.log @model 

		class Views.SubSingleLayout extends Marionette.Layout

			template : subSingleTpl

			className : 'row'

			regions: 
				subDescriptionRegion 	: '#textbook-description-region'
				subRegion				: '#chapters-list-region'

