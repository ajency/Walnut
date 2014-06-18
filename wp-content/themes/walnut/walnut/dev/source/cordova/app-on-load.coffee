define ['underscore', 'jquery', 'fastclick'], (_, $, FastClick)->

    
    # Cordova device ready event

    onDeviceReady = ->

    	# Open pre-populated SQLite database file.
    	_.cordovaOpenPrepopulatedDatabase()

    	# 'FastClick' helps to reduce the 400ms click delay.
    	FastClick.attach(document.body)
       

    
    document.addEventListener("deviceready", onDeviceReady, false)