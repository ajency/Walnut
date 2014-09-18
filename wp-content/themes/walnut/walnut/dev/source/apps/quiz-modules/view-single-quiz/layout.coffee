define ['app'
        'controllers/region-controller'], 
(App, RegionController)->
    
    App.module "QuizModuleApp.ViewQuiz.LayoutView", (LayoutView, App)->

        class LayoutView.QuizViewLayout extends Marionette.Layout

            template: '<div class="teacher-app">
                            {{#practice_mode}}
                                <div class="well text-center">
                                    <h4><span class="bold">This is a practice quiz.
                                        It is designed to help you train for the class tests.</span></h4>
                                </div>
                            {{/practice_mode}}
                            {{^practice_mode}}
                                <div class="well text-center">
                                    <h4><span class="bold">This is a class test and can be attempted just once, therefore ensure you have answered all questions before ending the quiz.</span></h4>
                                </div>
                            {{/practice_mode}}
                            <div id="attempts-region"></div>
                            <div id="quiz-details-region"></div>
                        </div>
                        <div id="content-display-region"></div>'

            regions:
                attemptsRegion: '#attempts-region'
                quizDetailsRegion: '#quiz-details-region'
                contentDisplayRegion: '#content-display-region'

            mixinTemplateHelpers:(data)->
                
                data.practice_mode=true if @model.get('quiz_type') is 'practice'

                data

            onShow:->
                $('.page-content').removeClass 'expand-page'