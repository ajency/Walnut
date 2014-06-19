define ['app'
        'controllers/region-controller'
        'apps/content-group/groups-listing/group-listing-views'
], (App, RegionController)->
    App.module "ContentGroupApp.GroupListing", (GroupListing, App, Backbone, Marionette, $, _)->
        class GroupListing.Controller extends RegionController

            initialize : ->
                @contentGroupCollection = App.request "get:content:groups"
                @textbooksCollection = App.request "get:textbooks"

                breadcrumb_items =
                    'items' : [
                        { 'label' : 'Dashboard', 'link' : 'javascript://' },
                        { 'label' : 'Content Management', 'link' : 'javascript:;' },
                        { 'label' : 'View All Content Groups', 'link' : 'javascript:;', 'active' : 'active' }
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                App.execute "when:fetched", [@contentGroupCollection, @textbooksCollection], =>
                    @fullCollection = @contentGroupCollection.clone()


                    @view = view = @_getContentGroupsListingView()

                    @listenTo @view, "fetch:chapters", (term_id) =>
                        chaptersCollection = App.request "get:chapters", ('parent' : term_id)
                        App.execute "when:fetched", chaptersCollection, =>
                            chapterList = chaptersCollection.where 'parent':term_id
                            @view.triggerMethod 'fetch:chapters:complete', chapterList

                    @listenTo @view, "fetch:sections", (term_id) =>
                        console.log 'in fetch sections'
                        allSectionsCollection = App.request "get:subsections:by:chapter:id", ('child_of' : term_id)
                        App.execute "when:fetched", allSectionsCollection, =>
                            #make list of sections directly belonging to chapter ie. parent=term_id
                            sectionsList = allSectionsCollection.where 'parent' : term_id

                            #all the other sections are listed as subsections
                            @subSectionsList = _.difference(allSectionsCollection.models, sectionsList);
                            #                            allSections =
                            #                                'sections': sectionsList
                            #                                'subsections': subsectionsList

                            @view.triggerMethod 'fetch:sections:complete', sectionsList

                    @listenTo @view, "fetch:subsections", (term_id)=>
                        subSectionList = null
                        subSectionList = _.filter @subSectionsList, (subSection)->
                            subSection.get('parent') is term_id
                        #                        subSectionList = _.where @subSectionsList, 'parent':"#{term_id}"
                        console.log @subSectionsList
                        console.log subSectionList
                        @view.triggerMethod 'fetch:subsections:complete', subSectionList

                    @show view,
                        loading : true
                        entities : [@contentGroupCollection, @textbooksCollection, @fullCollection]

            _getContentGroupsListingView : =>
                new GroupListing.Views.GroupsListingView
                    collection : @contentGroupCollection
                    fullCollection : @fullCollection
                    textbooksCollection : @textbooksCollection




