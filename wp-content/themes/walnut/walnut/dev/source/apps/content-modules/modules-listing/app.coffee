define ['app'
        'controllers/region-controller'
        'apps/content-modules/modules-listing/modules-listing-controller'
        'apps/content-modules/modules-listing/search-results-app'
        'apps/textbook-filters/textbook-filters-app'], (App, RegionController)->

		App.module "ContentModulesApp.ModulesListing", (ModulesListing, App)->
			class ModulesListing.ListController extends RegionController

				textbooksCollection = null
				divisionsCollection = null
				schoolsCollection   = null

				initialize: (options)->

					{@groupType} = options

					@division = 0

					divisionsCollection = App.request "get:divisions"
					App.execute "when:fetched", divisionsCollection, @_fetchTextbooks
				_fetchTextbooks:=>
                
                	class_id= divisionsCollection.first().get 'class_id'
                	division= divisionsCollection.first().get 'id'

                	if @groupType == 'teaching-module'
                		textbooksCollection = App.request "get:textbooks", "fetch_all":true
                	else
                		textbooksCollection = App.request "get:textbooks", 'class_id' : class_id

                	App.execute "when:fetched", textbooksCollection, => 
                	App.execute "when:fetched", textbooksCollection, @_fetchQuizzes

				_fetchQuizzes:=>
					textbook = textbooksCollection.first()
					@division= divisionsCollection.first().get 'id'
					if @groupType == 'teaching-module'
						data = 
							'post_status': 'any' 
							'textbook'   : textbook.id
					else
						data = 
							'post_status': 'any' 
							'textbook'   : textbook.id
							'division'	 : @division

					if @groupType is 'teaching-module'
						@contentModulesCollection = App.request "get:content:groups", data

					else if @groupType is 'student-training'

						@contentModulesCollection = App.request "get:student:training:modules", data
					else
						console.log data
						@contentModulesCollection = App.request "get:quizes", data

					#wreqr object to get the selected filter parameters so that search can be done using them
					@selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse()

					@layout = @_getContentPiecesLayout()

					App.execute "when:fetched", [@contentModulesCollection, textbooksCollection], =>


						@show @layout,
							loading: true

						@listenTo @layout, "show",=>
							console.log @groupType
							dataType = switch @groupType
											when 'teaching-module' then 'teaching-modules'
											when 'student-training' then 'student-training'
											else 'quiz'

							if @groupType == 'quiz'
								App.execute "show:textbook:filters:app",
									region: @layout.filtersRegion
									collection: @contentModulesCollection
									textbooksCollection: textbooksCollection
									selectedFilterParamsObject: @selectedFilterParamsObject
									divisionsCollection: divisionsCollection
									dataType : dataType
									post_status: 'any'
									filters : ['divisions','multi_textbooks', 'module_status']
							else
								App.execute "show:textbook:filters:app",
									region: @layout.filtersRegion
									collection: @contentModulesCollection
									textbooksCollection: textbooksCollection
									selectedFilterParamsObject: @selectedFilterParamsObject
									#divisionsCollection: divisionsCollection
									dataType : dataType
									post_status: 'any'
									filters : ['textbooks','chapters', 'sections', 'subsections', 'module_status']

							App.execute "show:list:all:modules:app",
								region: @layout.allContentRegion
								contentModulesCollection: @contentModulesCollection
								textbooksCollection: textbooksCollection
								groupType : @groupType
								division: @division

							new ModulesListing.SearchResults.Controller
								region: @layout.searchResultsRegion
								textbooksCollection: textbooksCollection
								selectedFilterParamsObject: @selectedFilterParamsObject
								division: @division
								groupType : @groupType

						@listenTo @layout.filtersRegion, "update:pager",=> @layout.allContentRegion.trigger "update:pager"

						###@listenTo @view, "save:communications", (data)=>
                        
                            data=
                                component           : 'quiz'
                                communication_type  : 'quiz_completed_parent_mail'
                                communication_mode  : data.communication_mode
                                additional_data:
                                    quiz_ids        : data.quizIDs
                                    division        : @division

                            communicationModel = App.request "create:communication",data
                            @_showSelectRecipientsApp communicationModel###

				_getContentPiecesLayout:->
					console.log "_getContentPiecesLayout"
					new ContentPiecesLayout
						groupType : @groupType

				###_showSelectRecipientsApp:(communicationModel)->
				console.log communicationModel
				App.execute "show:quiz:select:recipients:popup",
                    region               : App.dialogRegion
                    communicationModel   : communicationModel###


			class ContentPiecesLayout extends Marionette.Layout
				template : '<div class="grid-title no-border">
								<h4 class="">List of <span class="semi-bold">{{type}}</span></h4>
								<div class="tools">
									<a href="javascript:;" class="collapse"></a>
								</div>
							</div>

							<div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;">

								<div id="filters-region" class="m-b-10"></div>

								<ul class="nav nav-tabs b-grey b-l b-r b-t" id="addContent">
							  	<li class="active"><a href="#all-content-region"><span class="semi-bold">All</span> Modules</a></li>
							  	<li><a href="#search-results-region"><span class="semi-bold">Search</span> Modules</a></li>
								</ul>

								<div id="tab-content" class="tab-content" >
									<div id="all-content-region" class="tab-pane active"></div>
									<div id="search-results-region" class="tab-pane"></div>
								</div>
							</div>'

				className: 'tiles white grid simple vertical green'

				regions:
					filtersRegion       : '#filters-region'
					allContentRegion    : '#all-content-region'
					searchResultsRegion : '#search-results-region'

				events:
					'click #addContent a': 'changeTab'

				mixinTemplateHelpers : (data)->
					data = super data
					data.type = _.titleize _.humanize Marionette.getOption @, 'groupType'
					data

				changeTab: (e)->
					e.preventDefault()

					@$el.find '#addContent a'
					.removeClass 'active'

					$(e.target).closest 'a'
					.addClass 'active'
						.tab 'show'

			App.commands.setHandler 'show:module:listing:app',(options)->
				new ModulesListing.ListController options