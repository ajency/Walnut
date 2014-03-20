define ['app', 'controllers/region-controller', 'apps/media/upload/views'], (App, AppController)->

	#Login App module
	App.module "Media.Upload", (Upload, App)->

		#Show Controller 
		class Upload.Controller extends AppController

			# initialize
			initialize:()->
				view = @_getView()
				@show view
				
			# gets the main login view
			_getView :(mediaCollection)->
				new Upload.Views.UploadView



		App.commands.setHandler 'start:media:upload:app',(options) =>
			new Upload.Controller
						region : options.region
