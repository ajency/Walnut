define ['app'], (App)->
    App.module "TeacherTrainingFooter.Views", (Views, App)->

        class Views.TrainingFooterView extends Marionette.ItemView

            template : '{{#isChorus}}
                            <h4 class="text-primary semi-bold  p-t-15 p-b-20 p-l-5 p-r-5 ">
                            In a chorus question you will be marking a group of students in the class mode
                            </h4>
                        {{/isChorus}}
                        {{#isIndividual}}
                            <h4 class="text-primary semi-bold  p-t-15 p-b-20 p-l-5 p-r-5 ">
                            Your individual class students will be displayed in the class mode for marking
                            </h4>
                        {{/isIndividual}}
                        '


            mixinTemplateHelpers:(data)->
                data = super data

                data.isChorus = data.isIndividual = false

                if @model.get('content_type') isnt 'content_piece'
                   if @model.get('question_type') is 'chorus'
                       data.isChorus = true
                   if @model.get('question_type') is 'individual'
                       data.isIndividual =true

                data
