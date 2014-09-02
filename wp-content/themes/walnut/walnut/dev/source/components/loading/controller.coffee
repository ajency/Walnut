define [
		'app'
		'controllers/region-controller'
		'components/loading/view'

	], (App, RegionController, LoadingView)->

		class LoadingController extends RegionController

			initialize: (options) ->
				{ view, config } = options
		
				config = if _.isBoolean(config) then {} else config
				
				_.defaults config,
					loadingType: "spinner"
					entities: @getEntities(view)
					debug: false

				switch config.loadingType
					when "opacity"
						@region.currentView.$el.css "opacity", 0.5
					when "spinner"
						loadingView = @getLoadingView()
						@show loadingView
					else
						throw new Error("Invalid loadingType")
				
				@showRealView view, loadingView, config

		
			showRealView: (realView, loadingView, config) ->

				callbackFn = _.debounce ()=>
					
					switch config.loadingType
						when "opacity"
							@region.currentView.$el.removeAttr "style"
						when "spinner"
							return realView.close() if @region and @region.currentView isnt loadingView


					if not config.debug
						@show realView
						realView.triggerMethod "dependencies:fetched" 
				, 10

				App.commands.execute "when:fetched", config.entities, callbackFn
					
			
			getEntities: (view) ->
				_.chain(view).pick("model", "collection").toArray().compact().value()
		
			
			getLoadingView: ->
				new LoadingView


		App.commands.setHandler "show:loading", (view, options) ->
			
			new LoadingController
				view: view
				region: options.region
				config: options.loading