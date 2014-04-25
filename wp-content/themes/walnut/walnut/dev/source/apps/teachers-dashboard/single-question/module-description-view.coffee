define ['app'
		'text!apps/teachers-dashboard/single-question/templates/module-description-template.html'],(App,moduleDescriptionTemplate)->

	App.module "TeachersDashboardApp.View.ModuleDescription",(ModuleDescription, App)->		

		class ModuleDescription.Description extends Marionette.ItemView

			className: 'pieceWrapper'

			template : moduleDescriptionTemplate


			onShow:->
				clock = setInterval @updateTime, 500		

			updateTime :=>
				@$el.find '.timedisplay'
				.html '<i class="fa fa-clock-o"></i> '+ $('#timekeeper').html()


	