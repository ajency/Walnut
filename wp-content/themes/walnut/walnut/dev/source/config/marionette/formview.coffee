
define ['marionette'], (Marionette)->

	class Marionette.FormView extends Marionette.ItemView

		tagName : 'form'

		className : 'form-horizontal clearfix'

		# handle on render event
		onShow: ()->

			# get validation options		
			options = @_getOptions()

			# form validation messages will be completly dependent on view
			@$el.validate options



		# get validation plugin options
		_getOptions : ->

			@options =  {} unless @options

			_.defaults @options,
						debug			: true
						success			: "success"
						ignore 			: '.ignore'
						errorClass 		: 'p-message'
						submitHandler 	: @submitForm


		# submit form action
		submitForm :(form) ->

			throw new Error 'Submit handler not defined'

			form.submit()