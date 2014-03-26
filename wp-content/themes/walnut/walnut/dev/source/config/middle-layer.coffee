define ['plugins/detect','jquery','plugins/online'], (detect,$)->

      networkStatus = 0

      #Function to detect the platform
      checkPlatform = ->
        ua = detect.parse(navigator.userAgent)
        if ua.os.family is "Android" or ua.os.family is "iOS" 
          "Mobile"
        else "Desktop"
      

      #Implementation for browser
      #Check if connection exists when page is first loaded.    
      if window.navigator.onLine 
        networkStatus = 1
      else
        networkStatus = 0

      #Event handlers triggered every 5 seconds indicating the status of the network connectivity.
      #When network is up.
      window.onLineHandler = ->
        if checkPlatform() is "Desktop"
          networkStatus = 1
          return

      #When network is down.
      window.offLineHandler = ->
        if checkPlatform() is "Desktop"
          networkStatus = 0
          return

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
      document.addEventListener("online", onOnline, false);
      onOnline = ->
        alert("On")
        return

      document.addEventListener("offline", onOffline, false);
      onOffline = ->
        alert("Off")
        return


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






