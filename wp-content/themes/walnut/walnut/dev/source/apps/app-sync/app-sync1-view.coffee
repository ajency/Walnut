define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync1.html'], (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSync1Controller extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()

				# listen to the close event of the view
				@listenTo view, 'close', ->
					App.navigate('teachers/dashboard', trigger: true)

				App.commands.setHandler "close:sync:view", =>
					@view.close()	

				@show view, (loading: true)



			_getAppSyncView : ->
				new AppSyncView

					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl

			events :
				'click #JsonToCSV' : 'startConversion'
				'click #syncNow' : 'startSyncProcess'
				'click #CSVupload' : 'fileUpload'



			onShow : ->
				# Hide the splash screen image
				navigator.splashscreen.hide()
				syncDetailsCount = _.getTotalSyncDetailsCount()
				syncDetailsCount.done (count)->
					if count is 0
						$('#syncDateDwnld').text("--/--/--")
						$('#syncTimeDwnld').text("--:--")
						$('#syncDateUpld').text("--/--/--")
						$('#syncTimeUpld').text("--:--")
						$('#last5dwnlds').attr("disabled","disabled")
						$("#UploadView *").attr("disabled", "disabled").off('click')
						# syncController = App.request "get:sync:controller"
						# syncController.totalRecordsUpdate()
						

					else
						App.navigate('teachers/dashboard', trigger: true)
				
				# $('#syncText').text('')
				# if _.getInitialSyncFlag() is null
				# 	$('#JsonToCSV').attr("disabled","disabled")
					syncController = App.request "get:sync:controller"
					syncController.totalRecordsUpdate()

				# else
				# 	$('#JsonToCSV').removeAttr("disabled")
				# 	$('#CSVupload').attr("disabled","disabled")
				# 	$('#syncNow').attr("disabled","disabled")
				# 	syncController = App.request "get:sync:controller"
				# 	syncController.totalRecordsUpdate()

				

			fileUpload : ->
				syncController = App.request "get:sync:controller"
				syncController.getuploadURL()
				
			
			startConversion : ->
				# syncController = App.request "get:sync:controller"
				# syncController.selectRecords()
				

					

			startSyncProcess : ->
				if _.isOnline()
					alert "go"
					App.navigate('sync3', trigger: true)
				else
					$('#NetwrkCnctnDwnld').css("display", "block");
				# $('i').addClass('fa-spin')
				# $('#syncText').text('Syncing now...')

				# syncController = App.request "get:sync:controller"
				# syncController.startSync()


				
				

