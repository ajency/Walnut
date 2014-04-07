define ['app'
		'controllers/region-controller'
		'text!apps/content-collection/collection-details/templates/collection-details.html'], (App, RegionController, collectionDetailsTpl)->

	App.module "CollecionDetailsApp.Controller", (Controller, App)->

		class Controller.CollecionDetailsController extends RegionController

			initialize : ->
				textbooksCollection = App.request "get:textbooks"

				@view= view = @_getCollectionDetailsView textbooksCollection

				@show view, (loading:true)

				@listenTo @view, "fetch:chapters" :(term_id) =>
					chaptersCollection = App.request "get:chapters", ('parent': term_id)
					App.execute "when:fetched", chaptersCollection, =>
						@view.triggerMethod 'fetch:chapters:complete', chaptersCollection

				@listenTo @view, "fetch:sections:subsections" :(term_id) ->
					allSectionsCollection = App.request "get:subsections:by:chapter:id", ('child_of': term_id)
					App.execute "when:fetched", allSectionsCollection, =>
						#make list of sections directly belonging to chapter ie. parent=term_id
						sectionsList= allSectionsCollection.where 'parent': term_id

						#all the other sections are listed as subsections
						subsectionsList= _.difference(allSectionsCollection.models, sectionsList);
						allSections= 'sections': sectionsList, 'subsections': subsectionsList

						@view.triggerMethod 'fetch:subsections:complete', allSections


				@listenTo @view, "save:content:collection:details" :(data) ->
					console.log 'gotto add entity'
					#saveDetails = App.request "save:content:group:details", data
				
			_getCollectionDetailsView : (collection)->
				new collectionDetailsView
					collection: collection


		class collectionDetailsView extends Marionette.ItemView

			template 	: collectionDetailsTpl

			className 	: 'tiles white grid simple vertical green'

			events :
				'change #textbooks' :(e)-> 
										@$el.find('#secs, #subsecs').select2('data', null)
										@$el.find('#chapters, #secs, #subsecs').html('')
										@trigger "fetch:chapters", $(e.target).val()
				
				'change #chapters' 	:(e)-> @trigger "fetch:sections:subsections", $(e.target).val()

				'click #save-content-collection'	: 'save_content'

			onShow:->
				$("#textbooks").select2()
				$("#chapters").select2()
				#Multi Select
				$("#secs").val([]).select2()
				$("#subsecs").val([]).select2()

			onFetchChaptersComplete:(chapters)->
				if _.size(chapters)>0
					@$el.find('#chapters').html('');
					_.each chapters.models, (chap,index)=>
						@$el.find('#chapters').append('<option value="'+chap.get('term_id')+'">'+chap.get('name')+'</option>');
				else 
					@$el.find('#chapters').html('<option>No Chapters available</option>');

			onFetchSubsectionsComplete:(allsections)->
				if _.size(allsections)>0
					if _.size(allsections.sections)>0
						@$el.find('#secs').html('');
						_.each allsections.sections, (section,index)=>
							@$el.find('#secs').append('<option value="'+section.get('term_id')+'">'+section.get('name')+'</option>');
					else 
						@$el.find('#secs').html('<option>No Sections available</option>');

					if _.size(allsections.subsections)>0
						@$el.find('#subsecs').html('');
						_.each allsections.subsections, (section,index)=>
							@$el.find('#subsecs').append('<option value="'+section.get('term_id')+'">'+section.get('name')+'</option>');
					else 
						@$el.find('#subsecs').html('<option>No Sub Sections available</option>');
				else 
					@$el.find('#secs').html('<option>No Sections available</option>');
					@$el.find('#subsecs').html('<option>No Sub Sections available</option>');


			save_content:(e)->
				e.preventDefault()
				if @$el.find('form').valid()
					data = Backbone.Syphon.serialize (@)
					@trigger "save:content:collection:details",data

		# set handlers
		App.commands.setHandler "show:collections:detailsapp", (opt = {})->
			new Controller.CollecionDetailsController opt		

