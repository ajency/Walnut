define ['app'
        'controllers/region-controller',
        'text!apps/quiz-modules/view-single-quiz/templates/quiz-layout.html'], 
(App, RegionController,quizLayoutTpl)->

	App.module "QuizModuleApp.ViewQuiz.LayoutView", (LayoutView, App)->

		class LayoutView.QuizViewLayout extends Marionette.Layout

			template: quizLayoutTpl

			regions:
				attemptsRegion: '#attempts-region'
				quizDetailsRegion: '#quiz-details-region'
				contentDisplayRegion: '#content-display-region'

			mixinTemplateHelpers:(data)->

				display_mode = Marionette.getOption @, 'display_mode'
				studentTrainingModule = Marionette.getOption @, 'studentTrainingModule'
				
				if studentTrainingModule
					data.studentTrainingModule = true
				
				if display_mode is 'quiz_report'
					student = Marionette.getOption @, 'student'
					data.studentName    = student.get 'display_name'
					data.rollNumber     = student.get 'roll_no'
					data.quiz_report    = true 

				data.practice_mode=true if @model.get('quiz_type') is 'practice'

				data
				
			events:->
				'click .continue-student-training-module' :-> @trigger "goto:next:item:student:training:module"