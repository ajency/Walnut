define ['underscore', 'unserialize'], ( _) ->

	_.mixin

		
		# get all the elements for the layout from its meta id
		getJsonToClone : (elements)->

			defer = $.Deferred()

			content = elements : elements, excerpt : new Array

			if _.isArray elements
				total = 0

				forEach = (element, i)->

					total++ 
					if element.element is 'Row' or element.element is 'TeacherQuestion'
						_.getRowElements(element).then (columnElement)->
							console.log 'getRowElements done'

							content.excerpt.push columnElement.excerpt
							total--
							if not total
								defer.resolve content

					else 
						_.getElementMetaValues(element).done (meta)->
							console.log 'getElementMetaValues done'

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
								defer.resolve content

					i = i + 1
					if i < _.size(elements)
						forEach elements[i], i

				forEach elements[0], 0

			
			else defer.resolve elements


			defer.promise()
			


		# for each row in d the layout run this function. get the change the elements by reference
		# and return the excerpt
		getRowElements : (rowElements)->

			defer = $.Deferred()

			content = excerpt : new Array
			total = 0

			forEachRowElement = (column, i)->

				if column.elements

					forEachColumnElement = (element, j)->

						total++
						if element.element is 'Row' or element.element is 'TeacherQuestion'
							_.getRowElements(element).then (columnElement)->
								console.log 'getRowElements done'

								content.excerpt.push columnElement.excerpt
								total--
								if not total
									defer.resolve content
						else 
							_.getElementMetaValues(element).then (meta)->
								console.log 'getElementMetaValues done'

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
									defer.resolve content

						j = j + 1
						if j < _.size(column.elements)
							forEachColumnElement column.elements[j], j

					forEachColumnElement column.elements[0], 0

				
				else defer.resolve content

				i = i + 1
				if i < _.size(rowElements.elements)
					forEachRowElement rowElements.elements[i], i

			forEachRowElement rowElements.elements[0], 0


			defer.promise()



		# get the meta value for each element and unserialise it
		getElementMetaValues : (element)->

			defer = $.Deferred()

			metaID = element.meta_id

			_.getMetaValueFromMetaId(metaID)
			.then (metaData)->
				console.log 'getMetaValueFromMetaId: '+metaID+' done'

				if metaData
					ele  =  _.unserialize(metaData)
					ele.meta_id = metaID

				else 
					ele = element
			
				defer.resolve ele


			defer.promise()



		#Get content_element from wp_postmeta table
		getMetaValueFromMetaId : (meta_id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				metaValue = null

				if data.rows.length isnt 0
					row = data.rows.item(0)

					if row['meta_key'] is 'content_element'
						metaValue = row['meta_value']

				defer.resolve metaValue

			
			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM wp_postmeta 
								WHERE meta_id=?"
								, [meta_id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()


