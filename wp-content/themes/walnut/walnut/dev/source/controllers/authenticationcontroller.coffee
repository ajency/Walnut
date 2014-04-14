define ["marionette","app", "underscore"], (Marionette, App, _) ->
	#Controls login authentication based on platform

	class AuthenticationController extends Marionette.Controller

		initialize : (options)->

			{@data, @success} = options

			@platform = _.checkPlatform()

			@isOnline = _.isOnline()

		authenticate:->

			switch @platform
				when 'Desktop'
					if @isOnline
						@onlineAuth()
					
					else
						response =
							error : 'Connection could not be established. Please try again.'
						@success response	

				when 'Mobile'
					if @isOfflineLoginEnabled()
						@offlineMobileAuth(@success, @data)	
					
					else
						if @isOnline
							@onlineMobileAuth(@success, @inputNewUser, @updateExistingUserPassword)
						else
							response = 
								error : 'Connection could not be established. Please try again.'
							@success response	


		onlineAuth:->
			$.post AJAXURL + '?action=get-user-profile', @data, @success, 'json'


		isOfflineLoginEnabled:->
			if($('#checkbox2').is(':checked'))
				true
			else false


		onlineMobileAuth:(successFn, inputNewUser, updateExistingUserPassword)->
			$.post AJAXURL + '?action=get-user-profile', @data,

				   success: (resp)=>
				   		if resp.error
				   			response = 
				   				error : resp.error
				   			successFn response	
				   	
				   		else
				   			response = 
				   				success : true
				   			successFn response

				   			user = @isExistingUser(@data.txtusername)
				   			user.done (d)->
				   				if d.exists is true
				   					updateExistingUserPassword()
				   				else 
				   					inputNewUser()
				   	 
				   'json'




		offlineMobileAuth:(successFn, data)->
			user = @isExistingUser(data.txtusername)
			user.done (d)->
				if d.exists is true
					if d.password is data.txtpassword
						response = 
							success : true
						successFn response

					else
						response = 
							error : 'Invalid Password'
						successFn response		

				else
					response = 
						error : 'No such user has previously logged in.'
					successFn response
						


		isExistingUser:(username)->
			data = 
				exists: false
				password: ''

			runQuery = ->
				$.Deferred (d)->
					_.userDb.transaction (tx)->
						tx.executeSql("SELECT * FROM USERS", [], onSuccess(d), onFailure(d))

			onSuccess = (d)->
				(tx,data)->
					i=0
					while i < data.rows.length
						r = data.rows.item(i)
						if r['username'] is username
							data.exists = true
							data.password = r['password']
						i++

					d.resolve(data)	
				
			onFailure = (d)->
				(tx,error)->
					d.reject('OnFailure!: '+error)

			$.when(runQuery()).done (data)->
				console.log 'isExistingUser transaction completed'
			.fail (err)->
				console.log 'Error: '+err	


		
		inputNewUser:->
			_.userDb.transaction((tx)->

				tx.executeSql('INSERT INTO USERS (username, password, last_loggedin) VALUES (?, ? ,?)',[@data.txtusername, @data.txtpassword, _.getDateTime()])

			,(tx,err)->
				console.log 'Error: '+err 
			,(tx)->
				console.log 'Success: Inserted new user'
			)


		updateExistingUserPassword:->
			_.userDb.transaction((tx)->

				tx.executeSql("UPDATE USERS SET password=? where username=?",[ @data.txtpassword, @data.txtusername])

			,(tx,err)->
				console.log 'Error: '+err 
			,(tx)->
				console.log 'Success: Updated user password'
			)	



 	# request handler
 	App.reqres.setHandler "get:auth:controller",(options)->
 		new AuthenticationController options


