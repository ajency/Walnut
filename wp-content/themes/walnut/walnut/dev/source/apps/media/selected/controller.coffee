define ['app', 'controllers/region-controller'], (App, AppController)->

	#Login App module
	App.module "Media.Selected", (Selected, App)->
		
		#Show Controller 
		class Selected.Controller extends AppController

			# initialize
			initialize:(opt = {})-> 
				{ @region, collection } = opt
				view = @_getView collection
				@show view
				 
				
			# gets the main login view
			_getView :(collection)->
				new SelectedMedia
							collection : collection 


		# Views
		# single media view
		class SelectedSingle extends Marionette.ItemView
			template : ''
			className: 'media'
			tagName : 'img'
			events:
				'click a'	: (e)-> e.preventDefault()
			onRender:->
				@$el.width '50px'
					.height '50px'
				@$el.attr 'src', @model.get('sizes').thumbnail.url

		class EmptyView extends Marionette.ItemView
			className : 'pick-image'
			template : '<span class="glyphicon glyphicon-hand-left"></span><h4>Select an Image from the library</h4>'

		# collection view 
		class SelectedMedia extends Marionette.CompositeView
			className : 'clearfix'
			template: '<div id="selected-images"></div>'
			itemView : SelectedSingle
			emptyView: EmptyView
			itemViewContainer: '#selected-images'
	
		Selected.on 'initialize:before', ->

		App.commands.setHandler 'start:media:selected:app',(options) =>
			new Selected.Controller options