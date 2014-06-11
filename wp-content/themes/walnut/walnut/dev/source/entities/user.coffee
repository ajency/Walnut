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
			class LocalUserCollection extends Backbone.Collection

				model : Users.UserModel
				name: 'offlineUsers'
			
			

			# API
			API =
				getUsers:(params={})-> #returns a collection of users
					userCollection = new UserCollection
					userCollection.fetch
						data : params

					userCollection
					

				#get students from local database	
				getUsersFromLocal:(division)->

					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT * FROM wp_users u INNER JOIN wp_usermeta um 
									ON u.ID=um.user_id AND um.meta_key='student_division' AND um.meta_value=?", [division], onSuccess(d), _.deferredErrorHandler(d));
								

					onSuccess =(d)->
						(tx,data)->

							result = []

							for i in [0..data.rows.length-1] by 1

								row = data.rows.item(i)
								
								result[i] = 
									ID: row['ID']
									display_name: row['display_name']
									user_email: row['user_email']
									profile_pic: ''
		
							d.resolve(result)

					$.when(runQuery()).done (data)->
						console.log 'getUsersFromLocal transaction completed'
					.fail _.failureHandler


				# get logged in users list
				getLoggedinUsers:->
					offlineUsers = new LocalUserCollection
					offlineUsers.fetch()
					offlineUsers
					

				# get logged in users from local database
				getOfflineUSersFromLocal:->

					runQuery =->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT username FROM USERS", [], onSuccess(d), _.deferredErrorHandler(d))

					onSuccess =(d)->
						(tx, data)->

							result = []

							for i in [0..data.rows.length-1] by 1

								result[i] = 
									username: data.rows.item(i)['username']

							d.resolve(result)

					$.when(runQuery()).done ->
						console.log 'getOfflineUSersFromLocal transaction completed'
					.fail _.failureHandler	




			App.reqres.setHandler "get:user:model", ->
				user	

			App.reqres.setHandler "get:user:collection",(opts) ->
				API.getUsers opts

			# request handler to get users from local database
			App.reqres.setHandler "get:user:by:division:local",(division) ->
				API.getUsersFromLocal division

			App.reqres.setHandler "get:loggedin:user:collection", ->
				API.getLoggedinUsers()

			App.reqres.setHandler "get:offlineUsers:local", ->
				API.getOfflineUSersFromLocal()		


			