define ['app'
		'text!apps/textbooks/section-single/templates/sub-list.html'
		'text!apps/textbooks/section-single/templates/sub-list-item.html'
		'text!apps/textbooks/section-single/templates/no-sub.html'
		],(App,sublistTpl, listitemTpl,nosubTpl)->

	App.module "TextbooksApp.Single.Views",(Views, App)->

		class SubListItemView extends Marionette.ItemView

			tagName : 'tr'
			className: 'gradeX odd'
			template : listitemTpl

		class EmptyView extends Marionette.ItemView
			
			tagName : 'tr'
			template:	nosubTpl	
			className: 'gradeX odd'

		class Views.SubListView extends Marionette.CompositeView

			template : sublistTpl

			className : 'grid simple '

			itemView 	: SubListItemView

			emptyView  : EmptyView

			itemViewContainer : '#list-chapters'

			onShow:->
				$('#example2').tablesorter()
				$('#example2').tablesorterPager({container: $("#pager")}); 
				#$('#example2').dataTable({"bPaginate": true,"bSort": true}) if @collection and @collection.length>0
				
				$("html, body").animate({ scrollTop: 0 }, 700);

				#console.log 'collection'
				#console.log @collection  
