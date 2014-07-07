define ['app'
        'apps/content-preview/content-board/element/controller'
        'apps/content-preview/content-board/elements/hotspot/view'],
(App, Element)->
    App.module "ContentPreview.ContentBoard.Element.Hotspot",
    (Hotspot, App, Backbone, Marionette, $, _)->


        # menu controller
        class Hotspot.Controller extends Element.Controller

            # intializer
            initialize : (options)->
                answerData =
                    answer : []
                    marks : 0
                    comment : 'Not Attempted'
                @answerModel = App.request "create:new:answer", answerData

                super(options)

            _getHotspotView : ()->
                new Hotspot.Views.HotspotView
                    model : @layout.model
                    answerModel : @answerModel



            # setup templates for the element
            renderElement : ()=>
                optionCollectionArray = @layout.model.get 'optionCollection'

                textCollectionArray = @layout.model.get 'textCollection'

                imageCollectionArray = @layout.model.get 'imageCollection'

                @_parseArray optionCollectionArray, textCollectionArray, imageCollectionArray

                @optionCollection = App.request "create:new:hotspot:element:collection", optionCollectionArray
                @textCollection = App.request "create:new:hotspot:element:collection", textCollectionArray
                @imageCollection = App.request "create:new:hotspot:element:collection", imageCollectionArray


                @layout.model.set 'optionCollection', @optionCollection
                @layout.model.set 'textCollection', @textCollection
                @layout.model.set 'imageCollection', @imageCollection


                App.execute "show:total:marks", @layout.model.get 'marks'
                # @removeSpinner()
                # get menu
                @view = @_getHotspotView()

                @listenTo @view, "submit:answer", @_submitAnswer

                @layout.elementRegion.show @view,
                    loading : true

            _parseArray : (optionCollectionArray, textCollectionArray, imageCollectionArray)->
                _.each optionCollectionArray, (option)=>
                    @_parseObject option

                _.each textCollectionArray, (text)=>
                    @_parseObject text

                _.each imageCollectionArray, (image)=>
                    @_parseObject image

            _parseObject : (object)->
                Integers = ['radius', 'marks', 'width', 'height', 'angle', 'textAngle', 'fontSize']
                Floats = ['x', 'y']
                Booleans = ['toDelete', 'correct']

                _.each object, (value, key)->
                    object[key] = parseInt value if key in Integers
                    object[key] = parseFloat value if key in Floats
                    object[key] = _.toBoolean value if key in Booleans

            _submitAnswer : ->
                console.log @optionCollection
                correctOptions = @optionCollection.where { correct : true }
                console.log correctOptions
                correctOptionsIds = _.pluck correctOptions, 'id'
                console.log correctOptionsIds
                answerId = _.pluck @answerModel.get('answer'), 'id'

                if @layout.model.get 'enableIndividualMarks'
                    console.log _.difference(answerId, correctOptionsIds)
                    if not _.difference(answerId, correctOptionsIds).length
                        if not _.difference(correctOptionsIds, answerId).length
                            @answerModel.set 'marks', @layout.model.get 'marks'
                        else
                            answersNotMarked = _.difference(correctOptionsIds, answerId)
                            totalMarks = @layout.model.get 'marks'
                            _.each answersNotMarked, (notMarked)=>
                                console.log @optionCollection.findWhere({ id : notMarked })
                                totalMarks -= @optionCollection.findWhere({ id : notMarked }).get('marks')
                            @answerModel.set 'marks', totalMarks


                else
                    unless _.difference(answerId, correctOptionsIds).length or _.difference(correctOptionsIds,
                      answerId).length
                        @answerModel.set 'marks', @layout.model.get 'marks'


                App.execute "show:response", @answerModel.get('marks'), @layout.model.get('marks')

                # if @answerModel.get('marks') < @layout.model.get('marks')
                @view.triggerMethod 'show:feedback'



