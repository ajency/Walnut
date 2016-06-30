define ['app'
		'text!apps/textbooks/chapter-single/templates/sections-list.html'
		'text!apps/textbooks/chapter-single/templates/section-list-item.html'
		'text!apps/textbooks/chapter-single/templates/no-sections.html'
		],(App,sectionslistTpl, listitemTpl,nosectionsTpl)->

	App.module "TextbooksApp.Single.Views",(Views, App)->

		class SectionListItemView extends Marionette.ItemView

			tagName : 'tr'
			className: 'gradeX odd'
			template : listitemTpl

			serializeData:->
				data = super()
				#data.base_textbook_name = Marionette.getOption @, 'base_textbook_name'
				data.textbook_id = Marionette.getOption @, 'textbook_id'
				#data.base_class = Marionette.getOption @, 'base_class'
				console.log data
				data

		class EmptyView extends Marionette.ItemView
			
			tagName : 'tr'
			template:	nosectionsTpl	
			className: 'gradeX odd'

		class Views.SectionListView extends Marionette.CompositeView

			template : sectionslistTpl

			className : 'grid simple '

			itemView 	: SectionListItemView

			emptyView  : EmptyView

			itemViewContainer : '#list-chapters'

			itemViewOptions:->
				textbook_id : base_textbook_id
				base_textbook_name : base_textbook_name
				base_class : base_classes_applicable
				#textbook_name: textbooksCollectionOrigninal.

			onShow:->
				#console.log base_textbook_name
				#textbook_id = '5425'
				$('#example2').tablesorter()
				$('#example2').tablesorterPager({container: $("#pager")}); 
				#$('#example2').dataTable({"bPaginate": true,"bSort": true}) if @collection and @collection.length>0
				
				$("html, body").animate({ scrollTop: 0 }, 700);

				console.log 'collection'
				#console.log @collection
