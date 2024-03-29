define ['app'
        'controllers/region-controller'
        'apps/admin-content-modules/views'
        'apps/admin-content-modules/recipients-popup/controller'
], (App, RegionController, classDescriptionTpl)->

    App.module "AdminContentModulesApp.View", (View, App)->

        #List of textbooks available to a teacher for training or to take a class
        class View.AdminModulesController extends RegionController
            initialize: ->

                @contentGroupsCollection    = null
                @allChaptersCollection      = null
                @textbooksCollection        = null

                @divisionsCollection = App.request "get:divisions"

                App.execute "when:fetched", @divisionsCollection, =>
                    division= @divisionsCollection.first().get 'id'
                    class_id= @divisionsCollection.first().get 'class_id'
                    @contentGroupsCollection = App.request "get:content:groups",
                        division: division
                        class_id: class_id
                        post_status: 'publish'

                    @textbooksCollection = App.request "get:textbooks", ('class_id': class_id)
                    App.execute "when:fetched", [@contentGroupsCollection,@textbooksCollection], =>
                        #division= @textbooksCollection.first().get 'id'
                        chapter_ids= _.chain @contentGroupsCollection.pluck 'term_ids'
                        .pluck 'chapter'
                            .unique()
                            .compact()
                            .value()

                        #all chapter names in this set of contentgroupscollection
                        @allChaptersCollection = App.request "get:textbook:names:by:ids", chapter_ids

                        App.execute "when:fetched", [@allChaptersCollection,@textbooksCollection], =>

                            @view = view = @_getContentGroupsListingView @contentGroupsCollection

                            @show @view,(loading: true)

                            @listenTo @view, "fetch:chapters:or:sections", (parentID, filterType) =>
                                chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
                                App.execute "when:fetched", chaptersOrSections, =>
                                    @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType

                            @listenTo @view, "division:changed", (division)=>
                                class_id = @divisionsCollection.findWhere 'id': division
                                .get 'class_id'

                                newModulesCollection = App.request "get:content:groups",
                                    division    : division
                                    class_id    : class_id
                                    post_status: 'publish'

                                @textbooksCollection = App.request "get:textbooks", ('class_id': class_id)
                                App.execute "when:fetched", [newModulesCollection,@textbooksCollection ], =>
                                    @view.triggerMethod "new:collection:fetched", newModulesCollection,@textbooksCollection

                            @listenTo @view, "save:communications", (data)=>
                                data=
                                    component           : 'teaching_modules'
                                    communication_type  : 'taught_in_class_parent_mail'
                                    communication_mode  : data.communication_mode
                                    additional_data:
                                        module_ids      : data.moduleIDs
                                        division        : data.division

                                #save communication for type taught_in_class_parent_mail
                                communicationModel = App.request "create:communication",data
                                @_showSelectRecipientsApp communicationModel

            _showSelectRecipientsApp:(communicationModel)->
                App.execute "show:modules:select:recipients:popup",
                    region               : App.dialogRegion
                    communicationModel   : communicationModel

            _getContentGroupsListingView: (collection)=>
                new View.AdminModulesView.ModulesView
                    collection          : collection
                    textbooksCollection : @textbooksCollection
                    chaptersCollection  : @allChaptersCollection
                    divisionsCollection : @divisionsCollection




        # set handlers
        App.commands.setHandler "show:all:content:modules:app", (opt = {})->
            new View.AdminModulesController opt