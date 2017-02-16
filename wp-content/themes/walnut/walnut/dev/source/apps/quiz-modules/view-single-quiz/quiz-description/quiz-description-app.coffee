define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/view-single-quiz/quiz-description/templates/quiz-description.html', 'bootbox'], (App, RegionController, quizDetailsTpl, bootbox)->
    App.module "QuizModuleApp.Controller", (Controller, App)->
        class Controller.ViewCollecionDetailsController extends RegionController

            initialize : (opts)->
                $('.navbar .container-fluid').css("visibility","visible")
                
                {@model,@textbookNames, @display_mode,@quizResponseSummary}= opts
                
                #code added by kapil to block the quiz generations if there are insufficient questions due to deletion of set added questions STARTS
                if Marionette.getOption(@, 'display_mode') not in ['replay','quiz_report']
                    if @model._fetch.responseJSON.data.content_pieces != undefined
                        r = @model._fetch.responseJSON.data.content_layout
                        #console.log(@model._fetch.responseJSON.data)
                        c = @model._fetch.responseJSON.data.content_pieces.length
                        total = 0
                        i = 0
                        while i < r.length
                          if r[i].data  == undefined
                            total++
                            i++
                            continue
                          total += parseInt(r[i].data.lvl1) + parseInt(r[i].data.lvl2) + parseInt(r[i].data.lvl3)
                          i++

                        if(total > c)
                            bootbox.confirm 'Quiz could not be generated as there are less number of questions!',(result)=>
                                if result
                                    $("#take-quiz").hide()
                                else 
                                    $("#take-quiz").hide()
                #code added by kapil to block the quiz generations if there are insufficient questions due to deletion of set added questions ENDS


                @view = view = @_getQuizDescriptionView()

                @listenTo view, 'start:quiz:module', =>
                    @region.trigger "start:quiz:module"

                @listenTo view, 'try:again', =>
                    @region.trigger "try:again"

                @listenTo view, 'goto:previous:route', @_gotoPreviousRoute

                @show view

            _getQuizDescriptionView : ->

                terms = @model.get 'term_ids'

                new QuizDetailsView
                    model : @model
                    display_mode: @display_mode
                    quizResponseSummary: @quizResponseSummary

                    templateHelpers:
                        getTextbookName     :=> @textbookNames.getTextbookName terms
                        getChapterName      :=> @textbookNames.getChapterName terms
                        getQuestionsCount   :=> _.size @model.get 'content_pieces'


        class QuizDetailsView extends Marionette.ItemView

            template : quizDetailsTpl

            events :
                'click #take-quiz' :-> @trigger "start:quiz:module"
                'click #try-again' :-> @trigger "try:again"
                'click #go-back-button' : ->@trigger "goto:previous:route"

            initialize:->
                if @model.get('permissions') && @model.get('quiz_type') == 'class_test' && @model.get('status') == 'completed'
                    permission = @model.get 'permissions'
                    if(permission.displayAfterDays != '' && permission.displayAfterDays != undefined)
                        replay_after_day_min = (permission.displayAfterDays * 24 * 60)

                    else
                        replay_after_day_min = 0

                    if(permission.displayAfterHours != '' && permission.displayAfterHours != undefined)
                        after_hours_time_result = (permission.displayAfterHours).split(':')

                        after_hours_time = after_hours_time_result[0] * 60
                        after_hours_time_min = parseInt(after_hours_time_result[1]) + parseInt(after_hours_time)
                    else
                        after_hours_time_min = 0

                    if (permission.displayAfterDays == '' && permission.displayAfterHours == '')
                        replay_after_day_min = 24 * 60
                        after_hours_time_min = 0


                    total_replay_mins = parseInt(replay_after_day_min) + parseInt(after_hours_time_min)

                    taken_on_date = moment(@model.get 'taken_on').format('YYYY-MM-DD HH:mm:ss')

                    replay_take = moment(taken_on_date).add(total_replay_mins, 'minutes').format('YYYY-MM-DD HH:mm:ss')

                    today = moment().format('YYYY-MM-DD HH:mm:ss')

                    schedule = @model.get 'schedule'
                    to = schedule.to

                responseSummary = Marionette.getOption @, 'quizResponseSummary'
                if responseSummary.get('status') is 'started'    
                    @$el.find "#take-quiz"
                    .html 'Continue'

                if Marionette.getOption(@, 'display_mode') in ['replay','quiz_report']
                    
                    if @model.get('status') == 'completed' && Marionette.getOption(@, 'display_mode') == 'replay'
                        if moment(replay_take).diff(today, 'minutes') <= 0 && moment(to).diff(today, 'minutes') <= 0 
                            @model.get('permissions').display_answer = true
                            @$el.find "#take-quiz"
                            .html 'Replay'    
                        else
                            @$el.find "#take-quiz"
                            .remove()  

                    else if Marionette.getOption(@, 'display_mode') == 'quiz_report'
                        @model.get('permissions').display_answer = true 
                        @$el.find "#take-quiz"
                        .html 'Replay'         
                    
                    else if @model.hasPermission 'disable_quiz_replay'
                        @$el.find "#take-quiz"
                        .remove()
                    else
                        @$el.find "#take-quiz"
                        .html 'Replay'


            serializeData:->
                console.log 'serializeData'
                data = super data
                display_mode =  Marionette.getOption @, 'display_mode'

                data.quiz_report = true if display_mode is 'quiz_report'

                data.practice_mode =true if @model.get('quiz_type') is 'practice'

                responseSummary = Marionette.getOption @, 'quizResponseSummary'
                
                data.total_time_taken = $.timeMinSecs responseSummary.get 'total_time_taken'

                data.negMarksEnable= _.toBool data.negMarksEnable

                if _.isEmpty data.content_pieces
                    data.takeQuizError = 'Sorry this quiz has no questions in it.'

                else 
                    #console.log App.request "current:user:can", "view_all_quizzes"
                    if not data.status is 'completed' or App.request "current:user:can", "view_all_quizzes"
                        if data.quiz_type is 'class_test' and not IS_STANDALONE_SITE
                            console.log 'abc'
                            #data.takeQuizError = 'Class tests can be taken from school site only'

                if responseSummary.get('status') is 'completed'
                    data.responseSummary    = true
                    data.num_questions_answered = _.size(data.content_pieces) - responseSummary.get 'num_skipped'
                    permissions = @model.get('permissions')
                    data.display_marks = true if (@model.hasPermission 'display_answer'  || App.request "current:user:can", "view_all_quizzes")
                    if data.negMarksEnable
                        data.marks_scored = parseFloat responseSummary.get 'marks_scored'
                        data.negative_scored = parseFloat  responseSummary.get 'negative_scored'

                    data.total_marks_scored = parseFloat responseSummary.get 'total_marks_scored'
                    
                    if responseSummary.get('taken_on')
                        data.taken_on_date = moment(responseSummary.get('taken_on')).format("Do MMM YYYY")

                    else 
                        data.taken_on_date = moment().format("Do MMM YYYY")

                    data.try_again= true if data.practice_mode and display_mode isnt 'quiz_report'

                if responseSummary.get('status') is 'started'
                    data.incompleteQuiz = true
                    total= @model.get('total_minutes') * 60
                    elapsed = responseSummary.get('total_time_taken')

                    data.time_remaining = $.timeMinSecs total-elapsed 

                data  

            onShow:->
                console.log 'onShow'
                if @model.get('permissions') && @model.get('quiz_type') == 'class_test' && @model.get('status') == 'completed'
                    permission = @model.get 'permissions'
                    if(permission.displayAfterDays != '' && permission.displayAfterDays != undefined)
                        replay_after_day_min = (permission.displayAfterDays * 24 * 60)

                    else
                        replay_after_day_min = 0

                    if(permission.displayAfterHours != '' && permission.displayAfterHours != undefined)
                        after_hours_time_result = (permission.displayAfterHours).split(':')

                        after_hours_time = after_hours_time_result[0] * 60
                        after_hours_time_min = parseInt(after_hours_time_result[1]) + parseInt(after_hours_time)
                    else
                        after_hours_time_min = 0

                    if (permission.displayAfterDays == '' && permission.displayAfterHours == '')
                        replay_after_day_min = 24 * 60
                        after_hours_time_min = 0


                    total_replay_mins = parseInt(replay_after_day_min) + parseInt(after_hours_time_min)

                    taken_on_date = moment(@model.get 'taken_on').format('YYYY-MM-DD HH:mm:ss')

                    replay_take = moment(taken_on_date).add(total_replay_mins, 'minutes').format('YYYY-MM-DD HH:mm:ss')

                    #console.log replay_take

                    today = moment().format('YYYY-MM-DD HH:mm:ss')

                    #console.log today

                    #quiz schedule
                    schedule = @model.get 'schedule'
                    to = schedule.to

                responseSummary = Marionette.getOption @, 'quizResponseSummary'
                if responseSummary.get('status') is 'started'    
                    @$el.find "#take-quiz"
                    .html 'Continue'

                if Marionette.getOption(@, 'display_mode') in ['replay','quiz_report']
                    
                    if @model.get('status') == 'completed' && Marionette.getOption(@, 'display_mode') == 'replay'
                        if moment(replay_take).diff(today, 'minutes') <= 0 && moment(to).diff(today, 'minutes') <= 0 
                            @model.get('permissions').display_answer = true
                            @$el.find "#take-quiz"
                            .html 'Replay'    
                        else
                            @$el.find "#take-quiz"
                            .remove()  

                    else if Marionette.getOption(@, 'display_mode') == 'quiz_report'
                        @model.get('permissions').display_answer = true 
                        @$el.find "#take-quiz"
                        .html 'Replay'         
                    
                    else if @model.hasPermission 'disable_quiz_replay'
                    #if @model.hasPermission 'disable_quiz_replay'
                        @$el.find "#take-quiz"
                        .remove()
                    else
                        @$el.find "#take-quiz"
                        .html 'Replay'
                    

        # set handlers
        App.commands.setHandler "show:view:quiz:detailsapp", (opt = {})->
            new Controller.ViewCollecionDetailsController opt
