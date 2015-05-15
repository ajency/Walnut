define ['app', 'controllers/region-controller'], (App, AppController)->

	#Login App module
	App.module "Media.Youtube", (Youtube, App)->
	
		class YoutubeView extends Marionette.ItemView
			template: '
					<div class="row">
						<div class="col-md-6">
							<input type="text" class="form-control youtubeUrl" placeholder="http://www.youtube.com/watch?v=ZtFG0152">
							<i class="text-danger hidden">Your URL should be something like http://www.youtube.com/watch?v=ZtFG0152</i>
						</div>
						<div class="col-md-4">
							<button class="pull-left btn btn-info btn-small">Add Video</button>
						</div>
					</div>'
			
			events:->
				'click button' :-> 
					url = $('.youtubeUrl').val()
					
					@$el.find '.text-danger'
					.addClass 'hidden'
					
					@$el.find '.youtubeUrl'
					.removeClass 'error'

					if _.str.contains(url, 'http://www.youtube.com/watch?v=') or _.str.contains url, 'https://www.youtube.com/watch?v='
						@trigger "youtube:url:selected", url
					else
						@$el.find '.text-danger'
						.removeClass 'hidden'
						
						@$el.find '.youtubeUrl'
						.addClass 'error'
	
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
