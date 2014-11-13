define ['app'
		'holder'
		'text!apps/content-creator/content-builder/element/templates/element.html'],
		(App, Holder, elementTpl)->

			# Headerapp views
			App.module 'ContentCreator.ContentBuilder.Element.Views', (Views, App, Backbone, Marionette, $, _)->

				# Pages single view
				class Views.ElementView extends Marionette.Layout

					# basic template
					template : elementTpl

					tagName : 'div'

					regions: 
						elementRegion : '> .element-markup'

					# class name
					className : 'element-wrapper'

					modelEvents : 
						'change:complete' : '_changeComplete'

					# element events
					events : 
						'click .aj-imp-settings-btn' : (evt)->
							evt.stopPropagation() 
							@trigger "show:setting:popup", @model

						'click .aj-imp-delete-btn': (evt)->
							evt.stopPropagation()
							@trigger "delete:element", @model
					
					initialize:=>
						# bind event only once
						@once 'before:render:element',=>
							@trigger "bind:element:events"

					# set the data-element attribute for element 
					onRender:->
						@$el.find('.element-markup > span').spin @_getOptions()
						
					# set mouse hover for element
					onShow:()=>
						console.log 'elemtn test'
						console.log @model.get 'element'
						if @model.get('element') in ['Row','ImageWithText']
							@$el.find '.aj-imp-settings-btn'
							.removeClass 'hidden'

						if @model.get('element') in ['TeacherQuestion']
							@$el.find '.aj-imp-settings-btn'
							.addClass 'hidden'

						@$el.mouseover (evt)=>
							evt.stopPropagation()
							return if window.dragging
							@$el.addClass 'hover-class'
						.mouseout ()=>
							@$el.removeClass 'hover-class'

					_changeComplete : (model,complete)->
						@setHiddenField 'complete', @model.get 'complete'
						@setHiddenField 'error_info', @model.get 'error_info'

					# set the hidden fields before rendering the element
					onBeforeRenderElement:->
						for field in ['meta_id', 'style', 'element']
							@setHiddenField field, @model.get field

						if @model.get('element') in ['Fib','Mcq','Sort','Hotspot','BigAnswer']
							@$el.find('form').append "<input type='hidden' name='complete' value=#{@model.get('complete')} />"
							@$el.find('form').append "<input type='hidden' name='error_info' value=#{@model.get('error_info')} />"

						@setDraggable @model.get 'draggable'

					# special hidden fields for row element
					addHiddenFields:()->
						for field in ['draggable', 'style']
							@$el.children('form').append "<input type='hidden' name='#{field}' value=''/>"

					# on set draggable
					setDraggable:(draggable)->
						if draggable is false
							@$el.find('.aj-imp-drag-handle').addClass('non-visible')
						else if draggable is true
							@$el.find('.aj-imp-drag-handle').removeClass('non-visible')

						@setHiddenField 'draggable', draggable

					setMargin:(newMargin, prevMargin = '')->
						element = @elementRegion.currentView
						element.$el.removeClass prevMargin
						element.$el.addClass newMargin

					setStyle:(newStyle, prevStyle = '')->
						element = @elementRegion.currentView
						element.$el.removeClass prevStyle
						element.$el.addClass newStyle

					# set the meta id for element
					setHiddenField :(name, value)->
						if @$el.children('form').find("input[name='#{name}']").length is 1
							@$el.children('form').find("input[name='#{name}']").val value

					# rerender markup 
					onElementModelCreated:->
						# close the spinner
						@$el.find('.element-markup > span').spin false
						
					
					# spinner options
					_getOptions : ->
						lines 		: 10
						length 		: 6
						width 		: 2.5
						radius 		: 7
						corners 	: 1
						rotate 		: 9
						direction 	: 1
						color 		: '#000'
						speed 		: 1
						trail 		: 60
						shadow 		: false
						hwaccel 	: true
						className 	: 'spinner'
						zIndex 		: 2e9
						top 		: '0px'
						left 		: '40px'
