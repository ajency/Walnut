define ['app'
		'controllers/region-controller'
		'text!apps/teachers-dashboard/teacher-teaching-module/module-description/templates/module-description-template.html'], (App, RegionController,moduleDescriptionTemplate)->

	App.module "TeacherTeachingApp.ModuleDescription", (ModuleDescription, App)->

		class ModuleDescriptionController extends RegionController

			initialize : (opts)->
				{model} = opts

				@view= view = @_showModuleDescriptionView model

				@show view


			_showModuleDescriptionView :(model) =>
				new ModuleDescriptionView
					model 			: model
								
	
		class ModuleDescriptionView extends Marionette.ItemView

			className: 'pieceWrapper'

			template : moduleDescriptionTemplate


			onShow:->
				clock = setInterval @updateTime, 500		

			updateTime :=>
				if _.size($('#timekeeper')) >0
					@$el.find '.timedisplay'
					.html '<i class="fa fa-clock-o"></i> '+ $('#timekeeper').html()



		# set handlers
		App.commands.setHandler "show:teacher:teaching:module:description", (opt = {})->
			new ModuleDescriptionController opt	