define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync1.html'], (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSync1Controller extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()

				@show view, (loading: true)



			_getAppSyncView : ->
				new AppSyncView
					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl

			events :
				'click #syncNow' : 'startSyncProcess'
				



			onShow : ->
				_.checkSynapseAssetsDirectory()
				# Hide breadcrumb region 
				App.breadcrumbRegion.close()

				# Hide the splash screen image
				navigator.splashscreen.hide()

				# Display total records to be synced for file upload
				recordsToBeSynced = _.getTotalRecordsTobeSynced()
				recordsToBeSynced.done (count)->
					switch count
						when 0
							$('#totalRecordsToBeSynced').text('Data already upto date')
							$('#lastSyncUploadDetails').css("display", "none")
							$('#last5uploads').css("display", "none")
							$('#upSync1').css("display", "none")
						else
							$('#totalRecordsToBeSynced').text(count+' record(s) to be synced')
							$('#last5uploads').css("display", "none") #for now
							$('#upSync1').css("display", "block")
							$('#lastSyncUploadDetails').css("display", "none")

					

			startSyncProcess : ->
				if _.isOnline()
					App.navigate('sync3', trigger: true)
				else
					$('#NetwrkCnctnDwnld').css("display", "block");
				




				
				

