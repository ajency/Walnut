define ['app', 'marionette'], ( App, Marionette )->

	# overridden function of worpress imageEdit.initCrop
	window.imageEdit.initCrop = (postid, image, parent) ->
			t = this
			selW = $("#imgedit-sel-width-" + postid)
			selH = $("#imgedit-sel-height-" + postid)
			$img = undefined
			t.iasapi = $(image).imgAreaSelect
							aspectRatio : App.currentImageRatio
							parent: parent
							instance: true
							handles: true
							keys: true
							minWidth: 3
							minHeight: 3
							onInit: (img) ->
								
								# Ensure that the imgareaselect wrapper elements are position:absolute
								# (even if we're in a position:fixed modal)
								$img = $(img)
								$img.next().css("position", "absolute").nextAll(".imgareaselect-outer").css "position", "absolute"
								t._view.$el.find("#imgedit-crop-sel-#{postid}").prev().hide()
								t._view._informUser()
									
							onSelectStart: ->
								imageEdit.setDisabled $("#imgedit-crop-sel-" + postid), 1
								return

							onSelectEnd: (img, c) ->
								imageEdit.setCropSelection postid, c
								return

							onSelectChange: (img, c) ->
								sizer = imageEdit.hold.sizer
								selW.val imageEdit.round(c.width / sizer)
								selH.val imageEdit.round(c.height / sizer)
								return
			  


	class InvalidMediaView extends Marionette.ItemView
		template : 'Invalid media argument passed'

	class ImageEditorView extends Marionette.ItemView

		className : 'wp_attachment_holder'

		template : '<p class="loading t-a-c">Loading... Please wait...</p>'

		initialize : ( options )->
			super options
			if @model._fetch
				App.execute "when:fetched", [@model], @showImageEditor
			else
				@listenTo @, 'show', @showImageEditor


		# empty implementation to avoid wordpress error
		back : ->
			@trigger "image:editing:cancelled"
			@close()

		save : ->
			@model.fetch 
					success : (model)=>
						@back()

		refresh : ->
			@model.fetch()

		showImageEditor : =>
			@render()
			@$el.attr 'id', "image-editor-#{@model.get( 'id' )}"
			
			_.delay =>
				window.imageEdit.open @model.get( 'id' ), @model.get( 'nonces' ).edit, @
			, 400


		_informUser : ->
			builderBrowserWidth = $('#aj-imp-builder-drag-drop').width()
			assumedMaxWidth = 1600

			aspectRatio = window.imageEdit.iasapi.getOptions().aspectRatio

			if not _.isString aspectRatio
				return false

			aspectRatio = aspectRatio.split(':')
			sliderWidth = parseFloat aspectRatio.shift()
			sliderHeight = parseFloat aspectRatio.pop()

			expectedImageWidth = (assumedMaxWidth * sliderWidth) / builderBrowserWidth
			expectedImageHeight = (sliderHeight * expectedImageWidth) / sliderWidth

			note = "<p class='note'><b>Expected image width to scale up on all screen sizes is <br /> #{parseInt expectedImageWidth} x #{parseInt expectedImageHeight}</b></p>"
			ele = @$el.find("#imgedit-crop-sel-#{@model.get( 'id' )}")
			ele.next('.note').remove()
			ele.after note


		_iasInit : (img)=>
			$img = $( img )
			$img.next().css( 'position', 'absolute' ).nextAll( '.imgareaselect-outer' ).css( 'position', 'absolute' )
			@$el.find("#imgedit-crop-sel-#{@model.get( 'id' )}").prev().hide()


	imageCropView = ( mediaId = 0, options = {} )->
		if mediaId is 0
			return new InvalidMediaView

		if _.isObject mediaId
			media = mediaId
		else if _.isNumber parseInt mediaId
			media = App.request "get:media:by:id", mediaId

		imageEditorView = new ImageEditorView 
									model : media
									options : options
		imageEditorView


	App.reqres.setHandler "get:image:editor:view", imageCropView