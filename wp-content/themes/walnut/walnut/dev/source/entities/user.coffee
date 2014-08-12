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


				current_user_can:(capability)->
					all_capabilites = @.get 'allcaps'
					if all_capabilites[capability] then return true else return false

			loggedInUser = new Users.UserModel
			loggedInUser.set USER if USER?
			

			class UserCollection extends Backbone.Collection

				model : Users.UserModel

				url : -> #ajax call to return a list of all the users from the databse
					AJAXURL + '?action=get-users'


			# declare a user collection instance
			
			

			# API
			API =

				getUsers:(params={})-> #returns a collection of users
					userCollection = new UserCollection
					userCollection.fetch
						data : params

					userCollection

			App.reqres.setHandler "get:user:model", ->
				loggedInUser	

			App.reqres.setHandler "get:loggedin:user:id", ->
				loggedInUser.get 'ID'

			App.reqres.setHandler "get:user:collection",(opts) ->
				API.getUsers opts