define ['app'
        'text!apps/student-training-module/take-module/item-description/templates/top-panel.html'], (App,TopPanelTemplate)->
    App.module "StudentTrainingApp.TopPanel.Views", (Views, App, Backbone, Marionette, $, _)->
        class Views.TopPanelView extends Marionette.ItemView

            template: TopPanelTemplate

            events :->
                'click #top-panel-question-done': =>
                    @trigger 'top:panel:question:done'
                'click #top-panel-previous': =>
                    @trigger 'top:panel:previous'

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

                @$el.find('#question-type-col, #correct-answer-col').hide() if @model.get('content_type') in ['content_piece','student_question']

                @$el.find('#total-marks').hide() if @model.get('content_type') isnt 'student_question'

                timeLeftOrElapsed = Marionette.getOption @,'timeLeftOrElapsed'

                if @mode is 'class_mode'
                    if timeLeftOrElapsed < 0
                        @countUp timeLeftOrElapsed
                    else @countDown timeLeftOrElapsed
                    
                @trigger 'top:panel:check:last:question'

            countDown:(time)=>

                @$el.find '#downUpTimer'
                .attr 'timerdirection','countDown'
                .countdown 'destroy'
                .countdown
                    until: time
                    format: 'MS'
                    onExpiry: @countUp

            countUp:(time=0)=>

                @$el.find '#downUpTimer'
                .attr 'timerdirection','countUp'
                .addClass 'negative'
                .countdown 'destroy'
                .countdown since: time, format: 'MS'

            onShowTotalMarks : (marks)->
                console.log(marks)
                console.log @$el.find('#total-marks span').text marks
