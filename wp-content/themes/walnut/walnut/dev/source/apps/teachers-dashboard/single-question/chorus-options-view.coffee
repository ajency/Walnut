define ['app'
		'text!apps/teachers-dashboard/single-question/templates/chorus-options-template.html'],(App,chorusOptionsTemplate)->

	App.module "TeachersDashboardApp.View.ChorusOptionsView",(ChorusOptionsView, App)->		

		class ChorusOptionsView.ItemView extends Marionette.ItemView

			className: 'studentList m-t-35'

			template : chorusOptionsTemplate


	