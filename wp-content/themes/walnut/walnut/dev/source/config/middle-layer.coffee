define ['detect','jquery', 'plugins/online'], (detect,$, online)->

      networkStatus = 0

      #Function to detect the platform
      checkPlatform = ->
        ua = detect.parse(navigator.userAgent)
        if ua.os.family is "Android" or ua.os.family is "iOS" 
          "Mobile"
        else "Desktop"

      #Load script 'online.js' only for browser
      if checkPlatform() is "Desktop"
        online

      #Implementation for browser
      #Event handlers triggered every 5 seconds indicating the status of the network connectivity.
      #When network is up.
      `window.onLineHandler = function(){
        networkStatus = 1
        }`    

      #When network is down.
      `window.offLineHandler = function(){
        networkStatus = 0
        }` 

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
      `function onOnline(){
      }`

      document.addEventListener("offline", onOffline, false);
      `function onOffline(){
      }`

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
       

            






