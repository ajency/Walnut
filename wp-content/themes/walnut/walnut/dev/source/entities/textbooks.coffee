define ["app", 'backbone'], (App, Backbone) ->
    App.module "Entities.Textbooks", (Textbooks, App, Backbone, Marionette, $, _)->


        # textbook model
        class Textbooks.ItemModel extends Backbone.Model

            idAttribute: 'term_id'

            defaults:
                name: ''
                slug: ''
                description: ''
                parent: 0
                term_order: 0
                count: 0
                chapter_count: 0

            name: 'textbook'


        # textbook model
        class Textbooks.NameModel extends Backbone.Model

            defaults:
                name: ''

            name: 'textbookName'

        # textbooks collection class
        class Textbooks.ItemCollection extends Backbone.Collection
            model: Textbooks.ItemModel
            comparator: 'term_order'
            url: ->
                AJAXURL + '?action=get-textbooks'

            parse: (resp)->
                @total = resp.count
                resp.data

            fetchChaptersOrSections: (parentID)->
                chaptersOrSectionsCollection = App.request "get:chapters", ('parent' : parentID)


        # textbooks collection class
        class Textbooks.NamesCollection extends Backbone.Collection
            model: Textbooks.NameModel
            comparator: 'term_order'
            url: ->
                AJAXURL + '?action=get-textbook-names'


        # API
        API =
        # get all textbooks
            getTextbooks: (param = {})->
                textbookCollection = new Textbooks.ItemCollection
                textbookCollection.fetch
                    reset: true
                    data: param

                textbookCollection


            getTextBookByID: (id)->
                textbook = textbookCollection.get id if textbookCollection?

                if not textbook
                    textbook = new Textbooks.ItemModel term_id: id
                    textbook.fetch()
                textbook

            getTextBookNameByID: (id)->
                textbook = textbookCollection.get id if textbookCollection?

                if not textbook
                    textbook = new Textbooks.ItemModel term_id: id
                    textbook.fetch()

                textbookName = textbook.get('name')

                textbookName

            getTextBookNamesByIDs: (ids)->
                ids = _.compact _.flatten ids
                textbookNamesCollection = new Textbooks.NamesCollection
                textbookNamesCollection.fetch
                    reset: true
                    data:
                        term_ids: ids

                textbookNamesCollection


        # request handler to get all textbooks
        App.reqres.setHandler "get:textbooks", (opt) ->
            API.getTextbooks(opt)

        App.reqres.setHandler "get:textbook:by:id", (id)->
            API.getTextBookByID id

        App.reqres.setHandler "get:textbook:name:by:id", (id)->
            API.getTextBookNameByID id


        App.reqres.setHandler "get:textbook:names:by:ids", (ids)->
            API.getTextBookNamesByIDs ids
