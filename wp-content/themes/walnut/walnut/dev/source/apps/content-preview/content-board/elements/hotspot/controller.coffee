define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/hotspot/view'],
		(App,Element)->

        App.module "ContentPreview.ContentBoard.Element.Hotspot" ,
        (Hotspot, App, Backbone, Marionette,$, _)->


            # menu controller
            class Hotspot.Controller extends Element.Controller

                # intializer
                initialize:(options)->

                    answerData =
                        answer : []
                        marks : 0
                        comment : 'Not Attempted'
                    @answerModel = App.request "create:new:answer",answerData

                    super(options)

                _getHotspotView:()->

                    new Hotspot.Views.HotspotView
                        model : @layout.model
                        answerModel: @answerModel



                # setup templates for the element
                renderElement:()=>
                    @optionCollection = App.request "create:new:hotspot:element:collection",@layout.model.get 'optionCollection'
                    @textCollection = App.request "create:new:hotspot:element:collection",@layout.model.get 'textCollection'
                    @imageCollection = App.request "create:new:hotspot:element:collection",@layout.model.get 'imageCollection'


                    @layout.model.set 'optionCollection',@optionCollection
                    @layout.model.set 'textCollection',@textCollection
                    @layout.model.set 'imageCollection',@imageCollection



                    App.execute "show:total:marks",@layout.model.get 'marks'
                    # @removeSpinner()
                    # get menu
                    @view = @_getHotspotView()

                    @listenTo @view, "submit:answer", @_submitAnswer

                    @layout.elementRegion.show @view,
                        loading:true

                _submitAnswer:->
                    console.log @optionCollection
                    correctOptions = @optionCollection.where {correct:true}
                    console.log correctOptions
                    correctOptionsIds = _.pluck correctOptions,'id'
                    console.log correctOptionsIds
                    answerId = _.pluck @answerModel.get('answer'),'id'

                    if @layout.model.get 'enableIndividualMarks'
                        console.log _.difference(answerId,correctOptionsIds)
                        if not _.difference(answerId,correctOptionsIds).length
                            if not _.difference(correctOptionsIds,answerId).length
                               @answerModel.set 'marks',@layout.model.get 'marks'
                            else
                                answersNotMarked = _.difference(correctOptionsIds,answerId)
                                totalMarks = @layout.model.get 'marks'
                                _.each answersNotMarked,(notMarked)=>
                                    console.log @optionCollection.findWhere({id:notMarked})
                                    totalMarks -= @optionCollection.findWhere({id:notMarked}).get('marks')
                                @answerModel.set 'marks',totalMarks


                    else
                        unless _.difference(answerId,correctOptionsIds).length or _.difference(correctOptionsIds,answerId).length
                           @answerModel.set 'marks',@layout.model.get 'marks'



                    App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')

                    # if @answerModel.get('marks') < @layout.model.get('marks')
                    @view.triggerMethod 'show:feedback'



