define ['app'
        'apps/content-creator/content-builder/element/controller'
        'apps/content-creator/content-builder/elements/sort/views'],
(App, Element)->
    App.module "ContentCreator.ContentBuilder.Element.Sort", (Sort, App, Backbone, Marionette, $, _)->
        class Sort.Controller extends Element.Controller

            initialize : (options)->
                @eventObj = options.eventObj

                _.defaults options.modelData,
                    marks : 1
                    element : 'Sort'
                    optioncount : 2
                    elements : [
                        { optionNo : _.uniqueId(), index : 1 },
                        { optionNo : _.uniqueId(), index : 2 }
                    ]
                    bg_color : '#ffffff'
                    bg_opacity : 0.5
                    height : 40
                    complete : false
                    

                super options

                @layout.model.on 'change:optioncount', @_changeOptionCount

            renderElement : ->
                optionsObj = @layout.model.get 'elements'

                optionsObj = @layout.model.get('elements').toJSON() if @layout.model.get('elements') instanceof Backbone.Collection

                console.log optionsObj

                @_parseOptions optionsObj

                if not (optionsObj instanceof Backbone.Collection)
                    optionCollection = App.request "create:new:option:collection", optionsObj
                    optionCollection.comparator = 'index'
                    optionCollection.sort()
                    @layout.model.set 'elements', optionCollection

                # get the view
                @view = @_getSortView()# optionCollection

                # listen to show event, and trigger show property box event
                # listen to show property box event and show the property by passing the current model
                @listenTo @view, 'show show:this:sort:properties', =>
                    App.execute "show:question:properties",
                        model : @layout.model

                # # on show disable all question elements in d element box
#                @listenTo view, "show",=>
#                	@eventObj.vent.trigger "question:dropped"

                # show the view
                @layout.elementRegion.show @view

            _getSortView : ()->
                new Sort.Views.SortView
                    collection : @layout.model.get 'elements' #collection
                    sort_model : @layout.model

            _parseOptions:(optionsObj)->
                _.each optionsObj,(option)->
                    option.optionNo = parseInt option.optionNo if option.optionNo?
                    option.marks = parseInt option.marks if option.marks?
                    option.index = parseInt option.index if option.index?



            # on change of optionNo attribute in the model
            # change the number of options
            _changeOptionCount : (model, num)=>
                oldval = model.previous('optioncount')
                newval = num
                # if greater then previous then add option
                if oldval < newval
                    until oldval is newval
                        oldval++
                        model.get('elements').push({ optionNo : _.uniqueId(), index : oldval })
                # else remove options
                if oldval > newval
                    until oldval is newval
                        model.get('elements').pop() #remove model.get('elements').where({index:oldval})[0]
                        oldval--

#                @view.triggerMethod 'close'
                @renderElement()

                # on delete remove the collection from the model
                # coz the model cant be deleted with a collection in it
            deleteElement : (model)->
                model.set('elements', '')
                delete model.get 'elements'
                console.log model.get 'elements'
                super model
                App.execute "close:question:properties"
                # # on delete enable all question elements in d element box
                # @eventObj.vent.trigger "question:removed"