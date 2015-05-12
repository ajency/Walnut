define ['app'], (App)->
	App.module "UsersApp.List.Views", (Views)-> 
		class Views.UsersItemView extends Marionette.ItemView
			tagName : 'tr'
			className: 'gradeX odd'
			template: ' <td>{{display_name}}</td>
						<td>{{user_email}}</td>
						<td><a href="#edit-parent/{{ID}}">Edit</a></td>'
						
			mixinTemplateHelpers:(data)->
				roles = _.flatten data.role
				data.user_role =_.str.titleize _.str.humanize _.first roles
				data
				
			onShow:->
				editedID = Marionette.getOption @, 'editedID'
				@$el.addClass 'alert-success' if @model.id is parseInt editedID