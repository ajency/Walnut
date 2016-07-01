define ['app'
		'text!apps/textbooks/textbook-single/templates/chapters-list.html'
		'text!apps/textbooks/textbook-single/templates/chapter-list-item.html'
		'text!apps/textbooks/textbook-single/templates/no-chapters.html'
		],(App,chapterslistTpl, listitemTpl,nochaptersTpl)->

	App.module "TextbooksApp.Single.Views",(Views, App)->

		class ChapterListItemView extends Marionette.ItemView

			tagName : 'tr'
			className: 'gradeX odd'
			template : listitemTpl

		class EmptyView extends Marionette.ItemView
			
			tagName : 'tr'
			template:	nochaptersTpl	
			className: 'gradeX odd'

		class Views.ChapterListView extends Marionette.CompositeView

			template : chapterslistTpl

			className : 'grid simple '

			itemView 	: ChapterListItemView

			emptyView  : EmptyView

			itemViewContainer : '#list-chapters'

			onShow:->
				$('#example2').tablesorter()
				$('#example2').tablesorterPager({container: $("#pager")}); 
				#$('#example2').dataTable({"bPaginate": true,"bSort": true}) if @collection and @collection.length>0
				
				$("html, body").animate({ scrollTop: 0 }, 700);

				console.log 'collection'
				console.log @collection  
