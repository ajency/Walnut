define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/student-report/quiz-list/item-views'], (App, RegionController)->
    App.module "StudentReportApp.QuizList.Views", (Views, App)->

        class Views.QuizListView extends Marionette.CompositeView

            template : '<div class="col-lg-12">
                            <table class="table table-bordered m-t-15" id="quiz-table" >                                
                                <thead>
                                    <tr>
                                        <th>Quiz Name</th>
                                        <th>Textbook</th>
                                        <th>Chapter</th>
                                        <th>Time Taken</th>
                                        <th>Type</th>
                                        <th>Last Marks Obtained</th>
                                        <th>Attempt</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="list-students" class="rowlink"></tbody>
                            </table>

                            <div id="pager" class="pager">
                                <i class="cursor fa fa-chevron-left prev"></i>
                                <span style="padding:0 15px"  class="pagedisplay"></span>
                                <i class="cursor fa fa-chevron-right next"></i>
                                <select class="pagesize">
                                    <option selected value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>'

            className: 'row'

            itemView: Views.ListItemView

            emptyView: Views.EmptyView

            itemViewContainer: '#list-students'

            itemViewOptions:(model, index)->
                quizResponseSummaries = Marionette.getOption @,'quizResponseSummaries'
                summaries = quizResponseSummaries.where 'collection_id' : model.id
                textbookNames =  Marionette.getOption @,'textbookNames'

                data=
                    summaries       : summaries
                    textbookNames   : textbookNames

            onShow:->
                pagerOptions =
                    container : @$el.find ".pager"
                    output : '{startRow} to {endRow} of {totalRows}'

                @$el.find '#quiz-table'
                .tablesorter()
                .tablesorterPager pagerOptions