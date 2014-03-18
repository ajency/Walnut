define ["marionette"
		"app"], (Marionette, App) ->

	class RegionController extends Marionette.Controller
		
		constructor: (options = {}) ->
			@region = options.region or App.request "default:region"
			#App.execute "register:instance", @, @_instance_id
			@_instance_id = _.uniqueId("controller")
			App.commands.execute "register:instance", @, @_instance_id
			super options


		close: (args...) ->
			delete @region
			delete @options
			App.commands.execute "unregister:instance", @, @_instance_id
			super args

		
		show: (view, options = {}) ->
			_.defaults options,
				loading: false
				region: @region

			@_setMainView view
			@_manageView view, options

		
		_setMainView: (view) ->

			return if @_mainView
			@_mainView = view
			@listenTo view, "close", @close

		
		_manageView: (view, options) ->
			if options.loading
				App.commands.execute "show:loading", view, options
			else
				options.region.show view
