define ['app'
    'controllers/region-controller'], (App, RegionController)->

    App.module "QuizReportApp.Layout", (Layout, App)->

        class Layout.QuizReportLayout extends Marionette.Layout
            template : '<div class="grid-title no-border">
                            <h4 class="">Quiz<span class="semi-bold"> Report</span></h4>
                            <div class="tools">
                                <a href="javascript:;" class="collapse"></a>
                            </div>
                        </div>

                        <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;">
                            <div id="quiz-details-region"></div>

                            <div class="row m-t-20 small">
                                <div class="col-md-4">
                                    Taken By 0 out of {{totalStudents}} students
                                </div>
                                <div class="col-md-8" id="students-filter-region"></div>
                            </div>

                            <div id="students-list-region"></div>

                        </div>'

            className: 'tiles white grid simple vertical green'

            regions:
                quizDetailsRegion   : '#quiz-details-region'
                studentFilterRegion : '#students-filter-region'
                studentsListRegion    : '#students-list-region'

            events:
                'click #addContent a': 'changeTab'

            mixinTemplateHelpers:(data)->

                data.totalStudents = _.size Marionette.getOption @,'students'

                data