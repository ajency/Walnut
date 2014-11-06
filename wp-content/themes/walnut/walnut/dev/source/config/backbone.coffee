define ["backbone"], (Backbone) ->

	#Changes needed for offline data retrieval
	Backbone.local = (options, name)->

		jsonData = App.request "get:#{name}:collection"

		jsonData



	_.extend Backbone.Collection::,

		sync :(method, collection, options)->

			collection_name = collection.name
			opts = options.data
			console.log 'Collection name: '+collection_name

			if collection_name is 'textbook'

				_.cordovaTextbookCollection()
				.done (data)->
					console.log 'cordovaTextbookCollection done'
					collection.set data

			if collection_name is 'chapter'

				data = _.getChaptersByParentId(opts.parent)
				data.done (d)->
					collection.set d                                   


			if collection_name is 'division'
				_.getAllDivisions()
				.done (d)->
					console.log 'getAllDivisions done'

					collection.set d


			if collection_name is 'content-group'
				data = _.getContentGroupByTextbookIdAndDivision(opts.textbook, opts.division)
				data.done (d)->
					collection.set d

			if collection_name is 'quiz'
				_.getQuizByTextbookId(opts.textbook)
				.done (data)->
					console.log 'getQuizByTextbookId done'

					collection.set data

					App.request "app:reset:quiz:repository", data

			if collection_name is 'quiz-response-summary'
				@p = _.getQuizResponseSummaryByCollectionIdAndUserID(opts.collection_id)
				@p.done (data)->
					console.log 'getQuizResponseSummaryByCollectionIdAndUserID done'
					collection.set data

			if collection_name is 'quiz-question-response'
				@p = _.getQuizQuestionResponseBySummaryID(opts.summary_id)
				@p.done (data)->
					console.log 'getQuizQuestionResponseBySummaryID done'
					collection.set data

			if collection_name is 'content-piece'
				@p = _.getContentPiecesByIDs(opts.ids)
				@p.done (data)->
					console.log 'getContentPiecesByIDs done'
					collection.set data

					App.request "app:reset:content:pieces:repository", data

			#not required for student App
			if collection_name is 'user'
				_.getStudentsByDivision(opts.division)
				.done (data)->
					collection.set data


			if collection_name is 'textbookName'
				_.getTextBookNamesByTermIDs(opts.term_ids)
				.done (data)->
					collection.set data


			if collection_name is 'offlineUsers'
				_.getNamesOfAllOfflineUsers()
				.done (data)->
					collection.set data

			if collection_name is 'media'
				@p = _.getListOfMediaByID(opts.ids)
				@p.done (d)->
					collection.set d

			return true



	_.extend Backbone.Model::,

		# Extended implementation of Bacbone.Model.sync to work with wordpress ajax
		# Purpose of this function is to make the backbone sync compatible with 
		# wordpress ajax. WP ajax requires a “action” param with ajax to identity the ajax action to perform
		# This implementation states that each model definition MUST have a “name” property which will be used to create 
		# action parameter.
		# Ex:
		#  	class CarModel extends Backbone.Model	
		#		name : ‘car’
		#	
		#   audi = new CarModel( { carname : ‘Audi Q7’, …})
		#   
		#   audi.save() # will trigger wp_ajax_create-car as id is not set and will send all data
		#     
		#   audi.save({onlyChanged : false}) # will trigger wp_ajax_update-car assuming model is created in previous call
		#
		#   audi.delete() will trigger wp_ajax_delete-car and pass ‘id’ 
		#
		#   audio.fetch() # will trigger wp_ajax_read-car and pass ‘id’
		# 
		# Note: Also supports all default backbone options
		#
		# params:
		#  	method : the model method to trigger ( C-R-U-D )
		# 	model : the model which will trigger the sync
		# 	options : the ajax options for the user to overwrite

		sync : (method, model, options)->
			
			# check if the name property is set for the model
			# this property is important because the “action”
			# param required for wordpress ajax is generated 
			# combining “#{method}-#{name}”
			
			if not @name
				throw new Error "'name' property not set for the model"
			
			# Default JSON-request options.
			params =
				type : "POST"
				dataType: "json"
				data : {}
				
			# All ajax request in wordpress are sent to admin_url(‘admin-ajax.php’)
			# a global AJAXURL variable must be defined for all ajax actions
			# so, the url is always AJAXURL
			params.url = AJAXURL
			
			# generate the “action” param and bind it to data attribute of ‘params’
			_action = "#{method}-#{@name}"
			params.data['action'] = _action	
			
			# handle various CRUD operations depending on method name
			switch method
			
				# read a model form server. the only property read a model from server is the 
				# id attribute of the model. 
				when 'read'
					# read action must trigger a GET request. set the request to GET
					params.type = 'GET'
					
					# get the id attribute of the model
					idAttr = model['idAttribute']
					params.data[idAttr] = model.get idAttr

					
					
				# create a new model. At this point the model id/idAttribute is not set
				# the required data to create the model is present inside model. so model.toJSON()
				when 'create'
					params.data = _.defaults model.toJSON(), params.data
					
				# update a model. Two possible options, send entire model data to server or send 
				# only updated one. This condition will be handled with options passed along save
				# options name is ‘onlyChanged’ accepting boolean value. default to ‘true’
				when 'update'
					onlyChanged = options.onlyChanged ? false
					
					if onlyChanged
						# get all changed values and add them to param’s data attribute
						if model.hasChanged()
							params.data.changes = {}
							
							_.each model.changed, (property, index)->
								params.data.changes[ property ] = this.get property
							, @

					else
						# put all model data in params data attribute
						params.data = _.defaults model.toJSON(), params.data
				
				# deleting a model. This will need only the id of the model to send to server. Different model 
				# can have different idAttributes, hence, get the id attribute first and set it as the data attributes
				# property.
				when 'delete'
					allData = options.allData ? true
					if allData
						# put all model data in params data attribute
						params.data = _.defaults model.toJSON(), params.data
					else
						# get the model’s idAttribute. can be other then ‘id’
						idAttr = model['idAttribute']
						params.data[idAttr] = model.get idAttr
					
			# Don't process data on a non-GET request.
			# params.processData = false  if params.type isnt "GET" and not options.emulateJSON						
			
			# Make the request, allowing the user to override any Ajax options.
			if _.platform() is 'BROWSER'
				xhr = options.xhr = Backbone.ajax(_.extend(params, options))

			else
				#Changes needed for offline data retrieval
				modelname = model.name
				console.log "model"
				console.log 'Model name: '+modelname

				if modelname is 'division'
					xhr = _.fetchSingleDivision model.get('id')
					.done (data)->
						model.set data


				if modelname is 'textbook'
					xhr = _.getTextBookByTextbookId(model.get('term_id'))
					.done (d)->
						model.set d	


				if modelname is 'quiz'
					xhr = _.getQuizById(model.get('id'))
					.done (data)->
						console.log JSON.stringify data
						model.set data
						

				if modelname is 'quiz-response-summary'
					xhr = _.writeQuizResponseSummary(model)


				if modelname is 'quiz-question-response'
					xhr = _.writeQuestionResponse(model)


				if modelname is 'user'
					xhr = _.getUserByID()
					.done (data)->
						console.log JSON.stringify data
						model.set data

				if modelname is 'content-group'
					xhr = _.getContentGroupById(model.get('id'))
					.done (d)->
						model.set d


				if modelname is 'media'
					xhr = _.getMediaById(model.get('id'))
					.done (d)->
						model.set d	

			
			# trigger the request event of the model
			model.trigger "request", model, xhr, options

			# attach _fetch to model
			model._fetch = xhr if method is 'read' or method is 'create'

			# return the xhr object. this is a jquery deffered object
			xhr
			

		
		# model parse function
		parse:(resp)->
			# change sizes to an array
			if resp.code is 'OK'
				return resp.data 

			resp


	_.extend Backbone.Collection::,
		parse:(resp)->
			return resp.data if resp.code is 'OK'
			resp


	_sync = Backbone.sync
	
	# Overwrite the Backbone.sync to set additional _fetch object to entity
	# The _fetch is $.Deffered object and used later to executes callbacks
	# Sets only for 'read' method
	Backbone.sync = (method, entity, options = {}) ->
		sync = _sync(method, entity, options)
		if !entity._fetch and method is "read" or !entity._fetch and method is "create"
			entity._fetch = sync
			
		sync