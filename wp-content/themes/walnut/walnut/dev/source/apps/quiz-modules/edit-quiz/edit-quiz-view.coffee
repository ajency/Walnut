define ['app'],(App)->
    App.module 'QuizModuleApp.EditQuiz.Views', (Views,App)->

        class Views.EditQuizLayout extends Marionette.Layout

            template : '<div class="quiz-app" id="quiz-app">
                          <div id="quiz-details-region"></div>
                          <div id="content-selection-region"></div>
                        </div>
                        <div id="content-display-region"></div>'

            regions :
                quizDetailsRegion : '#quiz-details-region'
                contentSelectionRegion : '#content-selection-region'
                contentDisplayRegion : '#content-display-region'