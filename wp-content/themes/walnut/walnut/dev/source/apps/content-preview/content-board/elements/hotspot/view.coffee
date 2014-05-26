define ['app'], (App)->
	App.module "ContentPreview.ContentBoard.Element.Hotspot.Views",
	(Views, App, Backbone, Marionette, $, _)->
		
		class Views.HotspotView extends Marionette.ItemView

			className: 'stage'


			initialize: (opt = {})->
				@answerModel = opt.answerModel

				# create layer collections
				@textCollection = @model.get 'textCollection'
				@optionCollection = @model.get 'optionCollection'
				@imageCollection = @model.get 'imageCollection'




				#give a unique name to every hotspot canvas
				@stageName = _.uniqueId('stage')

				# create the canvas layers
				@imageLayer = new Kinetic.Layer
					name: 'imageLayer'
				@optionLayer = new Kinetic.Layer
					name: 'optionLayer'
				@textLayer = new Kinetic.Layer
					name: 'textLayer'
				# layer to show the user which option is selected
				@answerLayer = new Kinetic.Layer
					name: 'answerLayer'
				# layer to show feedback to user on clicking submit
				@feedbackLayer = new Kinetic.Layer
					name: 'feedbackLayer'


			onRender: ->
				@$el.attr 'id', @stageName


			onShow: ()->
				# create a kinetic stage
				@stage = new Kinetic.Stage
					container: @stageName
					width: @$el.parent().width()
					height: @$el.parent().height() + 80

				# if height in model isnt 0 then set the stage height
				if @model.get('height') isnt 0
					@stage.height @model.get('height')


				# add the canvas layers
				@stage.add @imageLayer
				@stage.add @textLayer
				@stage.add @optionLayer
				@stage.add @answerLayer
				@stage.add @feedbackLayer

				# add the border to canvas
				@_addBorderBox()

				# draw the elements
				@_drawExistingElements()

				# set the handler for click events
				@_clickHandler()

				@$el.closest('.preview').find('#submit-answer-button').on 'click', =>
					@trigger "submit:answer"

			# the handler for all click events
			# iterate thru each option defined
			# if the options are set to transparent mode then add click handlers to
			# the region outside the options
			_clickHandler: ->
				_.each @optionLayer.getChildren(), @_iterateThruOptions
				if @model.get 'transparent'
					@stage.on 'click', @_onOutsideClick


			# handler for click event outside of the options area
			# create an object with the pointer position and the id
			#
			# push data into the answr model
			# set the blinker at the position where click occured
			_onOutsideClick: =>
				answerObject = @stage.getPointerPosition()
				answerObject.id = _.uniqueId('out')
				@answerModel.get('answer').push answerObject
				@_setBlinker(null, answerObject)

			# iterator for the option
			# set click handler for the options
			_iterateThruOptions: (option)=>
				option.on 'click', _.bind @_onOptionClick, @, option

			# function to run on click of option
			# stop event propogation
			# create answer object with click position and id
			_onOptionClick: (option, evt)->
				evt.cancelBubble = true
				answerObject = @stage.getPointerPosition()
				answerObject.id = option.id()
				# if id not already present push into the array
				if not _.contains(_.pluck(@answerModel.get('answer'), 'id'), option.id())
					@answerModel.get('answer').push answerObject
					# if not transparent blink the option otherwise show small blinker at the click location
					if not @model.get 'transparent'
						@_setBlinker(option)
					else
						@_setBlinker(null, answerObject)

			# create a blinker
			_setBlinker: (option, answerObject)->
				blinker = null
				# if the clicked area is a visible option
				if option
					if option.className is 'Circle'
						blinker = new Kinetic.Circle
							name: option.id()
							x: option.x()
							y: option.y()
							opacity: 0.5
							radius: option.radius()
							fill: 'blue'
					else if option.className is 'Rect'
						blinker = new Kinetic.Rect
							name: option.id()
							x: option.x() + option.width() / 2
							y: option.y() + option.height() / 2
							height: option.height()
							width: option.width()
							offset:
								x: option.width() / 2
								y: option.height() / 2
							opacity: 0.5
							fill: 'blue'
					# if not a visible option
				else
					blinker = new Kinetic.Circle
						name: answerObject.id
						x: answerObject.x
						y: answerObject.y
						radius: 20
						opacity: 0.5
						fill: 'blue'

				@answerLayer.add blinker

				# animate the blinker				#
				period = 3000;
				anim = new Kinetic.Animation (frame)->
					scale = Math.sin(frame.time * 2 * Math.PI / period) + 0.001
					blinker.scale
						x: scale / 4 - 0.75
						y: scale / 4 - 0.75

				, @answerLayer
				# start animation
				anim.start()

				# stop animation
				@listenTo @, "show:feedback", ->
					anim.stop()


				blinker.on 'click', =>
					answerObject = _.findWhere @answerModel.get('answer'), {id: blinker.name()}
					@answerModel.set 'answer', _.without @answerModel.get('answer'), answerObject
					blinker.off 'click'
					blinker.destroy()

			# handler for "show:feedback" event
			onShowFeedback: ->
				@answerLayer.remove()
				correctOptions = @optionCollection.where {correct: true}
				correctOptionsIds = _.pluck correctOptions, 'id'
				answerId = _.pluck @answerModel.get('answer'), 'id'
				answeredWrongly = _.difference answerId, correctOptionsIds
				answeredCorrectly = _.intersection answerId, correctOptionsIds
				# load the feedback images
				@_loadFeedbackImages
					answers: correctOptionsIds
					correct: answeredCorrectly
					wrong: answeredWrongly

			_loadFeedbackImages: (options)->
				@_showCorrectAnswers(options.answers)
				correctImage = new Image()
				correctImage.onload = =>
					@_showMyAnswers options.correct, correctImage
				correctImage.src = THEMEURL + '/images/right-ans.gif'
				wrongImage = new Image()
				wrongImage.onload = =>
					@_showMyAnswers options.wrong, wrongImage
				wrongImage.src = THEMEURL + '/images/wrong-ans.gif'

			_showMyAnswers: (answersId, image)->
				_.each answersId, (answerId)=>
					answerShape = _.find @answerLayer.getChildren(), (answer)->
						answer.name() == answerId
					console.log answerShape
					# console.log @answerLayer.getChildren()[0].name()
					if answerShape.className is 'Circle'
						feedback = new Kinetic.Circle
							x: answerShape.x()
							y: answerShape.y()
							radius: answerShape.radius()
							fillPatternImage: image
							fillPatternRepeat: 'no-repeat'
							fillPatternOffset:
								x: 20
								y: 20
					else
						feedback = new Kinetic.Rect
							x: answerShape.x() - answerShape.width() / 2
							y: answerShape.y() - answerShape.height() / 2
							width: answerShape.width()
							height: answerShape.height()
							fillPatternImage: image
							fillPatternX: answerShape.width() / 2 - 20
							fillPatternY: answerShape.height() / 2 - 20
							fillPatternRepeat: 'no-repeat'

					@feedbackLayer.add feedback
				@feedbackLayer.draw()

			_showCorrectAnswers: (correctOptopns)->
				_.each correctOptopns, (correctId)=>
					correctAnswer = _.find @optionLayer.getChildren(), (answer)->
						answer.id() == correctId
					# console.log correctAnswer
					# console.log @answerLayer.getChildren()[0].name()
					if correctAnswer.className is 'Circle'
						feedbackCorrect = new Kinetic.Circle
							x: correctAnswer.x()
							y: correctAnswer.y()
							radius: correctAnswer.radius()
							stroke: 'green'
							strokeWidth: 6
					else
						feedbackCorrect = new Kinetic.Rect
							x: correctAnswer.x()
							y: correctAnswer.y()
							width: correctAnswer.width()
							height: correctAnswer.height()
							stroke: 'green'
							strokeWidth: 6

					@feedbackLayer.add feedbackCorrect
				@feedbackLayer.draw()

			# add border to the hotspot canvas
			_addBorderBox: ->
				borderBox = new Kinetic.Rect
					name: "border"
					x: 0
					y: 0
					width: @$el.parent().width()
					height: @model.get 'height'
					stroke: 'black'
					strokeWidth: 1
				@imageLayer.add borderBox
				@imageLayer.draw()

			_drawExistingElements: ->
				console.log @textCollection

				@textCollection.each (model, i)=>
					@_addEachElements 'Hotspot-Text', model

				@optionCollection.each (model, i)=>
					if model.get('shape') is 'Rect'
						@_addEachElements 'Hotspot-Rectangle', model

					if model.get('shape') is 'Circle'
						@_addEachElements 'Hotspot-Circle', model

				@imageCollection.each (model, i)=>

					@_addEachElements 'Hotspot-Image', model

			_addEachElements: (type, model)->
				@triggerMethod "add:hotspot:element",
					type
				,
					left: model.get 'x'
					top: model.get 'y'
				,
					model

			onAddHotspotElement: (type, elementPos, model)->
				if(type == "Hotspot-Circle")
					@_addCircle elementPos, model

				else if(type == "Hotspot-Rectangle")
					@_addRectangle elementPos, model

				else if(type == "Hotspot-Text")
					@_addTextElement elementPos, model

				else if(type == "Hotspot-Image")
					@_addImageElement elementPos, model.get('url'), model

			_addCircle: (elementPos, model)->
				hotspotElement = model

				self = @

				circle = new Kinetic.Circle
					id: hotspotElement.get 'id'
					x: hotspotElement.get 'x'
					y: hotspotElement.get 'y'
					radius: hotspotElement.get 'radius'
					strokeWidth: 2

				console.log circle.getId()

				if not @model.get 'transparent'
					circle.stroke hotspotElement.get 'color'

				@optionLayer.add circle

				@optionLayer.draw()


			_addRectangle: (elementPos, model)->
				hotspotElement = model

				box = new Kinetic.Rect
					id: hotspotElement.get 'id'
					x: hotspotElement.get 'x'
					y: hotspotElement.get 'y'
					width: hotspotElement.get 'width'
					height: hotspotElement.get 'height'
					strokeWidth: 2
					rotation: hotspotElement.get 'angle'

				if not @model.get 'transparent'
					box.stroke hotspotElement.get 'color'

				@optionLayer.add box

				@optionLayer.draw()

			_addTextElement: (elementPos, model)->
				hotspotElement = model

				canvasText = new Kinetic.Text
					x: hotspotElement.get 'x'
					y: hotspotElement.get 'y'
					text: hotspotElement.get 'text'
					opacity: 1
					fontFamily: hotspotElement.get 'fontFamily'
					fontSize: hotspotElement.get 'fontSize'
					fill: hotspotElement.get 'fontColor'
					fontStyle: hotspotElement.get('fontBold') + " " + hotspotElement.get('fontItalics')
					padding: 5
					rotation: hotspotElement.get 'textAngle'

				@textLayer.add canvasText

				@textLayer.draw()

			_addImageElement: (elementPos, url, model)->
				hotspotElement = model
				imageObject = new Image()
				imageObject.src = hotspotElement.get 'url'
				imageObject.onload = =>
					imageElement = new Kinetic.Image
						image: imageObject
						x: hotspotElement.get 'x'
						y: hotspotElement.get 'y'
						width: hotspotElement.get 'width'
						height: hotspotElement.get 'height'
						rotation: hotspotElement.get 'angle'
					@imageLayer.add imageElement
					@imageLayer.draw()
