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
				name: 'user'

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

				#get users from local database	
				getUsersFromLocal:(division)->

					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT * FROM wp_users u INNER JOIN wp_usermeta um 
									ON u.ID=um.user_id AND um.meta_key='student_division' AND um.meta_value=?", [division], onSuccess(d), _.deferredErrorHandler(d));
								

					onSuccess =(d)->
						(tx,data)->
							result = []
							i = 0
							while i < data.rows.length
								row = data.rows.item(i)
								
								result[i] = 
									ID: row['ID']
									display_name: row['display_name']
									user_email: row['user_email']
									profile_pic: ''

								i++	
		
							d.resolve(result)

					$.when(runQuery()).done (data)->
						console.log 'getUsersFromLocal transaction completed'
					.fail _.failureHandler



			App.reqres.setHandler "get:user:model", ->
				user	

			App.reqres.setHandler "get:user:collection",(opts) ->
				API.getUsers opts

			# request handler to get users from local database
			App.reqres.setHandler "get:user:by:division:local",(division) ->
				API.getUsersFromLocal division