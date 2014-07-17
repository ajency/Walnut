define ['underscore'], ( _) ->

	#Functions related to menu entity

	_.mixin

		getAppMenuItems : ->

			runFunc = ->
				$.Deferred (d)->

					lastSyncOperation = _.getLastSyncOperation()
					lastSyncOperation.done (typeOfOperation)->
						
						if typeOfOperation is 'file_import'
							
							data = [{"ID":92,"menu-order":4,"post_title":"Training Module"
									,"menu_item_link":"#","menu_id":null
									,"submenu":[{"ID":93,"menu-order":6,"post_title":"Teacher Training"
									,"menu_item_link":"#teachers/dashboard","menu_id":null}]}
									,{"ID":95,"menu-order":1,"post_title":"Data Synchronization"
									,"menu_item_link":"#","menu_id":null
									,"submenu":[{"ID":96,"menu-order":2,"post_title":"Sync"
									,"menu_item_link":"#sync","menu_id":null}]}]

						else
							data = [{"ID":95,"menu-order":1,"post_title":"Data Synchronization"
									,"menu_item_link":"#","menu_id":null
									,"submenu":[{"ID":96,"menu-order":2,"post_title":"Sync"
									,"menu_item_link":"#sync","menu_id":null}]}]


						d.resolve data

			$.when(runFunc()).done ->
				console.log 'getAppMenuItems done'
			.fail _.failureHandler