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
			

			class UserCollection extends  Backbone.Collection

				model : Users.UserModel
				name: 'user'

				url : -> #ajax call to return a list of all the users from the databse
					AJAXURL + '?action=get-users'


			# offline user collection instance
			class OfflineUserCollection extends Backbone.Collection

				model : Users.UserModel
				name: 'offlineUsers'
			
			

			# API
			API =
				getUsers:(params={})-> #returns a collection of users
					userCollection = new UserCollection
					userCollection.fetch
						data : params

					userCollection


				# get offline users for Synapse App
				getOfflineUsers:->
					offlineUsers = new OfflineUserCollection
					offlineUsers.fetch()
					offlineUsers


			App.reqres.setHandler "get:user:model", ->
				user	

			App.reqres.setHandler "get:user:collection",(opts) ->
				API.getUsers opts

			
			# Request handler to get logged-in users from local database
			App.reqres.setHandler "get:offline:user:collection", ->
				API.getOfflineUsers()