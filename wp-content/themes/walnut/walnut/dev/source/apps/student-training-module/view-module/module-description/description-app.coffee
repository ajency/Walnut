define ['app'
        'controllers/region-controller'
        'text!apps/student-training-module/view-module/module-description/templates/module-description.html'], (App, RegionController, collectionDetailsTpl)->
    App.module "StudentTrainingApp.Controller", (Controller, App)->
        class Controller.ViewCollecionDetailsController extends RegionController

            initialize : (opts)->

                # for take-class module the template changes a bit
                # so based on this value (@mode) we set the template additional stuff
                {@model,@mode,@questionResponseCollection,@textbookNames}= opts
				
                @view = view = @_getCollectionDetailsView()

                @listenTo view, 'start:training:module', =>
                    @region.trigger "start:training:module"

                @listenTo view, 'goto:previous:route', @_gotoPreviousRoute

                @show view, (loading : true, entities : [@textbookNames])

            _gotoPreviousRoute : ->

                currRoute = App.getCurrentRoute()

                newRoute = _(currRoute).strLeft '/module'

                App.navigate newRoute, true

            _getCollectionDetailsView : ->
                terms = @model.get 'term_ids'

                numOfQuestionsCompleted = _.size @questionResponseCollection.where "status" : "completed"
                totalNumofQuestions = _.size @model.get 'content_pieces'

                new CollectionDetailsView
                    model : @model
                    mode : @mode
                    templateHelpers : @_getTemplateHelpers
                        terms : terms
                        numOfQuestionsCompleted : numOfQuestionsCompleted
                        totalNumofQuestions : totalNumofQuestions


            _getTemplateHelpers : (options)->
                showElapsedTime : =>
                    timeTakenArray = @questionResponseCollection.pluck('time_taken');
                    totalTimeTakenForModule = 0
                    if _.size(timeTakenArray) > 0
                        totalTimeTakenForModule = _.reduce timeTakenArray, (memo, num)->
                            parseInt memo + parseInt num

                    display_time = $.timeMinSecs totalTimeTakenForModule

                getProgressData : ->
                    options.numOfQuestionsCompleted + '/' + options.totalNumofQuestions

                getProgressPercentage : ->
                    parseInt (options.numOfQuestionsCompleted / options.totalNumofQuestions) * 100

                getTextbookName : =>
                    textbook = @textbookNames.get options.terms.textbook
                    texbookName = textbook.get 'name' if textbook?

                getChapterName : =>
                    chapter = @textbookNames.get options.terms.chapter
                    chapterName = chapter.get 'name' if chapter?

        class CollectionDetailsView extends Marionette.ItemView

            template : collectionDetailsTpl



            events :
                'click #start-module' : 'startModule'
                'click #go-back-button' : ->
                    @trigger "goto:previous:route"

            mixinTemplateHelpers : (data)->
                data = super(data)
                data.takeClassModule = @mode
                data.isTraining = if @mode is 'training' then true else false
                data

            initialize : ->
                @mode = Marionette.getOption @, 'mode'

            startModule : =>
                currentRoute = App.getCurrentRoute()

                @trigger "start:training:module"


        # set handlers
        App.commands.setHandler "show:student:training:content:group:detailsapp", (opt = {})->
            new Controller.ViewCollecionDetailsController opt

