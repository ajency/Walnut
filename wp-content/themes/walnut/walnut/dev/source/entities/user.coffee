define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.Users", (Users, App, Backbone, Marionette, $, _)->

			# User model
			class Users.UserModel extends Backbone.Model

				name: 'user'

				defaults : ->
					user_name 		: ''
					display_name 	: ''
					user_email 		: ''

			user = new Users.UserModel
			
			App.reqres.setHandler "get:user:model", ->
				user		