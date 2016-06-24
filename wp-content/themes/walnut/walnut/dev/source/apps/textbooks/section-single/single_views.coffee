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

		class Views.SectionSingleLayout extends Marionette.Layout

			template : sectionSingleTpl

			className : 'row'

			regions: 
				sectionDescriptionRegion 	: '#textbook-description-region'
				sectionRegion				: '#chapters-list-region'

			events :->
				'click .add-sub' : 'addSub'

			addSub:->
				console.log @collection
				@collection.toAddText = 'true'
				@trigger 'show:add:textbook:popup', @collection

