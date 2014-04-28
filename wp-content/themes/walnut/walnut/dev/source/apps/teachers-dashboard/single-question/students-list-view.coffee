define ['app'],(App)->

	App.module "TeachersDashboardApp.View.StudentsList",(StudentsList, App)->		


		class StudentsItemView extends Marionette.ItemView

			className: 'col-sm-3 m-b-20'

			template: '<div class="row single tiles white no-margin" data-id="{{ID}}">    
			                <div class="col-md-8 col-xs-8 no-padding">
			                  <div class="text-center">
			                    <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">{{display_name}}</span> </h4>
			                    <div class="clearfix"></div>
			                  </div>
			                </div>
							 <div class="col-md-4 col-xs-4 no-padding">
			                  <div class="tiles default active">
			                  	<div class="user-profile-pic text-left m-t-0 p-t-10"> 
								<img data-src-retina="{{profile_pic}}" data-src="{{profile_pic}}" src="{{profile_pic}}" alt="">
							  </div>
			                    <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-minus-circle"></i></div>
			                  </div>
			                </div>
			            </div>'

		class StudentsEmptyView extends Marionette.ItemView

			template: '<div class="row single tiles white no-margin">    
			                <div class="col-md-8 col-xs-8 no-padding">
			                  <div class="text-center">
			                    <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">No Students in Class</h4>
			                    <div class="clearfix"></div>
			                  </div>
			                </div>
			            </div>'

			onShow:->
				console.log 'empty view'

		class StudentsList.List extends Marionette.CompositeView

			className: 'studentList m-t-35'
				
			template : '<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10">
							<button type="button" class="btn btn-primary btn-xs btn-sm">
								<i class="fa fa-check"></i> Done 
							</button>
						</div>
						<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10 m-r-20">
							<button type="button" class="btn btn-primary btn-xs btn-sm m-r-10" id="right-answer">
								<i class="fa fa-check-circle"></i> Right Answer
							</button> 
							<button type="button" class="btn btn-danger btn-xs btn-sm" id="wrong-answer">
								<i class="fa fa-times-circle"></i> Wrong Answer
							</button>
						</div>
						<div class="clearfix"></div>
						<div class="row students m-t-20" id="students-list"></div>'

			itemViewContainer : '#students-list'

			itemView : StudentsItemView

			emptyView: StudentsEmptyView

			events:
				'click .tiles.single'	: 'selectStudent'
				'click #right-answer'	: 'markAsCorrectAnswer'
				'click #wrong-answer'	: 'markAsWrongAnswer'

			onShow:->
				@correctAnswers = []

			selectStudent:(e)->
				$(e.target).closest('.tiles.single').toggleClass "selected"

			markAsCorrectAnswer:->
				selectedStudents = @$el.find '.tiles.single.selected'

				for student in selectedStudents
					@correctAnswers = _.union @correctAnswers, parseInt $(student).attr 'data-id'
					$(student).removeClass 'selected'
					.find '.default'
					.removeClass 'default'
					.addClass 'green'
					.find 'i'
					.removeClass 'fa-minus-circle'
					.addClass 'fa-check-circle'
				
				console.log _.uniq @correctAnswers

				@trigger "save:question:response"

			markAsWrongAnswer:->
				selectedStudents = @$el.find '.tiles.single.selected'

				for student in selectedStudents
					@correctAnswers = _.without @correctAnswers, parseInt $(student).attr 'data-id'
					$(student).removeClass 'selected'
					.find '.green'
					.removeClass 'green'
					.addClass 'default'
					.find 'i'
					.removeClass 'fa-check-circle'
					.addClass 'fa-minus-circle'
				
				console.log @correctAnswers

				@trigger "save:question:response"


