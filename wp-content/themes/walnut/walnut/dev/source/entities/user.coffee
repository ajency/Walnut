define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.Users", (Users, App, Backbone, Marionette, $, _)->

			# User model
			class Users.UserModel extends Backbone.Model

				name: 'user'

				defaults : ->
					display_name 	: ''
					user_email 		: ''
					role 			: []
					profile_pic 	: ''

			user = new Users.UserModel
			

			class UserCollection extends Backbone.Collection

				model : Users.UserModel

				url : -> #ajax call to return a list of all the users from the databse
					AJAXURL + '?action=get-users'


			# declare a user collection instance
			userCollection = new UserCollection
			

			# API
			API =
				getUsers:(params={})-> #returns a collection of users

					userCollection.fetch
						data : params

					userCollection




			App.reqres.setHandler "get:user:model", ->
				user	

			App.reqres.setHandler "get:user:collection",(opts) ->
				API.getUsers opts