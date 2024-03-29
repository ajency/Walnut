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
            
            getClasses:->
                classesArray = []
                classes = @.get 'classes'

                if _.isArray classes
                    classesArray.push(CLASS_LABEL[classLabel]) for classLabel in classes
                    classesArray.join()
                #console.log 'classes'
                #console.log classesArray
                classesArray


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
                #console.log resp
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

            getTextbookName:(terms)->
                #console.log  terms
                textbook = @.get terms.textbook
                texbookName = textbook.get 'name' if textbook?

            getChapterName:(terms)->
                chapter = @.get terms.chapter
                chapterName = chapter.get 'name' if chapter?

            getSectionsNames:(terms)->
                sections = _.flatten terms.sections
                sectionString = ''
                sectionNames = []

                if sections
                    for section in sections
                        term = @.get section
                        sectionName = term.get 'name' if term?
                        sectionNames.push sectionName

                    sectionString = sectionNames.join()

            getSubSectionsNames:(terms)->
                subsections = _.flatten terms.subsections
                subSectionString = ''
                subsectionNames = []

                if subsections
                    for sub in subsections
                        subsection = @.get sub
                        subsectionNames.push subsection.get 'name' if subsection?

                    subSectionString = subsectionNames.join()



        # API
        API =
        # get all textbooks
            getTextbooks: (param = {})->
                #console.log param
                textbookCollection = new Textbooks.ItemCollection
                textbookCollection.fetch
                    reset: true
                    data: param

                textbookCollection


            getTextBookByID: (id)->
                textbook = textbookCollection.get id if textbookCollection?
                #console.log 'getTextBookByID'
                #console.log textbook
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
