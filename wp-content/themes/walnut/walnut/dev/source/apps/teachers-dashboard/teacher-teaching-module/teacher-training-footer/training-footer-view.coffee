define ['app'], (App)->
    App.module "TeacherTrainingFooter.Views", (Views, App)->

        class Views.TrainingFooterView extends Marionette.ItemView

            template : '<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10 m-l-20">
                            <button type="button" id="question-done" class="btn btn-success btn-xs btn-sm">
                                <i class="fa fa-forward"></i> Next Question
                            </button>
                        </div>
                        {{#isChorus}}
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

                data.isChorus = if @question_type is 'chorus' then true else false
                data.isIndividual = if @question_type is 'individual' then true else false

                data

            initialize :->
                console.log 'view '
                @question_type  = Marionette.getOption @,'question_type'

            events :
                'click #question-done' : '_changeQuestion'

            _changeQuestion : ->
                @trigger 'next:question'
