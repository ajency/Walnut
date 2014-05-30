define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync3.html'], (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSync3Controller extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()
				

				@show view, (loading: true)



			_getAppSyncView : ->
				new AppSyncView

					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl

			events :
				'click #DownloadNow' : 'startDownload'
				'click #importNow' : 'startImport'


			


			onShow : ->
				navigator.splashscreen.hide()
				syncDetailsCount = _.getTotalSyncDetailsCount()
				syncDetailsCount.done (count)->
					if count is 0
						$('#imprtDateTime').hide();
						$('#progressBarDwnld').hide();
						$('#progressBarImprt').hide();
						$('#progressBarUpld').hide();
						$("#imprtFiles *").attr("disabled", "disabled").off('click')
						$("#syncUpld3 *").attr("disabled", "disabled").off('click')
						 


						# syncController = App.request "get:sync:controller"
						# syncController.dwnldUnZip()
						

					else
						App.navigate('teachers/dashboard', trigger: true)
				
			startDownload : ->
				syncController = App.request "get:sync:controller"
				syncController.dwnldUnZip()
				
			startImport : ->
				syncController = App.request "get:sync:controller"
				syncController.readUnzipFile1()


				
				

