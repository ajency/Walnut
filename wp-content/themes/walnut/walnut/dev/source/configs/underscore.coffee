##
##
##
define ['underscore', 'underscorestring'], ( _) ->

	# overwrite template settings defaults to use mustache style
	_.templateSettings =
			evaluate : /\{\[([\s\S]+?)\]\}/g,
			interpolate : /\{\{([\s\S]+?)\}\}/g

	_.mixin _.str.exports()
	
	# mixin to add additional functionality underscore
	_.mixin
	
		#multiple app log message in a single statement
		logAppMsg : (msg...)->
			_.each arguments, (l, index)->
				console.log(l) 

		#multiple app error message in a single statement
		logAppErr : (msg...)->
			_.each arguments, (l, index)->
				console.log(l)

		# id order array
		idOrder : (arr)->
			newArray = []
			_.each arr, (ele, index)->
				i = ele.split '-'
				newArray.push parseInt i[1]

			newArray

		stripslashes:(str) ->

		  	(str + "").replace /\\(.?)/g, (s, n1) ->
		    	switch n1
			      	when "\\"
			       		"\\"
			      	when "0"
			        	"\u0000"
			      	when ""
			        	""
			      	else
			        	n1

