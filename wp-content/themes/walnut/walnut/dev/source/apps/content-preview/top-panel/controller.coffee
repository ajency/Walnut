define ['app'
        'controllers/region-controller'
        'apps/content-preview/top-panel/view'
], (App, RegionController)->
    App.module "ContentPreview.TopPanel", (TopPanel, App, Backbone, Marionette, $, _)->
        class TopPanel.Controller extends RegionController

            initialize: (options)->

                {model,questionResponseModel,@timerObject, @display_mode,@classID} = options

                textbook_termIDs = _.flatten model.get 'term_ids'

                @textbookNames = App.request "get:textbook:names:by:ids", textbook_termIDs

                @durationInSeconds= model.get('duration')*60


                @view = @_showView model,questionResponseModel

                App.execute "when:fetched", @textbookNames, =>
                    @show @view, (loading: true)

                @timerObject.setHandler "get:elapsed:time", ()=>
                    timerTime= $ @view.el
                    .find '.cpTimer'
                        .TimeCircles()
                        .getTime()

                    timeElapsed = @durationInSeconds - timerTime

                    timeElapsed

            _showView:(model,questionResponseModel) =>

                terms = model.get 'term_ids'

                new TopPanel.Views.TopPanelView
                    model: model
                    display_mode: @display_mode

                    templateHelpers:
                        timeLeftOrElapsed:=>
                            timeTaken=0

                            responseTime= questionResponseModel.get 'time_taken'

                            timeTaken= responseTime if responseTime isnt 'NaN'

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



        App.commands.setHandler 'show:top:panel', (options)->
            new TopPanel.Controller options