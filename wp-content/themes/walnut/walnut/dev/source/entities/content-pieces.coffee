define ["app", 'backbone'], (App, Backbone) ->
    App.module "Entities.ContentPiece", (ContentPiece, App, Backbone, Marionette, $, _)->

        # ContentPiece model
        class ContentPiece.ItemModel extends Backbone.Model

            idAttribute: 'ID'

            defaults:
                ID: 0
                post_title: ''
                post_author: ''
                post_modified: ''
                post_date: ''
                post_tags: ''

            name: 'content-piece'


        # ContentPiece collection class
        class ContentPiece.ItemCollection extends Backbone.Collection
            model: ContentPiece.ItemModel
            comparator: 'ID'
            name: 'content-piece'

            url: ->
                AJAXURL + '?action=get-content-pieces'


        # collection of content pieces in a content group. eg. questions in a quiz
        class ContentPiece.GroupItemCollection extends Backbone.Collection
            model: ContentPiece.ItemModel
            comparator: 'ID'
            name: 'CONTENT-PIECE-NEW'

            initialize: ->
                @on('remove', @removedModel, @)
                @on('add', @addedPieces, @)

            removedModel: (model)=>
                @trigger "content:pieces:of:group:removed", model

            addedPieces: (model)=>
                @trigger "content:pieces:of:group:added", model


        contentPiecesOfGroup = new ContentPiece.GroupItemCollection

        # API
        API =
        # get all content pieces
            getContentPieces: (param = {})->
                contentPieceCollection = new ContentPiece.ItemCollection
                contentPieceCollection.fetch
                    reset: true
                    data: param

                contentPieceCollection

        # get all content pieces belonging to particular group
            getContentPiecesOfGroup: (groupModel)->
                contentIDs = groupModel.get('content_pieces')

                if contentIDs
                    for contentID in contentIDs
                        contentModel = contentPieceCollection.get contentID if contentPieceCollection?

                        if not contentModel
                            contentModel = new ContentPiece.ItemModel 'ID': contentID
                            contentModel.fetch()

                        contentPiecesOfGroup.add contentModel

                contentPiecesOfGroup



            getContentPieceByID: (id)->
                contentPiece = contentPieceCollection.get id if contentPieceCollection?

                if not contentPiece
                    contentPiece = new ContentPiece.ItemModel ID: id
                    contentPiece.fetch()
                contentPiece

            getContentPiecesByIDs: (ids = [])->
                if _.size(ids) > 0
                    contentPieces = new ContentPiece.ItemCollection
                    contentPieces.fetch
                        data:
                            ids: ids
                    contentPieces

            
            #get all content pieces from local database
            getContentPieceFromLocal:(ids)->
                    
                runMainQuery = ->
                    $.Deferred (d)->
                        _.db.transaction (tx)->
                            tx.executeSql("SELECT * FROM wp_posts WHERE post_type = 'content-piece' 
                                AND post_status = 'publish' AND ID in ("+ids+")", [], onSuccess(d), _.deferredErrorHandler(d))

                onSuccess =(d)->
                    (tx,data)->
                        result = []
                        i = 0
                        while i < data.rows.length
                            r = data.rows.item(i)

                            do(r, i)->
                                questionType = _.getQuestionType(r['ID'])
                                questionType.done (question_type)->
                                        
                                    result[i] = 
                                        ID: r['ID']
                                        post_author: r['post_author']
                                        post_date: r['post_date']
                                        post_date_gmt: r['post_date_gmt']
                                        post_content: r['post_content']
                                        post_title: r['post_title']
                                        post_excerpt: r['post_excerpt']
                                        post_status: r['post_status']
                                        comment_status: r['comment_status']
                                        ping_status: r['ping_status']
                                        post_password: r['post_password']
                                        post_name: r['post_name']
                                        to_ping: r['to_ping']
                                        pinged: r['pinged']
                                        post_modified: r['post_modified']
                                        post_modified_gmt: r['post_modified_gmt']
                                        post_content_filtered: r['post_content_filtered']
                                        post_parent: r['post_parent']
                                        guid: r['guid']
                                        menu_order: r['menu_order']
                                        post_type: r['post_type']
                                        post_mime_type: r['post_mime_type']
                                        comment_count: r['comment_count']
                                        question_type: question_type

                                        #Need to implement
                                        filter: 'raw'
                                        subjects: ''
                                        creator: 'admin'
                                        content_type: ''
                                            
                            i++
                            
                        d.resolve(result)

                $.when(runMainQuery()).done (d)->
                    console.log 'getContentPieceFromLocal transaction completed'
                .fail _.failureHandler        

        


        # request handler to get all ContentPieces
        App.reqres.setHandler "get:content:pieces", (opt) ->
            API.getContentPieces(opt)


        # request handler to get all ContentPieces
        App.reqres.setHandler "get:content:pieces:of:group", (groupModel) ->
            API.getContentPiecesOfGroup(groupModel)

        App.reqres.setHandler "get:content:piece:by:id", (id)->
            API.getContentPieceByID id

        App.reqres.setHandler "get:content:pieces:by:ids", (ids)->
            API.getContentPiecesByIDs ids


        # request handler to get all ContentPieces from local database
        App.reqres.setHandler "get:content-piece:local", (ids) ->
            API.getContentPieceFromLocal ids    
