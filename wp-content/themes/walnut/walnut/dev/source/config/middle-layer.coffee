define ['detect','jquery'], (detect,$)->

      networkStatus = 0

      #Function to detect the platform
      checkPlatform = ->
        ua = detect.parse(navigator.userAgent)
        if ua.os.family is "Android" or ua.os.family is "iOS" 
          "Mobile"
        else "Desktop"

      #Load script 'online.js' only for browser
      if checkPlatform() is "Desktop"
        $.getScript('wp-content/themes/walnut/walnut/dev/js/plugins/online.js');
      
      #Implementation for browser
      #Event handlers triggered every 5 seconds indicating the status of the network connectivity.
      #When network is up.
      window.onLineHandler = ->
        networkStatus = 1    

      #When network is down.
      window.offLineHandler = ->
        networkStatus = 0

      window.isOnline = ->
        if networkStatus is 1
          true
        else false     
      
      #Implementation for mobile
      #Check network status using Cordova API
      checkConnection = ->
        if navigator.connection.type is Connection.NONE 
          false
        else true

      #Mobile events
      document.addEventListener("online"
      ,()->
        console.log 'Online'
      ,false)

      document.addEventListener("offline"
      ,()->
        console.log 'Offline'
      ,false)



      $.middle_layer = (url,data,response) ->
        switch checkPlatform()
          when 'Desktop'
            if isOnline()
              $.post url, data, response, 'json'
            else
              return 'connection_error'

          when 'Mobile'
            if checkConnection()
              $.post url, data, response, 'json'
            else
              return 'connection_error'

       

            






