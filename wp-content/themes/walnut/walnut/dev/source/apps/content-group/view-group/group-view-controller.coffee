define ['app'
        'controllers/region-controller'
        'text!apps/content-group/edit-group/templates/content-group.html'
        'apps/content-group/view-group/group-details/details-app'
        'apps/content-group/view-group/content-display/content-display-app'
], (App, RegionController, contentGroupTpl)->
    App.module "ContentGroupApp.View", (View, App)->
        class View.GroupController extends RegionController

            model= null
            groupContentCollection=null

            initialize: (opts) ->
                #mode refers to "training" mode or "take-class" mode
                {model,@classID, @mode, @division} = opts

                @questionResponseCollection = App.request "get:question:response:collection",
                    'division': @division
                    'collection_id': model.get 'id'


                @studentCollection = App.request "get:user:collection", ('role': 'student', 'division': @division)

                App.execute "when:fetched", model, ->
                    groupContentCollection = App.request "get:content:pieces:by:ids", model.get 'content_pieces'

                @layout = layout = @_getContentGroupViewLayout()

                @show layout, (loading: true, entities: [model, @questionResponseCollection, groupContentCollection,
                                                         @textbookNames, @studentCollection])

                @listenTo layout, 'show', @showContentGroupViews

                @listenTo @layout.collectionDetailsRegion, 'start:teaching:module', @startTeachingModule

                @listenTo @layout.contentDisplayRegion, 'goto:question:readonly', (questionID)=>
                    App.navigate App.getCurrentRoute() + '/question'
                    @gotoTrainingModule questionID, 'readonly'


            startTeachingModule: =>
                responseCollection= @questionResponseCollection.where "status":"completed"

                responseQuestionIDs = _.chain responseCollection
                                    .map (m)->m.toJSON()
                                    .pluck 'content_piece_id'
                                    .value()

                content_pieces = model.get 'content_pieces'
                if content_pieces
                    content_piece_ids= _.map content_pieces, (m)-> parseInt m

                nextQuestion = _.first _.difference content_piece_ids, responseQuestionIDs

                @gotoTrainingModule nextQuestion, 'class_mode'

            gotoTrainingModule: (question, display_mode)=>
                display_mode = 'training' if @mode is 'training'


                App.execute "start:teacher:teaching:app",
                    region: App.mainContentRegion
                    division: @division
                    contentPiece: groupContentCollection.get question
                    questionResponseCollection: @questionResponseCollection
                    contentGroupModel: model
                    questionsCollection: groupContentCollection
                    classID: @classID
                    studentCollection: @studentCollection
                    display_mode: display_mode # when display mode is readonly, the save response options are not shown
            # only when display mode is class_mode response changes can be done

            showContentGroupViews: =>
                textbook_termIDs = _.flatten model.get 'term_ids'
                @textbookNames = App.request "get:textbook:names:by:ids", textbook_termIDs

                App.execute "when:fetched", @textbookNames, =>
                    App.execute "show:viewgroup:content:group:detailsapp",
                        region: @layout.collectionDetailsRegion
                        model: model
                        mode: @mode
                        questionResponseCollection: @questionResponseCollection
                        textbookNames: @textbookNames

                    if _.size(model.get('content_pieces')) > 0
                        App.execute "show:viewgroup:content:displayapp",
                            region: @layout.contentDisplayRegion
                            model: model
                            mode: @mode
                            questionResponseCollection: @questionResponseCollection
                            groupContentCollection: groupContentCollection
                            studentCollection: @studentCollection

            _getContentGroupViewLayout: =>
                new ContentGroupViewLayout


        class ContentGroupViewLayout extends Marionette.Layout

            template: contentGroupTpl

            className: ''

            regions:
                collectionDetailsRegion: '#collection-details-region'
                contentDisplayRegion: '#content-display-region'


            onShow:->
                $('.page-content').removeClass 'expand-page'




