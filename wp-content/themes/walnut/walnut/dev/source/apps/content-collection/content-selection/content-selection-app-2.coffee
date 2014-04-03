define ['app'
		'controllers/region-controller'
		'text!apps/content-collection/content-selection/templates/content-selection.html'], (App, RegionController, contentSelectionTpl)->

	App.module "ContentSelectionApp.Controller", (Controller, App)->

		class Controller.ContentSelectionController extends RegionController

			initialize : ->
				questionsCollection = new Backbone.Collection [
						{
							'id'			:'1'
							'title'			:'test1'
							'creator'		:'Bob'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'2'
							'title'			:'Question Test'
							'creator'		:'John'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'3'
							'title'			:'test34'
							'creator'		:'Bob'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'4'
							'title'			:'Trial 4324'
							'creator'		:'Jane'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'5'
							'title'			:'Test Stuff'
							'creator'		:'Bob'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'6'
							'title'			:'New Trials'
							'creator'		:'Bessie'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'7'
							'title'			:'Blast'
							'creator'		:'Shawn'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'8'
							'title'			:'Do test'
							'creator'		:'Mike'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
				]

				tableConfig = 
					'data': [
						{
							'label':'Question'
							'value':'title'
						}
						{
							'label':'Creator'
							'value':'creator'
						}
						{
							'label':'Last Modified'
							'value':'last_modified'
						}
					]
					'id_attribute': 'id' # id attribute of the model
					'selectbox': true
					'pagination': true
				
					
				@view= view = @_getContentSelectionView(questionsCollection, tableConfig)

				@show view, (loading:true)

			_getContentSelectionView : (collection, tableConfig)->
				new dataContentTableView
					collection: collection
					tableConfig: tableConfig

		class dataContentTableView extends Marionette.ItemView

			template 			: contentSelectionTpl

			className 			: 'tiles white grid simple vertical green'

			events: 
				'change #check_all_div'	: 'check_all'



			initialize: (opts)->
				@tableData= opts.tableConfig

			serializeData: ->
				data= super()
				data.tableData= @tableData
				data


			onShow:=>
				_.each(@collection.models , (item, index)=>
					row = '<tr>'

					if @tableData.selectbox 
						row += '<td class="v-align-middle"><div class="checkbox check-default">
								<input class="tab_checkbox" type="checkbox" value="'+item.get(@tableData.id_attribute)+'" id="checkbox'+index+'">
								<label for="checkbox'+index+'"></label>
							  </div>
							</td>'

					_.each @tableData.data, (el,ind)->
							row += '<td> '+ item.get(el.value) + ' </td>'
						

					row +='</tr>'
					@$el.find('#dataContentTable tbody').append(row)
				)

				$('#dataContentTable').tablesorter();

				if @tableData.pagination
					@$el.find('.pager').show()
					pagerOptions = 
						container: $(".pager"),				
						output: '{startRow} to {endRow} of {totalRows}'

					$('#dataContentTable').tablesorterPager pagerOptions

			check_all:->
				if @$el.find('#check_all').is(':checked')
					console.log 'checked'
					@$el.find('#dataContentTable .tab_checkbox').trigger('click').prop('checked', true);
				else 
					console.log 'not checked'
					@$el.find('#dataContentTable .tab_checkbox').removeAttr('checked')

		# set handlers
		App.commands.setHandler "show:content:selectionapp", (opt = {})->
			new Controller.ContentSelectionController opt		
