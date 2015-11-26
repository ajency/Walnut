define ['app'
        'controllers/region-controller'], (App, RegionController)->
	App.module "NoPermissions.Controller", (Controller, App)->
		class Controller.NoPermissionsController extends RegionController

			initialize :(opts) ->

				{@error_msg,@error_header,is404} = opts

				@view = view = @_getNoPermissionsView()
				@show view
				if is404
					@error_msg = '404'
					@error_header= "Page not found"

				@view = view = @_getNoPermissionsView()
				@show view
				
			_getNoPermissionsView :->
				new NoPermissionsView 
					error_header : @error_header
					error_msg    : @error_msg

		class NoPermissionsView extends Marionette.ItemView

			template : '<div class="tiles white grid simple vertical green animated slideInRight">
							<div class="grid-title no-border">
								{{error_header}}
							</div>
							<div style="overflow: hidden; display: block;" class="grid-body no-border">
								<div class="row ">
								  <div class="col-md-8">
										{{error_msg}}
									</div>
								</div>
							</div>
					  </div>'

			mixinTemplateHelpers:(data)->

				error_msg       = Marionette.getOption @, 'error_msg'
				error_header    = Marionette.getOption @, 'error_header'

				data.error_header = if error_header then error_header else 'Forbidden Access'
				data.error_msg = if error_msg then error_msg else 'You do not have access to this section'

				data


		# set handlers
		App.commands.setHandler "show:no:permissions:app", (opt = {})->
			new Controller.NoPermissionsController opt

		# set handlers
		App.commands.setHandler "show:404:app", (opt = {})->
			opt.is404=true
			new Controller.NoPermissionsController opt