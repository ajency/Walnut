define ['app'
        'controllers/region-controller'
        'apps/teachers-dashboard/teacher-teaching-module/teacher-training-footer/training-footer-view']
, (App, RegionController)->
    App.module "TeacherTrainingFooter", (TeacherTrainingFooter, App)->
        class TeacherTrainingFooter.Controller extends RegionController

            initialize:(opts)->
                {contentPiece, @nextItemID} = opts

                @question_type = contentPiece.get 'question_type'
                @contentPieceId = contentPiece.get 'ID'

                console.log @contentPieceId
                @view = @_getFooterView contentPiece

                @listenTo @view, "next:question", @_changeQuestion

                @show @view

            _changeQuestion : ->
                @region.trigger 'goto:next:question', @contentPieceId


            _getFooterView :(contentPiece) ->

                new TeacherTrainingFooter.Views.TrainingFooterView
                    question_type : @question_type
                    model: contentPiece
                    nextItemID: @nextItemID


        App.commands.setHandler "show:teacher:training:footer:app", (opt = {})->
            new TeacherTrainingFooter.Controller opt

