define ['detect', 'jquery', 'underscore'], (detect, $, _)->

	# middle layer adds functionality, triggers events and loads plugins based on the platform.

	# detect platform
	_.platform = ->

		ua = detect.parse navigator.userAgent

		if ua.os.family is "Android" or ua.os.family is "iOS" then "DEVICE" 
		else "BROWSER"


	# load script 'online.js' only for browser.
	# online.js will make an xhr request at a time interval of 20 seconds
	# and check if internet connection is available.
	if _.platform() is 'BROWSER'
		$.getScript('wp-content/themes/walnut/walnut/dev/js/plugins/online.js')

	
	# event handlers triggered based on internet connection availability for browser. 
	connected = false
	window.onLineHandler = ->
		connected = true

	window.offLineHandler = ->
		connected = false


	# check connectivity based on platform
	_.isOnline = ->

		switch _.platform()

			when 'BROWSER'
				connected

			when 'DEVICE'
				if _.isUndefined(navigator.connection)
					connected
				else
					if navigator.connection.type is Connection.NONE	then false else true