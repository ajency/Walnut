define ['app'
		'controllers/region-controller'
		'text!apps/content-collection/content-selection/templates/content-selection.html'], (App, RegionController, contentSelectionTpl)->

	App.module "ContentSelectionApp.Controller", (Controller, App)->

		class Controller.ContentSelectionController extends RegionController

			initialize : ->
				@textbooksCollection = App.request "get:textbooks"

				@questionsCollection = App.request "get:content:pieces"

				tableConfig = 
					'data': [
						{
							'label':'Question'
							'value':'post_title'
						}
						{
							'label':'Creator'
						}
						{
							'label'		:'Last Modified'
							'value'		:'post_modified'
							'dateField' : true
						}
						{
							'label'		:'Content Type'
						}
					]
					'filters':[
						{
							'label' : 'textbooks'
							'values': ['History','Geography']
						}
						{
							'label' : 'chapters'
							'values': ['Chapter1', 'Chapter2']
						}
					]
					'idAttribute': 'ID' # id attribute of the model # default = 'id'
					'selectbox': true
					'pagination': true

				@view= view = @_getContentSelectionView(@questionsCollection, tableConfig)

				@show view, (loading:true, entities : [@textbooksCollection])

			_getContentSelectionView : (collection, tableConfig)=>
				new DataContentTableView
					collection: collection
					tableConfig: tableConfig
					templateHelpers: 
						textbooksFilter:()=>
							textbooks= []
							_.each(@textbooksCollection.models, (el,ind)->
								textbooks.push('name':el.get('name'), 'id': el.get('term_id'))
							)
							textbooks
						

		class DataContentTableView extends Marionette.ItemView

			template 			: contentSelectionTpl

			className 			: 'tiles white grid simple vertical green'

			events: 
				'change #check_all_div'		: 'check_all'
				'change #textbooks-filter'	: 'filter_textbooks'



			initialize: (opts)->
				@tableData= opts.tableConfig

			serializeData: ->
				data= super()
				data.tableData= @tableData
				data


			onShow:=>
				#DEFAULTS
				td_ID= 'id';

				#makes slug with underscore instead of hyphen
				make_slug = (str)->
				    $slug = '';
				    trimmed = $.trim(str);
				    $slug = trimmed.replace(/[^a-z0-9-]/gi, '_').
				    replace(/_+/g, '_').
				    replace(/^_|_$/g, '');
				    $slug.toLowerCase();

				if @tableData.idAttribute
					td_ID=@tableData.idAttribute

				_.each(@collection.models , (item, index)=>
					console.log item
					row = '<tr>'

					if @tableData.selectbox 
						row += '<td class="v-align-middle"><div class="checkbox check-default">
								<input class="tab_checkbox" type="checkbox" value="'+item.get(td_ID)+'" id="checkbox'+index+'">
								<label for="checkbox'+index+'"></label>
							  </div>
							</td>'

					_.each @tableData.data, (el,ind)->
						if el.value
							el_value = item.get el.value

						else
							slug= make_slug(el.label)
							el_value =  item.get slug


						if el.dateField
							el_value= moment(el_value).format("Do MMM YYYY")

						row += '<td> '+ el_value + ' </td>'
						

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
					@$el.find('#dataContentTable .tab_checkbox').trigger('click').prop('checked', true);
				else 
					@$el.find('#dataContentTable .tab_checkbox').removeAttr('checked')

			filter_textbooks:(e)->
				filter_id= parseInt($(e.target).val());
				console.log filter_id
				filtered_data= _.filter(@collection.models, (item)=>
						subjects= _.pluck(item.get('subjects'), 'term_id')
						console.log subjects
						if (_.contains(subjects, filter_id))
							@$el.find('#dataContentTable tbody tr').hide()
							pagerOptions = 
								container: $(".pager"),				
								output: '{startRow} to {endRow} of {totalRows}'

							$('#dataContentTable').tablesorterPager pagerOptions

							console.log 'contains'
						else 
							console.log 'doesnt'
							console.log filter_id
					)

		# set handlers
		App.commands.setHandler "show:content:selectionapp", (opt = {})->
			new Controller.ContentSelectionController opt		
