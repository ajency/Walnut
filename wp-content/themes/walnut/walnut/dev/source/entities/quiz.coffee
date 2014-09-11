define ["app", 'backbone'], (App, Backbone) ->
    App.module "Entities.Quiz", (Quiz, App, Backbone, Marionette, $, _)->


        # content group model
        class Quiz.ItemModel extends Backbone.Model

            idAttribute: 'id'

            defaults : ->
                name: ''
                description: []
                created_on: ''
                created_by: ''
                last_modified_on: ''
                last_modified_by: ''
                published_on: ''
                published_by: ''
                post_status: 'underreview'
                type: 'quiz'
                quiz_type : 'practice'
                marks : 0
                total_minutes: 0
                duration: 0
                minshours: 'mins'
                negMarksEnable: 'false'
                negMarks: ''
                term_ids: []
                content_pieces: []
                message : {}
                content_layout:[]

            name: 'quiz'

            hasPermission:(permsission)->
                all_permissions = @.get 'permissions'
                if all_permissions[permsission] then return true else return false

            getMessageContent:(message_type)->
                default_messages =
                    end_quiz                    : 'You really want to end the quiz?'
                    submit_without_attempting   : 'You havent answered the question. Are you sure you want to continue?'
                    incomplete_answer           : 'You havent completed the question. Are you sure you want to continue?'
                    correct_answer              : 'You are correct!'
                    incorrect_answer            : 'Sorry, you did not answer correctly'
                    partial_correct_answers     : 'You are almost correct'
                    quiz_time_up                : 'Sorry, your time is up'

                message_content = default_messages[message_type]

                if not _.isEmpty @.get 'message'
                    custom_messages= @.get 'message'
                    message_content = custom_messages[message_type] if custom_messages[message_type]

                message_content



        # collection of group of content pieces eg. quizzes, teacher training modules etc.
        class Quiz.ItemCollection extends Backbone.Collection
            model: Quiz.ItemModel


            url: ->
                AJAXURL + '?action=get-quizes'

            parse: (resp)->
                resp.data
        
        quizRepository= new Quiz.ItemCollection

        # API
        API =
        # get all content groups
            getQuizes: (param = {})->

                quizCollection = new Quiz.ItemCollection

                quizCollection.fetch
                    reset: true
                    data: param
                    success:(resp)-> 
                        if not param.search_str
                            quizRepository.reset resp.models

                quizCollection


            getQuizByID: (id)->
                quiz = quizCollection.get id if quizCollection?

                if not quiz
                    quiz = new Quiz.ItemModel 'id': id
                    quiz.fetch()
                quiz


            saveQuizDetails: (data)->
                quizItem = new Quiz.ItemModel data
                quizItem

            newQuiz:->
                new Quiz.ItemModel

            getDummyQuiz:(content_piece_id)->
                dummyQuiz = new Quiz.ItemModel()

                dummyQuiz.set 
                    id      : 3423432
                    name: 'Dummy Module'
                    description: 'Dummy Module Description'
                    type: 'quiz'
                    quiz_type : 'test'
                    duration: 40
                    content_pieces: [content_piece_id]
                    permissions: 
                        allow_skip: true
                        display_answer: true
                        allow_hint: true

                dummyQuiz
                
        # request handler to get all content groups
        App.reqres.setHandler "get:quizes", (opt) ->
            API.getQuizes(opt)

        App.reqres.setHandler "get:quiz:by:id", (id)->
            API.getQuizByID id

        App.reqres.setHandler "save:quiz:details", (data)->
            API.saveQuizDetails data

        App.reqres.setHandler "new:quiz",->
            API.newQuiz()


        App.reqres.setHandler "create:dummy:quiz:module", (content_piece_id)->
            API.getDummyQuiz content_piece_id

        App.reqres.setHandler "get:quiz:repository",->
            quizRepository.clone()