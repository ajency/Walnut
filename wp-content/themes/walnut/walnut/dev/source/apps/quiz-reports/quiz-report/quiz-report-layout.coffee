define ['app'
    'controllers/region-controller'], (App, RegionController)->

    App.module "QuizReportApp.Layout", (Layout, App)->

        class Layout.QuizReportLayout extends Marionette.Layout
            template : '<button type="button" id="go-back-button" class="btn btn-white btn-cons m-t-10">
                            <h4 class="bold  text-info no-margin">
                                <span class="fa fa-arrow-circle-left"></span>
                                Back to List of Quizzes
                            </h4>
                        </button>
                        <div class="tiles white grid simple vertical green">
                            <div class="grid-title no-border">
                                <h4 class="">Quiz<span class="semi-bold"> Report</span></h4>
                                <div class="tools">
                                    <a href="javascript:;" class="collapse"></a>
                                </div>
                            </div>

                            <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;">
                                <div id="quiz-details-region"></div>

                                <div class="row m-t-20 small">
                                    <div class="col-md-4">
                                        <span class="small">Taken By {{takenBy}} out of {{totalStudents}} students</span>
                                    </div>
                                    <div class="col-md-8" id="students-filter-region"></div>
                                </div>

                                <div id="students-list-region"></div>

                            </div>
                        </div>'

            regions:
                quizDetailsRegion   : '#quiz-details-region'
                studentFilterRegion : '#students-filter-region'
                studentsListRegion    : '#students-list-region'

            events:
                'click #addContent a': 'changeTab'
                'click #go-back-button':-> App.navigate "quiz-report", true

            mixinTemplateHelpers:(data)->

                data.totalStudents  = _.size Marionette.getOption @,'students'
                data.takenBy        = Marionette.getOption @, 'takenBy'

                data