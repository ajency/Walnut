
define ['marionette'], (Marionette) ->

	class Marionette.Region.Settings extends Marionette.Region

		#initiate modal on show
		onShow :(view)->
			@$el.draggable()

		onClose:->
			@$el.draggable 'destroy'