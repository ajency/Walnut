##
## Set backbone overrites or mixins
##
define ['marionette','mustache'], (Marionette, Mustache)->

	# Extends the Marionette.Application to add some additional functions 
	_.extend Marionette.Application::,
		
		navigate: (route, options = {}) ->
			Backbone.history.navigate route, options
	
		getCurrentRoute: ->
			frag = Backbone.history.fragment
			if _.isEmpty(frag) then null else frag
		
		startHistory: ->
			if Backbone.history
				Backbone.history.start()
		
		# register a controller instance
		register: (instance, id) ->
			@_registry ?= {}
			@_registry[id] = instance
		
		# unregister a controller instance
		unregister: (instance, id) ->
			delete @_registry[id]
		
		resetRegistry: ->
			oldCount = @getRegistrySize()
			for key, controller of @_registry
				controller.region.close()
			msg = "There were #{oldCount} controllers in the registry, there are now #{@getRegistrySize()}"
			if @getRegistrySize() > 0 then console.warn(msg, @_registry) else console.log(msg)
		
		getRegistrySize: ->
			_.size @_registry

		# register a controller instance
		registerElement: (instance, id) ->
			@_elementRegistry ?= {}
			@_elementRegistry[id] = instance
		
		# unregister a controller instance
		unregisterElement: (instance, id) ->
			delete @_elementRegistry[id]
		
		resetElementRegistry: ->
			oldCount = @getElementRegistrySize()
			for key, controller of @_elementRegistry
				controller.layout.close()
			msg = "There were #{oldCount} controllers in the registry, there are now #{@getElementRegistrySize()}"
			if @getElementRegistrySize() > 0 then console.warn(msg, @_elementRegistry) else console.log(msg)
		
		getElementRegistrySize: ->
			_.size @_elementRegistry

	# add hide /unhide functionality to a region
	_.extend Marionette.Region::,

		hide : ->
			@$el.hide()

		unhide:->
			@$el.show()

	# overwrite the default rendering engine to mustache
	Marionette.Renderer.render = (template, data)->
		
		if not template
			template = ''

		if typeof template is "function"
		  template = template()
		
		Mustache.to_html template,data
	
	# override the serialize data function
	# Marionette.View serializeData:

	# Override the loadTemplate function as we are using requirejs
	# Marionette expects "templateId" to be the ID of a DOM element.
	# But with RequireJS, templateId is actually the full text of the template.
	Marionette.TemplateCache::loadTemplate = (templateId) ->
		
		template = templateId
		
		if not template or template.length is 0
			msg = "Could not find template: '" + templateId + "'"
			err = new Error(msg)
			err.name = "NoTemplateError"
			throw err
		
		template

	# Form view 
	class Marionette.FormView extends Marionette.ItemView

		tagName : 'form'

		className : 'form-horizontal'

		# add validation
		onShow:->
			@$el.validate()
