define ['app'
		'controllers/region-controller'
		'text!apps/teachers-dashboard/dashboard/templates/teachers-dashboard.html'
		], (App, RegionController,teachersDashboardTpl)->

	App.module "TeachersDashboardApp.View", (View, App)->

		class View.DashboardController extends RegionController

			initialize :->

				divisionsCollection = App.request "get:divisions"

				breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'}
					]

				App.execute "update:breadcrumb:model", breadcrumb_items

				@view = view = @_getTeachersDashboardView divisionsCollection

				@show view, (loading: true)
				


			_getTeachersDashboardView :(divisions) ->
				new TeachersDashboardView
					collection:	divisions



		class TeachersDashboardView extends Marionette.ItemView

			template 	: teachersDashboardTpl

			className 	: 'row'

			events 		:
				'change #class' : (e)-> @loadDivisions $(e.target).val()
				'click .submit-btn': 'onSubmitClicked'


			onShow:->

				console.log @collection
				class_ids = @collection.pluck 'class_id'

				class_ids = _.uniq class_ids

				unique_classes = []

				for c_id in class_ids
					unique_classes.push @collection.findWhere({'class_id': c_id})

				classes_dropdown = ''

				for c in unique_classes
					classes_dropdown += '<option value="'+c.get('class_id')+'">'+c.get('class_label')+'</option>'

				@$el.find '#class, #class-training'
				.append classes_dropdown

				@loadDivisions class_ids[0]

				@$el.find '#teacherOptns a' 
				.click (e)->
					e.preventDefault()
					$(@).tab 'show'

				if _.platform() is "BROWSER"
					$('#class, #div, #class-training')
					.select2()

				if _.platform() is "DEVICE"

					# Set 'SynapseMedia' directory path to local storage
					_.setSynapseMediaDirectoryPathToLocalStorage()
					
					# Hide the splash screen image
					navigator.splashscreen.hide()

					# Cordova app navigation
					_.appNavigation()



			loadDivisions:(class_id)=>

				class_id = parseInt class_id

				divs= @collection.where({'class_id':class_id})
				
				if _.platform() is "BROWSER"
					@$el.find '#div'
					.empty()
					.select2('data', null)
				else
					@$el.find '#div'
					.empty()

				for div in divs
					@$el.find '#div'
					.append '<option value="'+div.get('id')+'">'+div.get('division')+'</option>'


			onSubmitClicked:(e)->

				if $(e.target).val() is 'take-class'
					class_id= @$el.find('#class').val()
					div_id= @$el.find('#div').val()
					App.navigate('teachers/take-class/'+class_id+'/'+div_id, trigger: true)

				if $(e.target).val() is 'start-training'
					class_id= @$el.find('#class-training').val()
					App.navigate('teachers/start-training/'+class_id, trigger: true)