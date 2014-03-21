define ['plugins/detect','jquery','plugins/online'], (detect,$)->

      networkStatus = 0

      #Function to detect the platform
      checkPlatform = ->
        ua = detect.parse(navigator.userAgent)
        if ua.os.family is "Android" or ua.os.family is "iOS" 
          "Mobile"
        else "Desktop"

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

      $.middle_layer = (url,data,response) ->
        if checkPlatform() is "Desktop"
          if isOnline()
            data.ntwkStatus = 'online'
            $.post url, data, response, 'json'

          else
            data.ntwkStatus = 'offline'
            $.post url, data, response, 'json'




