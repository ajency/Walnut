define ['app'
        'controllers/region-controller'
        'apps/content-creator/grading-parameter/grading-parameter-view'
], (App, RegionController)->
    App.module "ContentCreator.GradingParameter", (GradingParameter, App)->
        class GradingParameter.Controller extends RegionController

            initialize : (options)->
                @contentPieceModel = options.contentPieceModel
                gradingParamsData = @contentPieceModel.get 'grading_params'
                @gradingParamsCollection = App.request 'get:grading:parameter:collection', gradingParamsData

                @view = @_getView()

                @listenTo @view, 'itemview:save:grading:parameter', @_saveGradingCollection

                @listenTo @view, 'itemview:delete:grading:parameter', @_deleteParameter

                @listenTo @view, 'add:new:grading:parameter', @_addNewParameter

                @_setMinCollectionSizeAsTwo()


                @show @view,
                    loading : true
                    entities : @gradingParamsCollection

            _setMinCollectionSizeAsTwo: ->
                while @gradingParamsCollection.size() < 2
                    gradingParamsModel = App.request "get:grading:parameter"
                    @gradingParamsCollection.push gradingParamsModel

            _getView : ->
                new GradingParameter.Views.GradingParamsView
                    collection : @gradingParamsCollection

            _saveGradingCollection : ->
                @contentPieceModel.set 'grading_params', @gradingParamsCollection.toJSON()

            _deleteParameter: (options)->
                @gradingParamsCollection.remove options.model
                @contentPieceModel.set 'grading_params', @gradingParamsCollection.toJSON()
                @_setMinCollectionSizeAsTwo()

            _addNewParameter : ->
                gradingParamsModel = App.request "get:grading:parameter"
                @gradingParamsCollection.push gradingParamsModel


        App.commands.setHandler 'show:grading:parameter:view', (options)->
            console.log 'show:grading:parameter:view'
            new GradingParameter.Controller options
