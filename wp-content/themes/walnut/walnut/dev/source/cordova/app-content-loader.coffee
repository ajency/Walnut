define ['underscore', 'unserialize'], ( _) ->

	_.mixin

		#Get meta_value from wp_postmeta
		getMetaValue : (content_piece_id)->
			meta_value = 
				content_type : ''
				layout_json : ''
				question_type : ''
				difficulty_level: ''
				post_tags : ''
				duration : ''
				last_modified_by : ''
				published_by : ''
				term_ids : ''
				instructions: ''
				comment_enable: ''
				comment: ''
				hint_enable: ''
				hint: ''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=?"
							, [content_piece_id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)
						
						do(row)->

							if row['meta_key'] is 'content_type'
								meta_value.content_type = row['meta_value']

							if row['meta_key'] is 'layout_json'
								meta_value.layout_json = _.unserialize(row['meta_value'])

							if row['meta_key'] is 'question_type'
								meta_value.question_type = row['meta_value']	

							if row['meta_key'] is 'difficulty_level'
								meta_value.difficulty_level = row['meta_value']
							
							if row['meta_key'] is 'content_piece_meta'
								content_piece_meta = _.unserialize(row['meta_value'])

								meta_value.post_tags = content_piece_meta.post_tags
								meta_value.duration = content_piece_meta.duration
								meta_value.last_modified_by = content_piece_meta.last_modified_by
								meta_value.published_by = content_piece_meta.published_by
								meta_value.term_ids = content_piece_meta.term_ids
								meta_value.instructions = content_piece_meta.instructions
								meta_value.comment_enable = content_piece_meta.comment_enable
								meta_value.comment = content_piece_meta.comment
								meta_value.hint_enable = content_piece_meta.hint_enable
								meta_value.hint = content_piece_meta.hint
								

					d.resolve(meta_value)

			$.when(runQuery()).done ->
				console.log 'getMetaValue transaction completed'
			.fail _.failureHandler



		# get all the elements for the layout from its meta id
		getJsonToClone : (elements)->
			console.log JSON.stringify elements

			runFunc = ->
				$.Deferred (d)->
					content = 
						elements : elements
						excerpt : new Array

					if _.isArray elements  
						total = 0
						_.each elements ,(element)->
								total++ 
								if element.element is 'Row' or element.element is 'StudentQuestion'
									# element.columncount = element.elements.length
									insideElement = _.getRowElements(element)
									insideElement.done (columnElement)->
										content.excerpt.push columnElement.excerpt
										total--
										if not total
											d.resolve content


								else 
									metaData = _.getElementMetaValues(element)
									metaData.done (meta)->
										element.meta_id = parseInt element.meta_id
										
										if meta isnt false
											_.defaults element, meta

											if element.element is 'Text'
												content.excerpt.push meta.content
											if element.element is 'Fib'
												content.excerpt.push element.text
											if element.element is 'Hotspot'
												content.excerpt.push element.textCollection[0].text
											if element.element is 'Image'
												element.image_id = parseInt element.image_id
											if element.element is 'ImageWithText'
												element.image_id = parseInt element.image_id
											if element.element is 'Video'
												element.video_id = parseInt element.video_id
										
										total--
										if not total
											d.resolve content

					else d.resolve(elements)

			$.when(runFunc()).done ->
				console.log  "get getJsonToClone done"
			.fail _.failureHandler	


		
		# for each row in d the layout run this function. get the change the elements by reference
		# and return the excerpt
		getRowElements : (rowElements)->

			runFunc = ->
				$.Deferred (d)->
					content = 
						excerpt : new Array
					total = 0
					_.each rowElements.elements, (column)->
						if column.elements
							_.each column.elements, (element)->
								total++
								if element.element is 'Row' or element.element is 'StudentQuestion'
									# ele.columncount = ele.elements.length;
									insideElement = _.getRowElements(element)
									insideElement.done (columnElement)->

										content.excerpt.push columnElement.excerpt
										total--
										if not total
											d.resolve content
								else 
									metaData = _.getElementMetaValues element
									metaData.done (meta)->
										element.meta_id = parseInt element.meta_id
										if meta isnt false
											_.defaults(element, meta);

											if element.element is 'Text'
												content.excerpt.push element.content
											if element.element is 'Fib'
												content.excerpt.push element.text
											if element.element is 'Hotspot'
												content.excerpt.push element.textCollection[0].text
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
		getElementMetaValues : (element)->

			runFunc = ->
				$.Deferred (d)->
					meta = _.getMetaValueFromMetaId element.meta_id
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


		
		#Get content_element from wp_postmeta table
		getMetaValueFromMetaId : (meta_id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_postmeta WHERE meta_id=?"
							, [meta_id], onSuccess(d), _.deferredErrorHandler(d))

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