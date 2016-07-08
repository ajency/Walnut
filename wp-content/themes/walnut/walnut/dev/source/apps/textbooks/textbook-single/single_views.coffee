define ['app'
		'text!apps/textbooks/textbook-single/templates/textbook-full.html'
		'text!apps/textbooks/textbook-single/templates/textbook-description.html'
		'text!apps/textbooks/textbook-single/templates/chapters-list.html'
		],(App,textbookSingleTpl, textbookDescriptionTpl, chapterListTpl)->

	App.module "TextbooksApp.Single.Views",(Views, App)->

		class Views.TextbookDescriptionView extends Marionette.ItemView

			template : textbookDescriptionTpl
			className: ''

			onShow :->
				console.log 'show'
				#console.log @model 


		class Views.TextbookSingleLayout extends Marionette.Layout

			template : textbookSingleTpl

			className : 'row'

			regions: 
				textbookDescriptionRegion 	: '#textbook-description-region'
				chaptersRegion				: '#chapters-list-region'

			serializeData: ->
				data = super()
				#console.log 'check Admin'
				#console.log @collection
				data.isAdmin = @collection.isAdmin
				data

			events :
				'click .add-chapter' : 'addChapter'
				'click #search-btn' : 'searchTextbooks'
				'keypress .search-box' :(e)-> @searchTextbooks() if e.which is 13

			addChapter:->
				#console.log @collection
				@collection.toAddText = 'true'
				@trigger 'show:add:textbook:popup', @collection
				

			searchTextbooks: (e)=>
					#console.log 'search'
					id =[]
					searchStr = $('.search-box').val()
				#if searchStr
                    #@trigger 'before:search:textbook'
                    #console.log @collectionAll
					@$el.find "#error-div"
                    .hide()
                    @$el.find '.progress-spinner'
                    .show()
                    #console.log chaptersOriginalCollection
                    #console.log @collection
                    models = chaptersOriginalCollection.filter (model) ->
                        #console.log 'entered'
                        _.any model.attributes, (val, attr) ->
                            name = model.get('name')
                            nameL = model.get('name').toLowerCase()
                            n = name.search(searchStr)
                            m = nameL.search(searchStr)
                            #console.log n
                            #console.log m
                            n = n.toString()
                            m = m.toString()
                            if n != '-1' || m != '-1'
                                #console.log 'not -1'
                                id = model.get('term_id')
                                #console.log id
                                model.pick(id)
                            else
                                console.log "none found"
                    @collection.reset(models)
                    #console.log @collection
                    @$el.find '.progress-spinner'
                    .hide()
                    @trigger 'search:textbooks', @collection
                ###else
					console.log "dedede"
					@trigger 'search:textbooks', chaptersOriginalCollection###
