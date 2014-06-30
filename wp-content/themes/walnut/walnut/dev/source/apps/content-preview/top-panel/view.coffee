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
                if @model.get('content_type') is 'content_piece'
                    @$el.find '#question-type-col, #correct-answer-col'
                    .hide()

                if @mode is 'class_mode'
                    qTimer = @$el.find 'div.cpTimer'

                    qTime= qTimer.data 'timer'
                    timerColor = '#1ec711'

                    if qTime <10
                        timerColor = '#f8a616'

                    if qTime <0
                        timerColor = '#ea0d0d'

                    qTimer.TimeCircles
                        time:
                            Days:
                                show:false
                            Hours:
                                show:false
                            Minutes:
                                color: timerColor
                            Seconds:
                                color: timerColor

                        circle_bg_color: "#d6d5d4"
                        bg_width: 0.2

                    .addListener (unit,value,total)->
                            if total is 10
                                qTimer.data 'timer',10
                                qTimer.TimeCircles
                                    time:
                                        Days:
                                            show:false
                                        Hours:
                                            show:false
                                        Minutes:
                                            color: '#f8a616'
                                        Seconds:
                                            color: '#f8a616'
                            else if total is 5
                                console.log 'The expected time for this question is almost over.'

                            else if total is -1
                                qTimer.TimeCircles
                                    time:
                                        Days:
                                            show:false
                                        Hours:
                                            show:false
                                        Minutes:
                                            color: '#ea0d0d'
                                        Seconds:
                                            color: '#ea0d0d'

            onShowTotalMarks : (marks)->
                console.log(marks)
                console.log @$el.find('#total-marks span').text marks