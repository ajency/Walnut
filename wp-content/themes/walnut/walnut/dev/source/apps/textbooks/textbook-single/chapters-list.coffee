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
			
			template:	nochaptersTpl	
			tagName : 'tr'
			className: 'gradeX odd'

		class Views.ChapterListView extends Marionette.CompositeView

			template : chapterslistTpl

			className : 'page-content'

			itemView 	: ChapterListItemView

			emptyView  : EmptyView

			itemViewContainer : '#list-chapters'

			onShow:->
				$('#example2').dataTable({"bPaginate": true,"bSort": true}) if @collection and @collection.length>0

				console.log 'collection'
				console.log @collection  

		  #    onShow:->
		  #    	responsiveHelper = undefined;
				# breakpointDefinition = {
				# 	tablet: 1024,
				# 	phone : 480
				# };    
				# tableElement = $('#example2');

				# tableElement.dataTable
				# 	"sDom": "<'row'<'col-md-6'l T><'col-md-6'f>r>t<'row'<'col-md-12'p i>>"
				# 	"oTableTools": 
				# 		"aButtons": 
				# 			"sExtends":    "collection",
				# 			"sButtonText": "<i class='fa fa-cloud-download'></i>",
				# 			"aButtons":    [ "csv", "xls", "pdf", "copy"]
					
				# 		"sPaginationType": "bootstrap",
				# 		"aoColumnDefs":
				# 			'bSortable': false, 'aTargets': [ 0 ]
						
				# 		"aaSorting": [[ 1, "asc" ]],
				# 		"oLanguage":
				# 			"sLengthMenu": "_MENU_ ",
				# 			"sInfo": "Showing <b>_START_ to _END_</b> of _TOTAL_ entries"
					
				# 	bAutoWidth: false						
				   
				# 	fnRowCallback  : (nRow) ->
				# 		responsiveHelper.createExpandIcon(nRow);
					
				# 	fnDrawCallback : (oSettings)->
				# 		responsiveHelper.respond();