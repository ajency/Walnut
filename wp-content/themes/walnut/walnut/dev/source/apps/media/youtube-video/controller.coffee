define ['app', 'controllers/region-controller'], (App, AppController)->

	#Login App module
	App.module "Media.Youtube", (Youtube, App)->
	
		class YoutubeView extends Marionette.ItemView
			template: '<div class="row">
						<div class="col-md-4">
							<input type="text" class="form-control youtubeUrl" placeholder="Youtube Video Url">
						</div>
						<div class="col-md-4">
							<button class="pull-left btn btn-info btn-small">Add Video</button>
						</div>
					</div>'
			
			events:->
				'click button' :-> @trigger "youtube:url:selected", $('.youtubeUrl').val()
	
		#Show Controller 
		class Youtube.Controller extends AppController

			# initialize
			initialize:()->
				view = @_getView()
				@show view
				
				@listenTo view, 'youtube:url:selected', (url)-> @region.trigger 'youtube:url:selected', url
				
			# gets the main login view
			_getView :(mediaCollection)->
				new YoutubeView

		

		App.commands.setHandler 'start:youtube:video:app',(options) =>
			new Youtube.Controller
				region : options.region
