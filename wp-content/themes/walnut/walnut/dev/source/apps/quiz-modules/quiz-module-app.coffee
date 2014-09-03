define ['app'
        'apps/quiz-modules/view-single-quiz/single-quiz-controller'
],(App)->
    App.module 'QuizModuleApp',(QuizModuleApp,App)->

        class QuizModuleRouter extends Marionette.AppRouter

            appRoutes :
                'create-quiz'   : 'createQuiz'
                'edit-quiz/:id' : 'editQuiz'
                'quiz-list'     : 'showQuizList'
                'view-quiz/:id' : 'viewQuiz'
                'students/dashboard/textbook/:tID/quiz/:qID': 'startQuizClassMode'
                'dummy-quiz/:content_piece_id' : 'showDummyQuiz'


        Controller =

            viewQuiz: (id)->
                new QuizModuleApp.ViewQuiz.Controller
                    region: App.mainContentRegion
                    quiz_id: id

            startQuizClassMode:(tID,qID)->
                new QuizModuleApp.ViewQuiz.Controller
                    region: App.mainContentRegion
                    quiz_id: qID

            createQuiz : ->
                App.execute 'show:edit:module:controller',
                    region : App.mainContentRegion
                    groupType : 'quiz'

            editQuiz : (id)->
                App.execute 'show:edit:module:controller',
                    region : App.mainContentRegion
                    group_id : id
                    groupType : 'quiz'

            showQuizList : ->
                App.execute 'show:module:listing:app',
                    region: App.mainContentRegion
                    groupType : 'quiz'

            showDummyQuiz:(content_piece_id)->
                @contentPiece = App.request "get:content:piece:by:id", content_piece_id

                questionsCollection = App.request "empty:content:pieces:collection"

                App.execute "when:fetched", @contentPiece, =>
                    questionsCollection.add @contentPiece

                    dummyQuizModel= App.request "create:dummy:quiz:module", content_piece_id
                    term_ids = @contentPiece.get 'term_ids'
                    dummyQuizModel.set 'term_ids': term_ids

                    textbookNames = App.request "get:textbook:names:by:ids", term_ids
                    data= 
                        'student_id': 5
                        'collection_id' : 152

                    quizResponseSummary = App.request "create:quiz:response:summary", data
                    App.execute "when:fetched", textbookNames, =>
                        App.execute "start:take:quiz:app",
                            region: App.mainContentRegion
                            quizModel               : dummyQuizModel
                            quizResponseSummary     : quizResponseSummary
                            questionsCollection     : questionsCollection
                            display_mode            : 'take-quiz'
                            textbookNames           : textbookNames

        QuizModuleApp.on 'start',->
            new QuizModuleRouter
                controller : Controller

