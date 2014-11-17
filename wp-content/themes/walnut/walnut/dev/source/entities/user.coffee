define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.Users", (Users, App, Backbone, Marionette, $, _)->

			# User model
			class Users.UserModel extends Backbone.Model

				name: 'user'

				idAttribute : 'ID'

				defaults : ->
					display_name 	: ''
					user_email 		: ''
					role 			: []
					profile_pic 	: ''

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

				getUserByID:(id)-> #returns a collection of users
					
					user = new Users.UserModel ('ID': id)
					user.fetch()
					
					user


				getStudentsByDivision:(division)-> #returns a collection of users
					
					stud_data = 
						'role' : 'student'
						'division' : division

					students = new UserCollection
					students.fetch
						data : stud_data

					students

				getUserData:(key)->
					data=loggedInUser.get 'data'
					console.log data[key]
					data[key]

				current_user_can:(capability)->
					all_capabilites = loggedInUser.get 'allcaps'
					if all_capabilites[capability] then return true else return false

				getDummyStudents:->
					userCollection = new UserCollection
					students= [
						{
							ID 				: 2343424
							display_name 	: 'Dummy Student 1'
							user_email 		: 'dummystudent1@mailinator.com'
						},
						{
							ID 				: 2343434
							display_name 	: 'Dummy Student 2'
							user_email 		: 'dummystudent2@mailinator.com'
						},
						{
							ID 				: 23434234
							display_name 	: 'Dummy Student 3'
							user_email 		: 'dummystudent3@mailinator.com'
						},
						{
							ID 				: 2343423432
							display_name 	: 'Dummy Student 4'
							user_email 		: 'dummystudent4@mailinator.com'
						},
						{
							ID 				: 2343432342
							display_name 	: 'Dummy Student 5'
							user_email 		: 'dummystudent5@mailinator.com'
						},
					]

					userCollection.set students
					userCollection


			App.reqres.setHandler "get:user:model", ->
				loggedInUser	

			App.reqres.setHandler "get:loggedin:user:id", ->
				parseInt loggedInUser.get 'ID'

			App.reqres.setHandler "get:user:collection",(opts) ->
				API.getUsers opts

			App.reqres.setHandler "get:students:by:division",(division)->
				API.getStudentsByDivision division

			App.reqres.setHandler "get:user:data",(key)->
				API.getUserData key

			App.reqres.setHandler "get:dummy:students",->
				API.getDummyStudents()

			App.reqres.setHandler "get:user:by:id",(id) ->
				API.getUserByID id

			App.reqres.setHandler "current:user:can",(capability) ->
				API.current_user_can capability
