define ["marionette","app", "underscore", "csvparse"], (Marionette, App, _, parse) ->

	class SynchronizationController extends Marionette.Controller

		initialize : ->


		startSync : ->
			console.log 'Started Controller'
			@error()

		error: ->
				
				






	# request handler
 	App.reqres.setHandler "get:sync:controller", ->
 		new SynchronizationController