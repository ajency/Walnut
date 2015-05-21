define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync.html']
		, (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSyncController extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()

				@show view


			_getAppSyncView : ->
				new AppSyncView
					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl

			events :
				'change #storageOption' : 'selectStorageOption'

				'click #syncStartContinue' : 'startContinueSyncProcess'

				'click #syncMediaStart' : 'startMediaSyncProcess'
				


			onShow : ->

				# Hide breadcrumb region
				App.breadcrumbRegion.close()
				
				#Disable Selectbox StorageOption
				$('#storageOption').prop("disabled",false)

				_.getDeviceStorageOptions()
				.then (storageOptions)->
					value = _.getStorageOption()
					option = JSON.parse(value)

					if _.isNull(option)
						$("#storageOption").append('<option selected>
							Select your storage option</option>');
						$('#syncStartContinue').prop("disabled",true)
						$('#syncMediaStart').prop("disabled",true)

					else
						# $("#storageOption").append('<option>
						# 	Select your storage option</option>');
						$('#syncStartContinue').prop("disabled",false)

					
					if storageOptions.External
						
						internalPath = storageOptions.Internal
						externalPath = storageOptions.External

						if not _.isNull(option) and option.internal
							$("#storageOption").append('<option selected 
								value="'+internalPath+'">Internal Path :"'+internalPath+'"</option>');
							$("#storageOption").append('<option 
								value="'+externalPath+'">External Path :"'+externalPath+'"</option>');

						else if not _.isNull(option) and option.external
							$("#storageOption").append('<option 
								value="'+internalPath+'">Internal Path :"'+internalPath+'"</option>');
							$("#storageOption").append('<option selected
								value="'+externalPath+'">External Path :"'+externalPath+'"</option>');

						else 
							$("#storageOption").append('<option
								value="'+internalPath+'">Internal Path :"'+internalPath+'"</option>');
							$("#storageOption").append('<option 
								value="'+externalPath+'">External Path :"'+externalPath+'"</option>');


					else
						internalPath = storageOptions.Internal
						
						if not _.isNull(option) and option.internal
							$("#storageOption").append('<option selected 
								value="'+internalPath+'">Internal Path :"'+internalPath+'"</option>');
						else
							$("#storageOption").append('<option 
								value="'+internalPath+'">Internal Path :"'+internalPath+'"</option>');
						
						# $("#storageOption option[value='external']").remove();
						# $("#storageOption").removeOption("external");

				
				_.cordovaHideSplashscreen()
				_.disableCordovaBackbuttonNavigation()
				
				# Display app version number
				cordova.getAppVersion()
				.then (version)->
					if AJAXURL.indexOf("http://synapselearning") is 0
						appInfo = "Version: Production - #{version}"
					else if AJAXURL.indexOf("http://synapsedu") is 0
						appInfo = "Version: Development - #{version}"
					$('#app-version').text appInfo
				
				# Invoke synchronization controller
				App.request "get:sync:controller"


			selectStorageOption : ->

				storagePathValue = $("#storageOption").val();
				storagePath = $( "#storageOption option:selected" ).text();
				
				if storagePath.indexOf('Internal') is 0
					localStoragePath = { internal : storagePathValue}
				else
					localStoragePath = { external : storagePathValue}
				
				_.setStorageOption(localStoragePath);
				
				
				_.setSynapseMediaDirectoryPathToLocalStorage()
				.then (path)->
					# $('#storageOption').prop("disabled",true)
					# _.setSynapseMediaDirectoryPath(path)
					
					$('#syncStartContinue').prop("disabled",false)
					console.log 'setSynapseMediaDirectoryPathToLocalStorage done'



			startContinueSyncProcess : ->

				if _.isOnline()
					@connectionErrorMessage false
					syncController = App.request "get:sync:controller"
					syncController.startContinueDataSyncProcess()
				else
					@connectionErrorMessage true


			startMediaSyncProcess : ->

				if _.isOnline()
					@connectionErrorMessage false
					syncController = App.request "get:sync:controller"
					syncController.startMediaSyncProcess()
				else
					@connectionErrorMessage true

			
			connectionErrorMessage : (display)->

				if display
					$('#syncInternetConnection').css("display", "block").addClass("shake")
					setTimeout(=>
						$('#syncInternetConnection').removeClass("shake")
					,1000)

				else $('#syncInternetConnection').css("display", "none")

				