define ['underscore', 'jquery', 'fastclick'], (_, $, FastClick)->

    
    #Cordova device ready event

    document.addEventListener("deviceready", =>
       
       #Open pre-populated SQLite database file.
       _.cordovaOpenPrepopulatedDatabase()


       #Plugin to avoid 300ms click delay
       $(->
       		FastClick.attach(document.body)
       	)

    ,false)