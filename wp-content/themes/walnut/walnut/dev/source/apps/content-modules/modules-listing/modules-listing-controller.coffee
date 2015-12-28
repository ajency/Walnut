define ['app'
        'controllers/region-controller'
        'apps/content-modules/modules-listing/modules-listing-views'
], (App, RegionController)->
	App.module "ContentModulesApp.ModulesListing", (ModulesListing, App, Backbone, Marionette, $, _)->
		class ModulesListing.Controller extends RegionController

			initialize :(opts) ->

				{ @contentModulesCollection,@textbooksCollection,@groupType } = opts
				
				@allChaptersCollection = null

				breadcrumb_items =
					'items' : [
						{ 'label' : 'Dashboard', 'link' : 'javascript://' },
						{ 'label' : 'Content Management', 'link' : 'javascript:;' },
						{ 'label' : 'View All Content Moduless', 'link' : 'javascript:;', 'active' : 'active' }
					]

				App.execute "update:breadcrumb:model", breadcrumb_items

				App.execute "when:fetched", [@contentModulesCollection, @textbooksCollection], =>
					chapter_ids= _.chain @contentModulesCollection.pluck 'term_ids'
					.pluck 'chapter'
						.unique()
						.compact()
						.value()

					#all chapter names in this set of contentModulesscollection
					@allChaptersCollection = App.request "get:textbook:names:by:ids", chapter_ids

					@fullCollection = @contentModulesCollection.clone()

					App.execute "when:fetched", @allChaptersCollection, =>
						@view = view = @_getContentModulessListingView()

						@show view,
							loading : true
							entities : [@contentModulesCollection, @textbooksCollection, @fullCollection]

						@listenTo @view, "fetch:chapters:or:sections", (parentID, filterType) =>
							chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
							App.execute "when:fetched", chaptersOrSections, =>
								@view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType

						@listenTo @region, "update:pager",=>
							@view.triggerMethod "update:pager"

			_getContentModulessListingView : =>
				new ModulesListing.Views.ModulesListingView
					collection          : @contentModulesCollection
					fullCollection      : @fullCollection
					textbooksCollection : @textbooksCollection
					chaptersCollection  : @allChaptersCollection
					groupType : @groupType



		# set handlers
		App.commands.setHandler "show:list:all:modules:app", (opt = {})->
			new ModulesListing.Controller opt


