define ['app'
		'holder'
		'text!apps/content-preview/content-board/element/templates/element.html'],
		(App, Holder, elementTpl)->

			# Headerapp views
			App.module 'ContentPreview.ContentBoard.Element.Views', (Views, App, Backbone, Marionette, $, _)->

				# Pages single view
				class Views.ElementView extends Marionette.Layout

					# basic template
					template : elementTpl

					tagName : 'div'

					regions: 
						elementRegion : '> .element-markup'

					# class name
					className : 'element-wrapper'
			
					
					initialize:=>
					

					# set the data-element attribute for element 
					onRender:->
						# @$el.find('.element-markup > span').spin @_getOptions()
						
					# set mouse hover for element
					onShow:()=>
						# @$el.mouseover (evt)=>
						# 	evt.stopPropagation()
						# 	return if window.dragging
						# 	@$el.addClass 'hover-class'
						# .mouseout ()=>
						# 	@$el.removeClass 'hover-class'

					# set the hidden fields before rendering the element
					onBeforeRenderElement:->
						for field in ['meta_id', 'style', 'element']
							@setHiddenField field, @model.get field
			

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


					# special hidden fields for row element
					addHiddenFields:()->
						for field in ['draggable', 'style']
							@$el.children('form').append "<input type='hidden' name='#{field}' value=''/>"

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

				
		