define ['app'
        'controllers/region-controller'
        'text!apps/teachers-dashboard/take-class/templates/class-description.html'
        'apps/teachers-dashboard/take-class/views'
], (App, RegionController, classDescriptionTpl)->
    App.module "TeachersDashboardApp.View", (View, App)->
        divisionModel = null
        textbooks = null

        #List of textbooks available to a teacher for training or to take a class

        class View.TakeClassController extends RegionController

            initialize: (opts)->
                console.log opts
                {@classID,@division, @mode} = opts

                breadcrumb_label = 'Start Training'

                if @mode is 'take-class'
                    divisionModel = App.request "get:division:by:id", @division
                    breadcrumb_label = 'Take Class'
                else
                    divisionModel = ''

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': '#teachers/dashboard'},
                        {'label': breadcrumb_label, 'link': 'javascript://'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                textbooks = App.request "get:textbooks", (class_id: @classID)

                @layout = layout = @_getTrainingModuleLayout()

                @show layout, (loading: true, entities: [textbooks, divisionModel])

                @listenTo layout, "show", @_showTextbooksListView



            _showTextbooksListView: ->
                App.execute "when:fetched", textbooks, =>
                    textbookListView = new View.TakeClass.TextbooksListView
                        collection: textbooks


                    classDescriptionView = new ClassDescriptionView

                    #model: divisionModel

                        templateHelpers:
                            showSubjectsList: =>
                                subjectsList = _.uniq _.compact(_.flatten(textbooks.pluck('subjects')))
                                subjectsList

                            showClassLabel: =>
                                if @mode is 'training'
                                    CLASS_LABEL[@classID]
                                else
                                    divisionModel.get 'division'

                            showNoOfStudents: =>
                                if @mode is 'training'
                                    'N/A'
                                else
                                    divisionModel.get 'students_count'

                      @layout.textbooksListRegion.show(textbookListView)

                      @layout.classDetailsRegion.show(classDescriptionView)

            _getTrainingModuleLayout: ->
                new TextbookListLayout

        class TextbookListLayout extends Marionette.Layout

            template: '<div id="class-details-region"></div>
            							<div id="textbooks-list-region"></div>'

            regions:
                classDetailsRegion: '#class-details-region'
                textbooksListRegion: '#textbooks-list-region'


        class ClassDescriptionView extends Marionette.ItemView

            template: classDescriptionTpl