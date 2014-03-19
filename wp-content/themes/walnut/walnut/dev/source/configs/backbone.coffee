define ["backbone","mustache"], (Backbone, Mustache) ->


	_.extend Backbone.Model::,

		# Extended implementation of Bacbone.Model.sync to work with wordpress ajax
		# Purpose of this function is to make the backbone sync compatible with 
		# wordpress ajax. WP ajax requires a “action” param with ajax to identity the ajax actio to perform
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
			xhr = options.xhr = Backbone.ajax(_.extend(params, options))
			
			# trigger the request event of the model
			model.trigger "request", model, xhr, options

			# attache _fetch to model
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