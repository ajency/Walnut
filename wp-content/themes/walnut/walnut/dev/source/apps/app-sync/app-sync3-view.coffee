define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync3.html'], (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSync3Controller extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()

				# listen to the close event of the view
				@listenTo view, 'close', ->
					App.navigate('teachers/dashboard', trigger: true)

				App.commands.setHandler "close:sync3:view", =>
					@view.close()

				@show view, (loading: true)


			_getAppSyncView : ->
				new AppSyncView

					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl

			events :
				'click #DownloadNow' : 'startDownload'
				'click #importNow' : 'startImport'
				'click #generateNow' : 'generateZipFile'


			onShow : ->
				App.breadcrumbRegion.close()

				syncDetailsCount = _.getTotalSyncDetailsCount('file_import')
				syncDetailsCount.done (count)->
					if count is 0
					
						$('#dwnldDateTime').hide();
						$('#imprtDateTime').hide();
						$('#progressBarDwnld').hide();
						$('#progressBarImprt').hide();
						$('#imprtFiles').find('*').prop('disabled',true)
					
				
			startDownload : ->
				syncController = App.request "get:sync:controller"
				syncController.getDownloadURL()
				
			startImport : ->
				syncController = App.request "get:sync:controller"
				syncController.readUnzipFile1()

			generateZipFile : ->
				$('#generateFileLoader').css("display", "block")

				_.convertDataToCSV()
					


				
				

