define ["app", 'backbone'], (App, Backbone) ->
    App.module "Entities.ContentGroup", (ContentGroup, App, Backbone, Marionette, $, _)->


        # content group model
        class ContentGroup.ItemModel extends Backbone.Model

            idAttribute: 'id'

            defaults:
                name: ''
                description: []
                created_on: ''
                created_by: ''
                last_modified_on: ''
                last_modified_by: ''
                published_on: ''
                published_by: ''
                post_status: 'underreview'  # eg. underreview, publish, archive
                type: 'teaching-module'
                total_minutes: 0
                duration: 0
                minshrs: 'mins'
                term_ids: []
                content_pieces: []
                training_date: ''

            name: 'content-group'



        # collection of group of content pieces eg. quizzes, teacher training modules etc.
        class ContentGroup.ItemCollection extends Backbone.Collection
            model: ContentGroup.ItemModel
            name: 'content-group'

            url: ->
                AJAXURL + '?action=get-content-groups'

            parse: (resp)->
                resp.data.reverse()

        contentModulesRepository= new ContentGroup.ItemCollection

        # API
        API =
        # get all content groups
            getContentGroups: (param = {})->

                contentGroupCollection = new ContentGroup.ItemCollection

                contentGroupCollection.fetch
                    add : true
                    remove : false
                    data : param
                    type : 'post'
                    success:(resp)-> 
                        if not param.search_str
                            contentModulesRepository.reset resp.models

                contentGroupCollection


            getContentGroupByID: (id)->
                contentGroup = contentGroupCollection.get id if contentGroupCollection?

                if not contentGroup
                    contentGroup = new ContentGroup.ItemModel 'id': id
                    contentGroup.fetch()
                contentGroup


            saveContentGroupDetails: (data)->
                contentGroupItem = new ContentGroup.ItemModel data
                contentGroupItem

            newContentGroup:->
                contentGroup = new ContentGroup.ItemModel

            scheduleContentGroup:(data)->
                questionResponseModel= App.request "save:question:response"

                questionResponseModel.set data

                questionResponseModel.save()


            getEmptyModulesCollection: ()->

                contentGroupCollection = new ContentGroup.ItemCollection

            getDummyModules:(content_piece_id)->
                contentGroup = new ContentGroup.ItemModel

                contentGroup.set 
                    'id' : 3423432
                    name: 'Dummy Module'
                    description: 'Dummy Module Description'
                    created_on: ''
                    created_by: ''
                    last_modified_on: ''
                    last_modified_by: ''
                    published_on: ''
                    published_by: ''
                    post_status: ''  # eg. underreview, publish, archive
                    type: 'teaching-module'
                    total_minutes: 0
                    duration: 40
                    minshrs: 'mins'
                    term_ids: []
                    content_pieces: [content_piece_id]
                    training_date: ''



        # request handler to get all content groups
        App.reqres.setHandler "get:content:groups", (opt) ->
            API.getContentGroups(opt)

        App.reqres.setHandler "get:content:group:by:id", (id)->
            API.getContentGroupByID id

        App.reqres.setHandler "save:content:group:details", (data)->
            API.saveContentGroupDetails data

        App.reqres.setHandler "new:content:group",->
            API.newContentGroup()

        App.reqres.setHandler "schedule:content:group", (data)->
            API.scheduleContentGroup data

        App.reqres.setHandler "empty:content:modules:collection", ->
            API.getEmptyModulesCollection()

        App.reqres.setHandler "create:dummy:content:module", (content_piece_id)->
            API.getDummyModules content_piece_id

        App.reqres.setHandler "get:content:modules:repository",->
            contentModulesRepository.clone()
