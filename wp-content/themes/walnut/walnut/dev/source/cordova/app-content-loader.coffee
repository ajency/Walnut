define ['underscore', 'unserialize'], ( _) ->

	#Get content_element from wp_postmeta table
	getMetaValueFromMetaId = (meta_id)->

		runQuery = ->
			$.Deferred (d)->
				_.db.transaction (tx)->
					tx.executeSql "SELECT * FROM wp_postmeta WHERE meta_id=?"
						, [meta_id], onSuccess(d), _.deferredErrorHandler(d)

		onSuccess = (d)->
			(tx, data)->
				metaValue = null

				if data.rows.length isnt 0
					row = data.rows.item(0)

					if row['meta_key'] is 'content_element'
						metaValue = row['meta_value']

				d.resolve(metaValue)

		$.when(runQuery()).done ->
			console.log 'getMetaValueFromMetaId: '+meta_id+' transaction completed'
		.fail _.failureHandler	



	# get all the elements for the layout from its meta id
	_.getJsonToClone = (elements)->

		runFunc = ->
			$.Deferred (d)->
				content = 
					elements : elements
					excerpt : new Array

				if _.isArray elements  
					total = 0
					_.each elements ,(element)->
							total++ 
							if element.element is 'Row' or element.element is 'TeacherQuestion'
								# element.columncount = element.elements.length
								insideElement = getRowElements(element)
								insideElement.done (columnElement)->
									content.excerpt.push columnElement.excerpt
									total--
									if not total
										d.resolve content


							else 
								metaData = getElementMetaValues(element)
								metaData.done (meta)->
									element.meta_id = parseInt element.meta_id
									
									if meta isnt false
										_.defaults element, meta

										if element.element is 'Text'
											content.excerpt.push meta.content
										if element.element is 'Image'
											element.image_id = parseInt element.image_id
										if element.element is 'ImageWithText'
											element.image_id = parseInt element.image_id
										if element.element is 'Video'
											element.video_id = parseInt element.video_id
									
									total--
									if not total
										d.resolve content

		$.when(runFunc()).done ->
			console.log  "get getJsonToClone done"
		.fail _.failureHandler	


	# for each row in d the layout run this function. get the change the elements by reference
	# and return the excerpt
	getRowElements = (rowElements)->

		runFunc = ->
			$.Deferred (d)->
				content = 
					excerpt : new Array
				total = 0
				_.each rowElements.elements, (column)->
					if column.elements
						_.each column.elements, (element)->
							total++
							if element.element is 'Row' or element.element is 'TeacherQuestion'
								# ele.columncount = ele.elements.length;
								insideElement = getRowElements(element)
								insideElement.done (columnElement)->

									content.excerpt.push columnElement.excerpt
									total--
									if not total
										d.resolve content
							else 
								metaData = getElementMetaValues element
								metaData.done (meta)->
									element.meta_id = parseInt element.meta_id
									if meta isnt false
										_.defaults(element, meta);
										if element.element is 'Text'
											content.excerpt.push element.content
										if element.element is 'Image'
											element.image_id = parseInt element.image_id
										if element.element is 'ImageWithText'
											element.image_id = parseInt element.image_id
										if element.element is 'Video'
											element.video_id = parseInt element.video_id
									total--
									if not total
										d.resolve content
					else
						d.resolve content

		$.when(runFunc()).done ->
			console.log  "get getRowElements done"
		.fail _.failureHandler	



	# get the meta value for each element and unserialise it
	getElementMetaValues = (element)->

		runFunc = ->
			$.Deferred (d)->
				meta = getMetaValueFromMetaId element.meta_id
				meta.done (metaData)->
					if metaData
						ele  =  unserialize metaData
						ele.meta_id = element.meta_id
						# return false

					else ele = element
				
					d.resolve ele

					# if (!metaData)
					# 	return false

					# ele  =  unserialize metaData
					# ele.meta_id = element.meta_id

					# d.resolve ele

		$.when(runFunc()).done ->
			console.log "get getElementMetaValues done"
		.fail _.failureHandler 	