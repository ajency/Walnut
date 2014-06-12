define ["app", 'backbone'], (App, Backbone) ->
    App.module "Entities.ContentPiece", (ContentPiece, App, Backbone, Marionette, $, _)->

        # ContentPiece model
        class ContentPiece.ItemModel extends Backbone.Model

            idAttribute: 'ID'

            defaults:
                ID: 0
                post_title: ''
                post_author: ''
                post_author_name: ''
                post_modified: ''
                post_date: ''
                post_tags: ''
                order   : ''

            name: 'content-piece'


        # ContentPiece collection class
        class ContentPiece.ItemCollection extends Backbone.Collection
            model: ContentPiece.ItemModel
            comparator: 'order'
            url: ->
                AJAXURL + '?action=get-content-pieces'


        # collection of content pieces in a content group. eg. questions in a quiz
        class ContentPiece.GroupItemCollection extends Backbone.Collection
            model: ContentPiece.ItemModel
            comparator: 'order'

            initialize: ->
                console.log 'content piece '
                @on('remove', @removedModel, @)
                @on('add', @addedPieces, @)

            removedModel: (model)=>
                @trigger "content:pieces:of:group:removed", model

            addedPieces: (model)=>
                @trigger "content:pieces:of:group:added", model



        # API
        API =
        # get all content pieces
            getContentPieces: (param = {})->
                contentPieceCollection = new ContentPiece.ItemCollection
                contentPieceCollection.fetch
                    reset: true
                    add: true
                    remove: false
                    data: param
                contentPieceCollection

        # get all content pieces belonging to particular group
            getContentPiecesOfGroup: (groupModel)->

                contentPiecesOfGroup = new ContentPiece.GroupItemCollection

                contentIDs = groupModel.get('content_pieces')

                if contentIDs
                    for contentID in contentIDs
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
                contentPieces = new ContentPiece.ItemCollection
                if _.size(ids) > 0
                    contentPieces.fetch
                        data:
                            ids: ids

                contentPieces

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
