define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync.html'], (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSyncController extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()

				@show view, (loading: true)


			_getAppSyncView : ->
				new AppSyncView
					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl

			className : ''

			events :
				'click #syncNow' : 'startSyncProcess'

			onShow : ->
				$('#syncText').text('')
					

			startSyncProcess : ->
				alert "uol"
				console.log "uhi"
				_.PageLoading()
				$('i').addClass('fa-spin')
				$('#syncText').text('Syncing now...')	
				
				

