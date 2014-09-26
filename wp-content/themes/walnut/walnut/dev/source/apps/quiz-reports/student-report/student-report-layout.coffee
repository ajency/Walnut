define ['app'
    'controllers/region-controller'], (App, RegionController)->

    App.module "StudentReportApp", (StudentReportApp, App)->

        class StudentReportApp.Layout extends Marionette.Layout
            template : '<div class="grid-title no-border">
                            <h4 class="">Taken By: {{display_name}} <span class="m-l-20">Roll Number: {{roll_no}}</span></h4>
                            <div class="tools">
                                <a href="javascript:;" class="collapse"></a>
                            </div>
                        </div>

                        <div class="grid-body no-border contentSelect">
                            <div id="students-filter-region"></div>

                            <div id="quiz-list-region"></div>

                        </div>'

            className: 'tiles white grid simple vertical green'

            regions:
                studentFilterRegion : '#students-filter-region'
                quizListRegion    : '#quiz-list-region'