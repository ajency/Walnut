define ['app'
        'controllers/region-controller'
        'text!apps/students-dashboard/textbooks/templates/class-description.html'
        'apps/students-dashboard/textbooks/views'
], (App, RegionController, classDescriptionTpl)->
    App.module "TeachersDashboardApp.View", (View, App)->
        divisionModel = null
        textbooks = null

        #List of textbooks available to a teacher for training or to take a class

        class View.TakeClassController extends RegionController

            initialize: (opts)->

                {@classID,@division, @mode} = opts

                breadcrumb_label = 'Start Training'
                console.log @mode
                if @mode in ['take-class','take-quiz']
                    divisionModel = App.request "get:division:by:id", @division
                    breadcrumb_label = 'Take Class'
                else
                    divisionModel = ''

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': '#students/dashboard'},
                        {'label': breadcrumb_label, 'link': 'javascript://'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                #changes made for DEVICE
                if @mode is 'take-quiz'
                    textbooks = App.request "get:textbooks", user_id: App.request "get:user:data", "ID"
                else
                    textbooks = App.request "get:textbooks", (class_id: @classID, division:@division )


                @layout = layout = @_getTrainingModuleLayout()
                
                @listenTo layout, "show", @_showTextbooksListView
                
                @show layout, (loading: true, entities: [textbooks, divisionModel])



            _showTextbooksListView: =>
                App.execute "when:fetched", textbooks, =>
                    textbookListView = new View.TakeClass.TextbooksListView
                        collection  : textbooks
                        mode        : @mode


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



        # set handlers
        App.commands.setHandler "show:take:class:textbooks:app", (opt = {})->
            new View.TakeClassController opt


