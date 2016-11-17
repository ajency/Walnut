define ['app'
    'controllers/region-controller'], (App, RegionController)->

    App.module "StudentReportApp", (StudentReportApp, App)->

        class StudentReportApp.Layout extends Marionette.Layout
            template : '{{#ownReport}}
                        <div class="tiles white grid simple vertical green">
                            <div class="grid-title no-border">
                                <h4 class="">Quizzes Taken</h4>
                                <div class="tools">
                                    <a href="javascript:;" class="collapse"></a>
                                </div>
                            </div>
                        {{/ownReport}}
                        {{^ownReport}}
                            <button type="button" class="btn btn-white btn-cons m-t-10 "  id="go-back-button">
                                <h4 class="bold  text-info no-margin">
                                    <span class="fa fa-arrow-circle-left"></span>
                                    Back to List of Quizzes
                                </h4>
                            </button>
                            <div class="tiles white grid simple vertical green">
                                <div class="grid-title no-border">
                                    <h4 class="">Taken By: {{display_name}} <span class="m-l-20">Roll Number: {{roll_no}}</span></h4>
                                    <div class="tools">
                                        <a href="javascript:;" class="collapse"></a>
                                    </div>
                                </div>
                        {{/ownReport}}

                            <div class="grid-body no-border contentSelect">
                                {{^ownReport}}
                                    <div id="students-filter-region"></div>
                                {{/ownReport}}
                                <div id="quiz-list-region"></div>
                            </div>
                        </div>'

            regions:
                studentFilterRegion : '#students-filter-region'
                quizListRegion    : '#quiz-list-region'

            events:
                'click #go-back-button': 'navigateToQuizReport'

            navigateToQuizReport:->
                App.navigate "quiz-report", true


            mixinTemplateHelpers:(data)->

                data.ownReport = true if Marionette.getOption(@,'display_mode') is 'ownReport'

                data