define ['app'
        'text!apps/content-preview/top-panel/templates/top-panel.html'], (App,TopPanelTemplate)->
    App.module "ContentPreview.TopPanel.Views", (Views, App, Backbone, Marionette, $, _)->
        class Views.TopPanelView extends Marionette.ItemView


            template: TopPanelTemplate

            mixinTemplateHelpers:(data)->
                data = super data
                if data.question_type is 'multiple_eval'
                    data.question_type = 'multiple Evaluation'

                data.isTraining = if @mode is 'training' then true else false
                data

            initialize:->
                @mode = Marionette.getOption(@, 'display_mode')

            onShow:->

                @$el.find('#correct-answer-col').hide() if @model.get('question_type') is 'multiple_eval'

                @$el.find('#question-type-col, #correct-answer-col').hide() if @model.get('content_type') is 'content_piece'

                @$el.find('#total-marks').hide() if @model.get('content_type') isnt 'student_question'

                timeLeftOrElapsed = Marionette.getOption @,'timeLeftOrElapsed'

                if @mode is 'class_mode'
                    $('#downUpTimer').countdown
                        until: timeLeftOrElapsed
                        format: 'MS'
                        onExpiry: @countUp

            countUp:->
                $('#downUpTimer').countdown 'destroy'
                $('#downUpTimer').countdown since: -0, format: 'MS'

            onShowTotalMarks : (marks)->
                console.log(marks)
                console.log @$el.find('#total-marks span').text marks
