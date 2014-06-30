define ['app'
        'controllers/region-controller'
        'apps/content-preview/top-panel/view'
], (App, RegionController)->
    App.module "ContentPreview.TopPanel", (TopPanel, App, Backbone, Marionette, $, _)->
        class TopPanel.Controller extends RegionController

            initialize: (options)->

                {@model,@questionResponseModel,@timerObject, @display_mode,@classID,@students} = options

                textbook_termIDs = _.flatten @model.get 'term_ids'

                @textbookNames = App.request "get:textbook:names:by:ids", textbook_termIDs

                @durationInSeconds= @model.get('duration')*60

                textbookID= @model.get('term_ids').textbook
                @textbookModel= App.request "get:textbook:by:id",textbookID

                @view = @_showView @model,@questionResponseModel

                App.execute "when:fetched", [@textbookNames, @textbookModel], =>
                    @show @view, (loading: true)

                if @display_mode is 'class_mode'
                    @timerObject.setHandler "get:elapsed:time", ()=>
                        timerTime= $ @view.el
                        .find '.cpTimer'
                            .TimeCircles()
                            .getTime()

                        timeElapsed = @durationInSeconds - timerTime

                        timeElapsed

            getResults:=>
                correct_answer= 'No One'
                names= []
                response= @questionResponseModel.get 'question_response'
                if @model.get('question_type') is 'chorus'
                    if response
                        correct_answer= CHORUS_OPTIONS[response]
                else if @model.get('question_type') is 'individual'
                    for studID in response
                        answeredCorrectly = @students.where("ID":studID)
                        name= ans.get('display_name') for ans in answeredCorrectly
                        names.push(name)

                    if _.size(names)>0
                        student_names=names.join(', ')
                        correct_answer=  _.size(names)+ ' Students ('+ student_names+ ')'

                else
                    correct_answer = false

                correct_answer

            _showView:(model,questionResponseModel) =>

                terms = model.get 'term_ids'


                new TopPanel.Views.TopPanelView
                    model: model
                    display_mode: @display_mode

                    templateHelpers:
                        timeLeftOrElapsed:=>
                            timeTaken=0

                            responseTime= questionResponseModel.get('time_taken') if questionResponseModel

                            if responseTime and responseTime isnt 'NaN'
                                timeTaken= responseTime

                            timer= @durationInSeconds - timeTaken

                        getClass: =>
                            classesArray=[]
                            classes= @textbookModel.get 'classes'

                            if _.isArray classes
                                classesArray.push(CLASS_LABEL[classLabel]) for classLabel in classes
                                classesArray.join()

                            classesArray

                        getTextbookName: =>
                            textbook = @textbookNames.get terms.textbook
                            texbookName = textbook.get 'name' if textbook?

                        getChapterName: =>
                            chapter = @textbookNames.get terms.chapter
                            chapterName = chapter.get 'name' if chapter?

                        getSectionsNames: =>
                            sections = _.flatten terms.sections
                            sectionString = ''
                            sectionNames = []

                            if sections
                                for section in sections
                                    term = @textbookNames.get section
                                    sectionName = term.get 'name' if term?
                                    sectionNames.push sectionName

                                sectionString = sectionNames.join()

                        getSubSectionsNames: =>
                            subsections = _.flatten terms.subsections
                            subSectionString = ''
                            subsectionNames = []

                            if subsections
                                for sub in subsections
                                    subsection = @textbookNames.get sub
                                    subsectionNames.push subsection.get 'name' if subsection?

                                subSectionString = subsectionNames.join()

                        getCompletedSummary:=>
                            if questionResponseModel and questionResponseModel.get("status") is 'completed'
                                minutes= parseInt questionResponseModel.get("time_taken") / 60
                                seconds = parseInt questionResponseModel.get("time_taken") % 60
                                time_taken_string= minutes + 'm '+seconds+'s'
                                correct_answer= @getResults()

                                '
                                <div class="p-r-20 p-b-10 p-l-20">
                                    <div class="b-grey b-b m-b-10 p-b-5">
                                        <div class="qstnStatus"><i class="fa fa-check-circle"></i> Completed</div>
                                  </div>
                                <div class="b-grey b-b m-b-10 p-b-5">
                                      <label class="form-label bold small-text muted no-margin">Time Alloted:</label>'+model.get("duration")+' mins<br>
                                    </div>
                                    <div class="b-grey b-b m-b-10 p-b-5">
                                      <label class="form-label bold small-text muted no-margin">Time Taken:</label>'+time_taken_string+'
                                  </div>
                                <div id="correct-answer-col">
                                    <div class="b-grey b-b m-b-10 p-b-5">
                                            <label class="form-label bold small-text muted no-margin">Correct Answer:</label>' +correct_answer+'
                                    </div>
                                </div>
                                </div>'




        App.commands.setHandler 'show:top:panel', (options)->
            new TopPanel.Controller options
