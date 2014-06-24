define ['app'
        'controllers/region-controller'
        'apps/take-module-item/multiple-evaluation/evaluation/evaluation-views'
],(App, RegionController)->
    App.module "SingleQuestionMultipleEvaluationApp.EvaluationApp",(EvaluationApp,App)->

        class EvaluationApp.Controller extends RegionController

            initialize :(options)->
                @evaluationCollection = Marionette.getOption @,'evaluationCollection'
                @studentModel = Marionette.getOption @,'studentModel'
                @responseObj = Marionette.getOption @, 'responseObj'

                @view = @_showEvaluationView()

                @listenTo @view , 'save:eval:parameters',@_saveEvalParameters

                @show @view

            _showEvaluationView : ->

                new EvaluationApp.Views.EvaluationView
                    collection : @evaluationCollection
                    studentModel : @studentModel
                    responseObj : @responseObj

            _saveEvalParameters : ->
                @region.trigger 'save:eval:parameters', @responseObj