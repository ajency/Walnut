define ['app'
        'controllers/region-controller'
        'apps/teachers-dashboard/teacher-teaching-module/teacher-training-footer/training-footer-view']
, (App, RegionController)->
    App.module "TeacherTrainingFooter", (TeacherTrainingFooter, App)->
        class TeacherTrainingFooter.Controller extends RegionController

            initialize:->

                @question_type = Marionette.getOption @,'question_type'
                @contentPieceId = Marionette.getOption @,'contentPieceId'

                console.log @contentPieceId
                @view = @_getFooterView()

                @listenTo @view, "next:question", @_changeQuestion

                @show @view

            _changeQuestion : ->
                @region.trigger 'goto:next:question', @contentPieceId


            _getFooterView : ->

                new TeacherTrainingFooter.Views.TrainingFooterView
                    question_type : @question_type






        App.commands.setHandler "show:teacher:training:footer:app", (opt = {})->
            new TeacherTrainingFooter.Controller opt

