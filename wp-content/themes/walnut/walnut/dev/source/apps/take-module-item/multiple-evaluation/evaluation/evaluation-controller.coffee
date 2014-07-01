define ['app'
        'controllers/region-controller'
        'apps/take-module-item/multiple-evaluation/evaluation/evaluation-views'
], (App, RegionController)->
    App.module "SingleQuestionMultipleEvaluationApp.EvaluationApp", (EvaluationApp, App)->
        class EvaluationApp.Controller extends RegionController

            initialize : (options)->
                @evaluationCollection = Marionette.getOption @, 'evaluationCollection'
                @studentModel = Marionette.getOption @, 'studentModel'
                @responseObj = Marionette.getOption @, 'responseObj'
                @display_mode = Marionette.getOption(@, 'display_mode')


                @view = @_showEvaluationView()

                @listenTo @view, 'save:eval:parameters', @_saveEvalParameters

                @show @view

            _showEvaluationView : ->

                new EvaluationApp.Views.EvaluationView
                    collection : @evaluationCollection
                    studentModel : @studentModel
                    responseObj : @responseObj
                    display_mode : @display_mode

            _saveEvalParameters : ->
                @region.trigger 'save:eval:parameters', @responseObj