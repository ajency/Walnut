define ['detect','jquery', 'underscore'], (detect, $, _)->

      networkStatus = 0

      #Function to detect the platform
      _.checkPlatform = ->
        ua = detect.parse(navigator.userAgent)
        if ua.os.family is "Android" or ua.os.family is "iOS" 
          "Mobile"
        else "Desktop"


      #Load script 'online.js' only for browser
      $.getScript('wp-content/themes/walnut/walnut/dev/js/plugins/online.js') if _.checkPlatform() is 'Desktop'

      
      #Implementation for browser
      #Event handlers triggered every 5 seconds indicating the status of the network connectivity.
      window.onLineHandler = ->
        networkStatus = 1   
      
      window.offLineHandler = ->
        networkStatus = 0


      #Implementation for mobile
      #Mobile events
      document.addEventListener("online"
      ,()->
        console.log 'Online'
      ,false)

      document.addEventListener("offline"
      ,()->
        console.log 'Offline'
      ,false)


      #Check connectivity based on platform
      _.isOnline = ->
        switch _.checkPlatform()
          when 'Desktop'
            if networkStatus is 1
              true
            else false
            
          when 'Mobile'
            if navigator.connection.type is Connection.NONE
              false
            else true


      #Check if user is admin for app navigation based on user roles.
      _.getUserRole =(username)->
        role = ''

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
                role = r['user_role']
              i++

            d.resolve(role) 
          
        onFailure = (d)->
          (tx,error)->
            d.reject('OnFailure!: '+error)

        $.when(runQuery()).done ->
          console.log 'getUserRole transaction completed'
        .fail (err)->
          console.log 'Error: '+err  

             



       

            






