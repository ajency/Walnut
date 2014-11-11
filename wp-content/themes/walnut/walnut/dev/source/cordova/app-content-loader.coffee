define ['underscore', 'unserialize'], ( _) ->

	_.mixin

		#Get meta_value from wp_postmeta
		getMetaValue : (content_piece_id)->
			content_piece_id = parseInt(content_piece_id)


			
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

			defer = $.Deferred()

			onSuccess = (tx,data)->

				if data.rows.length is 0
					defer.resolve meta_value
				
				else
					
					forEach = (row, i)->

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

						i = i + 1

						if ( i < data.rows.length)
							forEach data.rows.item(i), i
						else
							defer.resolve meta_value


					forEach data.rows.item(0), 0

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT * FROM wp_postmeta 
								WHERE post_id=?"
								, [content_piece_id]
				, onSuccess, _.transactionErrorHandler


			defer.promise()



		# get all the elements for the layout from its meta id
		getJsonToClone : (elements)->

			defer = $.Deferred()
			content = 
				elements : elements
				excerpt : new Array
				marks 	: 0

			if _.isArray elements  
				total = 0

				forEach = (element, i)->
					total++ 
					if element.element is 'Row'
						# element.columncount = element.elements.length
						_.getRowElements(element).then (columnElement)->
							
							content.excerpt.push columnElement.excerpt
							content.marks += columnElement.marks if columnElement.marks
							
							total--
							if not total
								defer.resolve content

					else if element.element is 'Mcq'
						# element.columncount = element.elements.length
						_.getMcqElements(element).then (columnElement)->

							_.getElementMetaValues(element).then (meta)->
								
								element.meta_id = parseInt(element.meta_id)
								if meta isnt false
									_.defaults element, meta
								content.excerpt.push columnElement.excerpt
								content.marks += columnElement.marks if columnElement.marks
								total--
								
								if not total
									defer.resolve content


					else 
						_.getElementMetaValues(element).then (meta)->
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

								content.marks += element.marks if element.marks
								
							total--
							if not total
								defer.resolve content
					
					i = i + 1

					if i < _.size(elements)
						forEach elements[i], i

				
				forEach elements[0], 0
			
			else defer.resolve(elements)

			defer.promise()


		
		# for each row in d the layout run this function. get the change the elements by reference
		# and return the excerpt
		getRowElements : (rowElements)->

			defer = $.Deferred()
			content = 
				excerpt : new Array
				marks : 0

			total = 0

			forEachRowElement = (column, i)->
				
				if column.elements

					forEachColumnElement = (element, j)->

						total++
						if element.element is 'Row'
							# ele.columncount = ele.elements.length;
							_.getRowElements(element)
							.then (columnElement)->

								content.excerpt.push columnElement.excerpt
								content.marks += columnElement.marks if columnElement.marks

								total--
								if not total
									defer.resolve content


						else if element.element is 'Mcq'
							# element.columncount = element.elements.length
							_.getMcqElements(element).then (columnElement)->

								_.getElementMetaValues(element).then (meta)->
									
									element.meta_id = parseInt element.meta_id
									if meta isnt false
										_.defaults element, meta
									content.excerpt.push columnElement.excerpt
									content.marks += columnElement.marks if columnElement.marks
									total--
									
									if not total
										defer.resolve content


						else 
							_.getElementMetaValues element
							.then (meta)->
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

									content.marks += element.marks if element.marks

								total--
								if not total
						
									defer.resolve content

						j = j + 1
						if j < _.size(column.elements)
							forEachColumnElement column.elements[j], j

					#inside For each
					forEachColumnElement column.elements[0], 0

				else
					defer.resolve content
				
				i = i + 1
				if i < _.size(rowElements.elements)
					forEachRowElement rowElements.elements[i], i
				


			forEachRowElement rowElements.elements[0], 0

			defer.promise()
			

		

		getMcqElements : (rowElements)->

			defer = $.Deferred()
			content = 
				excerpt : new Array
				marks : 0
			total = 0
			

			forEachRowElement = (column, i)->
				
				if column

					forEachColumnElement = (element, j)->
						total++
						if element.element is 'Row'
							# ele.columncount = ele.elements.length;
							_.getRowElements(element)
							.then (columnElement)->

								content.excerpt.push columnElement.excerpt
								content.marks += columnElement.marks if columnElement.marks
								total--
								if not total
									defer.resolve content
						else 
							_.getElementMetaValues element
							.then (meta)->
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

									content.marks += element.marks if element.marks
									
								total--
								if not total
						
									defer.resolve content

						j = j + 1
						if j < _.size(column)
							forEachColumnElement column[j], j
					
					forEachColumnElement column[0], 0



				else
					defer.resolve content

				i = i + 1

				if i < _.size(rowElements.elements)
					forEachRowElement rowElements.elements[i], i

			forEachRowElement rowElements.elements[0], 0

			defer.promise()




		# get the meta value for each element and unserialise it
		getElementMetaValues : (element)->

			defer = $.Deferred()
			_.getMetaValueFromMetaId element.meta_id
			.then (metaData)->
				if metaData
					ele  =  _.unserialize metaData
					ele.meta_id = element.meta_id
					# return false

				else ele = element
			
				defer.resolve ele


			defer.promise()

					# if (!metaData)
					# 	return false

					# ele  =  unserialize metaData
					# ele.meta_id = element.meta_id

					# d.resolve ele



		
		#Get content_element from wp_postmeta table
		getMetaValueFromMetaId : (meta_id)->


			defer = $.Deferred()

			onSuccess = (tx,data)->

				metaValue = null

				if data.rows.length isnt 0
					
					row = data.rows.item(0)

					if row['meta_key'] is 'content_element'
						metaValue = row['meta_value']

				defer.resolve metaValue

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT * FROM wp_postmeta 
								WHERE meta_id=?"
								, [meta_id]
				, onSuccess, _.transactionErrorHandler


			defer.promise()