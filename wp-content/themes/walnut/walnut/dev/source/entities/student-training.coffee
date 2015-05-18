define ["app", 'backbone'], (App, Backbone) ->
    App.module "Entities.StudentTraining", (StudentTraining, App, Backbone, Marionette, $, _)->


        # content group model
        class StudentTraining.ItemModel extends Backbone.Model

            idAttribute: 'id'

            defaults:
                name: ''
                description: []
                created_on: ''
                created_by: ''
                last_modified_on: ''
                last_modified_by: ''
                published_on: ''
                published_by: ''
                post_status: 'underreview'  # eg. underreview, publish, archive
                type: 'student-training'
                total_minutes: 0
                duration: 0
                minshrs: 'mins'
                term_ids: []
                content_pieces: []
                training_date: ''

            name: 'student-training-module'



        # collection of group of content pieces eg. quizzes, teacher training modules etc.
        class StudentTraining.ItemCollection extends Backbone.Collection
            model: StudentTraining.ItemModel

            url: ->
                AJAXURL + '?action=get-student-training-modules'

            parse: (resp)->
                resp.data.reverse()

        studentTrainingRepository= new StudentTraining.ItemCollection

        # API
        API =
        # get all content groups
            getStudentTrainingModules: (param = {})->

                studentTrainingCollection = new StudentTraining.ItemCollection

                studentTrainingCollection.fetch
                    add : true
                    remove : false
                    data : param
                    type : 'post'
                    success:(resp)-> 
                        if not param.search_str
                            studentTrainingRepository.reset resp.models

                studentTrainingCollection


            getStudentTrainingByID: (id)->
                studentTraining = studentTrainingCollection.get id if studentTrainingCollection?

                if not studentTraining
                    studentTraining = new StudentTraining.ItemModel 'id': id
                    studentTraining.fetch()
                studentTraining


            saveStudentTrainingDetails: (data)->
                studentTrainingItem = new StudentTraining.ItemModel data
                studentTrainingItem

            newStudentTrainingModule:->
                studentTraining = new StudentTraining.ItemModel

            scheduleStudentTraining:(data)->
                questionResponseModel= App.request "save:question:response"

                questionResponseModel.set data

                questionResponseModel.save()
					
        # request handler to get all content groups
        App.reqres.setHandler "get:student:training:modules", (opt) ->
            API.getStudentTrainingModules(opt)

        App.reqres.setHandler "get:student:training:by:id", (id)->
            API.getStudentTrainingByID id

        App.reqres.setHandler "save:student:training:details", (data)->
            API.saveStudentTrainingDetails data

        App.reqres.setHandler "new:student:training:module",->
            API.newStudentTrainingModule()

        App.reqres.setHandler "schedule:student:training", (data)->
            API.scheduleStudentTraining data

        App.reqres.setHandler "get:student:training:modules:repository",->
            studentTrainingRepository.clone()