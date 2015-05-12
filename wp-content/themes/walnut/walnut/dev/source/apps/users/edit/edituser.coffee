define ['app',
		'text!apps/users/edit/templates/add-user.html'], (App,addUserTpl)->
	App.module "UsersApp.Edit.Views", (Views)-> 
		class Views.EditUser extends Marionette.ItemView
			className : 'grid simple vertical green animated fadeIn'
			template: addUserTpl
			events :->
				'click #save-user' : 'save_user'
				
			onShow:->
				Backbone.Syphon.deserialize @, @model.toJSON()

			save_user:(e)->
				@$el.find '#saved-success'
				.html ''
				.removeClass 'alert alert-danger';
				
				e.preventDefault()
				
				if @$el.find('form').valid()

					@$el.find '#save-user i'
					.addClass 'fa-spin fa-spinner'

					data = Backbone.Syphon.serialize (@)
					data.user_role = 'parent'
					@model.save(data, { wait : true, success : @successFn, error : @errorFn })
					
			successFn:(model,resp)=>
				@$el.find '#save-user i'
				.removeClass 'fa-spin fa-spinner'
				
				if resp.code is 'OK'
					App.navigate "#/parents/edited/#{@model.id}"
				else
					@$el.find '#saved-success'
					.addClass 'alert alert-danger'
					.html resp.message
				
			errorFn:(resp)=>
				@$el.find '#save-user i'
				.removeClass 'fa-spin fa-spinner'
