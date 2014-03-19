
define ['marionette','mustache', 'text!configs/marionette/templates/modal.html'], (Marionette, Mustache ,modalTpl) ->

	class Marionette.Region.Dialog extends Marionette.Region

		template : modalTpl

		# override open method
		open:(view)->
			options = if view.dialogOptions then view.dialogOptions else {}
			options = @_getOptions options
			wrapper = Mustache.to_html modalTpl, options
			@$el.html(wrapper)
			@$el.find('.modal-body').append(view.el);
			@$el.addClass options.modal_size

		#initiate modal on show
		onShow :(view)->

			@setupBindings view

			@$el.modal()

			@$el.modal 'show'

			@$el.on 'hidden.bs.modal', ()=>
				@clearDialog()

		closeDialog:->
			@$el.modal 'hide'

		# get options
		_getOptions:(options)->

			_.defaults options,
						modal_title : ''
						modal_size  : 'wide-modal'


		setupBindings :(view)->

			@listenTo view, 'dialog:close', @closeDialog
			@listenTo view, 'dialog:resize', @resizeDialog


		clearDialog:()->
			@close()
			@$el.empty()

			