define ['app'
        'controllers/region-controller'
        'apps/take-module-item/teacher-training-footer/training-footer-view']
, (App, RegionController)->
    App.module "TeacherTrainingFooter", (TeacherTrainingFooter, App)->
        class TeacherTrainingFooter.Controller extends RegionController

            initialize:(opts)->
                {contentPiece} = opts

                @question_type = contentPiece.get 'question_type'
                @contentPieceId = contentPiece.get 'ID'

                @view = @_getFooterView contentPiece

                @show @view

            _getFooterView :(contentPiece) ->

                new TeacherTrainingFooter.Views.TrainingFooterView
                    question_type : @question_type
                    model: contentPiece


        App.commands.setHandler "show:teacher:training:footer:app", (opt = {})->
            new TeacherTrainingFooter.Controller opt

