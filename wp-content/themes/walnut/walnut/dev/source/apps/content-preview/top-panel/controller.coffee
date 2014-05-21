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


                @view = @_showView @model,@questionResponseModel

                App.execute "when:fetched", [@textbookNames], =>
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
                else
                    for studID in response
                        answeredCorrectly = @students.where("ID":studID)
                        name= ans.get('display_name') for ans in answeredCorrectly
                        names.push(name)

                    if _.size(names)>0
                        student_names=names.join(', ')
                        correct_answer=  _.size(names)+ ' Students ('+ student_names+ ')'

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
                                CLASS_LABEL[@classID]

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

                                time_taken_in_mins= parseInt questionResponseModel.get("time_taken") / 60
                                correct_answer= @getResults()

                                '<div class="row">
                                      <div class="col-xs-6">
                                        <p>
                                          <label class="form-label bold small-text inline">Time Alloted:</label>'+model.get("duration")+'mins<br>
                                          <label class="form-label bold small-text inline">Time Taken:</label>'+time_taken_in_mins+'mins
                                        </p>
                                      </div>
                                      <div class="col-xs-6">
                                            <div class="qstnStatus p-t-10"><i class="fa fa-check-circle"></i> Completed</div>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col-sm-12">
                                        <p>
                                            <label class="form-label bold small-text inline">Correct Answer:</label>' +correct_answer+'
                                          </p>
                                        </div>
                                     </div>
                                </div>'




        App.commands.setHandler 'show:top:panel', (options)->
            new TopPanel.Controller options
